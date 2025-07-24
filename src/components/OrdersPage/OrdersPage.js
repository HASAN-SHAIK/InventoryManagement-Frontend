import React, { useState, useEffect } from 'react';
import api from '../../utils/axios'; // assuming custom axios instance
import './OrdersPage.css'; // optional custom styles
import TableComponent from '../common/TableComponent/TableComponent';
import EditOrderModal from './EditOrderModal/EditOrderModal';
import LoadingSpinner from '../common/LoadingSpinner/LoadingSpinner';
import { setOrderDetails } from '../../store/orderSlice';
import { useDispatch } from 'react-redux';
const OrdersPage = ({ userRole, navigate }) => {
 const columns = ["OrderId", "Products", "Price", "TotalPrice", "ByUser", "Date", "Edit"]
 const [orders, setOrders] = useState([]);
 const [filteredOrders, setFilteredOrders] = useState([]);
 const [search, setSearch] = useState('');
 const [sortBy, setSortBy] = useState('orderId');
 const [orderUpdateFlag, setOrderUpdateFlag] = useState(0);
 const [showEditModal, setShowEditModal] = useState(false);
 const [selectedOrder, setSelectedOrder] = useState(null);
 const [orderId, setOrderId] = useState(null);
 const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
 

 const handleEditClick = (order) => {
  // Assuming you have a Redux action to set order details
   dispatch(setOrderDetails(order));
   navigate('/neworder')
  //  console.log(order)
  //  setSelectedOrder(order);
  //  setShowEditModal(true);
 };

 const handleCloseModal = () => {
   setShowEditModal(false);
   setSelectedOrder(null);
   setOrderUpdateFlag(true);
 };
 useEffect(() => {
   handleSearch(search);
 }, [orders]);
 const fetchOrders = async () => {
   try {
     const res = await api.get('/orders');
     console.log("Orders", res.data.orders);
     setOrders(res.data.orders);
     setFilteredOrders(res.data.orders);
   } catch (err) {
    if(err.response.data.message === 'Invalid Token' || err.response.status === '400' || err.response.status == '401' || err.response.status === '403'){
      alert("Token Expired Please Login Again!");
      navigate('/logout');
    }
    else{
     console.error("error While getting orders", err);
   }
  }
 };
 const handleSearch = (value) => {
   setSearch(value);
   const filtered = orders.filter(order =>
     order.id
   );
   setFilteredOrders(filtered);
 };
 const handleSort = (key) => {
   setSortBy(key);
   const sorted = [...filteredOrders].sort((a, b) => {
     if (key === 'date') return new Date(b.order_date) - new Date(a.order_date);
    //  console.log(a[key], b[key]);
     return a[key]-b[key];
   });
   setFilteredOrders(sorted);
 };
 const handlePaymentClick = async (id, type) => {
  try{
  const res = await api.post('/orders/mark-paid', {
    order_id: id,
    type: type
  });
  // const Id = id +"payment"
  // const element = document.getElementById(Id);
  // element.innerHTML = 'Done';
  // element.classList.remove('btn-outline-success');
  // element.classList.add('btn-success');
  alert("Marked as paid");
  setOrderUpdateFlag(1);
}
catch(err){
  if(err.response.data.message === 'Invalid Token'){
      alert("Token Expired Please Login Again!");
      navigate('/logout');
  }
  else
  alert("Error while processing payment Please Try Again!")
  console.log("Error while marking payment", err)
}

 }
 const handleOrderDelete =async(id) => {
  try {
    setOrderUpdateFlag(1);
    const res = await api.delete(`/orders/${id}`);
    const Id = id +"delete"
    const element = document.getElementById(Id);
    element.innerHTML = 'Deleted';
    element.classList.add('disabled')    
    alert("Deleted Successfully");
  } catch (error) {
    console.log("problem in Deleting the Order", error);
  }
 }
 const handleSubmitEdit = async (updatedOrder) => {
  try {
    const response = await api.put(`/orders/${selectedOrder.id}`, updatedOrder);

    if (response.status === 200) {
      alert('Order updated successfully!');
      handleCloseModal();
    }
    setOrderUpdateFlag(true);
  }
  catch(err){
  if(err.response.data.message === 'Invalid Token'){
      alert("Token Expired Please Login Again!");
      navigate('/logout');
  }
  else
  alert("Error while processing payment Please Try Again!")
  console.log("Error while marking payment", err)
}
};
 useEffect(() => {
  fetchOrders().then(()=> setIsLoading(false))
  // setIsLoading(false);
}, [orderUpdateFlag]);
 return (
  
    isLoading ?
    <div style={{height: '100vh'}}>
   <LoadingSpinner/>
   </div>
    :
    <>
<div className="container-fluid pt-5 ">
     {/* Navbar */}
{/* Header and Controls */}
<div className="text-center mb-4">
{/* <h5 className="bg-warning p-2 rounded">Company Name</h5> */}
<div className="row justify-content-around mt-4">
<div className="col-md-6  ">
<input
             type="text"
             placeholder="Search by OrderId"
             className="form-control"
             value={search}
             onChange={(e) => handleSearch(e.target.value)}
           />
</div>
<div className="col-md-4">
<select
             className="form-select"
             onChange={(e) => handleSort(e.target.value)}
             value={sortBy}
>
<option value="date">Sort by Date</option>
<option value="id">Sort by OrderId</option>
</select>
</div>
</div>
</div>
{/* <TableComponent columns={columns} data = {orders && orders.orders}/> */}
     {/* Table */}
<div  className="table-responsive orderspage orders-table">
<table className="table table-hover  text-center align-middle small">
<thead className="">
<tr className='p-3'>
<th>OrderId</th>
<th>Products</th>
<th>Price</th>
<th>TotalPrice</th>
<th>ByUser</th>
<th>Status</th>
<th>Date</th>
{userRole === 'admin' && <th>Edit</th>}
<th>Make Payment</th>
<th>Delete</th>
</tr>
</thead>
<tbody>
           {filteredOrders && filteredOrders.map((order, idx) => (
order.type === 'personal' ? null : <tr key={idx}>
<td>{order.id}</td>
<td className='fw-bold'>
                 {order.items.length>0 ? order.items.map(p => (
<div>{p.product_name} x {p.quantity}</div>
                 )) : <div className='text-success'>Purchased Items</div>}
</td>
<td>
                 {order.items && order.items.map(p => <div>{p.selling_price}</div>)}
</td>
<td>{order.total_price}</td>
<td>{order.username}</td>
<td class={order.order_status === 'completed'? 'text-success fw-bold': 'text-danger fw-bold'} >{order.order_status}</td>
<td>{order.order_date}</td>
               {userRole === 'admin' && (
<td>
<button className='btn btn-info' onClick={() => handleEditClick(order)} disabled={order.order_status === 'completed'}>Edit</button>

{showEditModal && order && (
  <EditOrderModal
    completeOrder={selectedOrder}
    onClose={handleCloseModal}
    onSubmit={handleSubmitEdit}
    setOrderUpdateFlag={setOrderUpdateFlag}
    navigate={navigate}
  />
)}
</td>
               )}
<td >
    {order.order_status === 'pending' ? order.payment === 'cash'
    ? <button onClick={() => handlePaymentClick(order.id, order.type, order.payment)} className='btn btn-outline-success'>Mark as Paid</button> 
    : <button type="button" class="btn btn-outline-success" data-bs-toggle="modal" data-bs-target={`#exampleModal-${order.id}`}>
      Pay Now
      </button>
    : 'Done'}

    {/* <!-- Modal --> */}
<div  class="modal fade" id={`exampleModal-${order.id}`} tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content" style={{width: '100% !important'}}>
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">payment QR</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div style={{fontFamily: 'sans-serif', fontSize: 40}}> <span className='fw-bold'>Rs. {order.total_price}</span></div>
        <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQG2YbnRpjVi-n9hZYm-mifpv6YGaYaiEyfxg&s' />
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onClick={()=> handlePaymentClick(order.id, order.type, order.payment)}>Payment Received</button>
      </div>
    </div>
  </div>
</div>
</td>
<td>
  <button id={order.id+"delete"} onClick={() => handleOrderDelete(order.id)} className='btn btn-sm btn-danger' disabled={order.order_status === 'completed'}>Delete</button>
</td>
</tr>
           ))}
           {filteredOrders.length === 0 && (
<tr>
<td colSpan={userRole === 'admin' ? 7 : 6}>No orders found.</td>
</tr>
           )}
</tbody>
</table>
</div>
{/* <!-- Button trigger modal --> */}



</div>
</>

 );
};
export default OrdersPage;