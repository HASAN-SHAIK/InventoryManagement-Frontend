import React, { useState, useEffect } from 'react';
import './EditOrderModal.css';

const EditOrderModal = ({ completeOrder, onClose, onSubmit, setOrderUpdateFlag, navigate }) => {
  const [products, setProducts] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState(completeOrder.payment);

  useEffect(() => {
    if (completeOrder) {
      setProducts(completeOrder.items || []);
      calculateTotal(completeOrder.items || []);
    }
  }, [completeOrder]);

  const handleQuantityChange = (index, value) => {
    const updatedProducts = [...products];
    updatedProducts[index].quantity = parseInt(value) || 0;
    setProducts(updatedProducts);
    calculateTotal(updatedProducts);
  };

  const handlePriceChange = (index, value) => {
    const updatedProducts = [...products];
    updatedProducts[index].price = parseFloat(value) || 0;
    setProducts(updatedProducts);
    calculateTotal(updatedProducts);
  };

  const calculateTotal = (productsList) => {
    const total = productsList.reduce((acc, item) => acc + (item.quantity * item.selling_price), 0);
    setTotalAmount(total);
  };

  const handleSubmit = () => {
  
    const updatedOrder = {
      products,
      totalAmount,
      payment_mode: paymentMethod,
      transaction_type: completeOrder.type
    };
    onSubmit(updatedOrder);
    setOrderUpdateFlag(true);
  };

  if (!completeOrder) return null;

  return (
    <div className="edit-order-modal modal-overlay p-3">
      <div className="modal-content d-flex align-items-center">
        {/* <h2 className='fw-bold m-3'>Edit Order</h2> */}
        {/* <div className="product-group">
          <label className='form-label'>Order ID</label>
          <input className='form-control' type="text" value={completeOrder.id} disabled />
        </div> */}
      {/* <select id='payment_method' className='w-50 my-3 text-center'>
        <option value='cash'>Cash</option>
        <option value='online'>Online</option>
      </select> */}
      <div>
      {/* <select class="form-select" id='payment_method' aria-label="Default select example">
        <option value="cash" onChange={()=>setPaymentMethod('cash')} selected={completeOrder.payment === 'cash'}>Cash</option>
        <option value="online" onChange={()=>setPaymentMethod('online')} selected={completeOrder.payment === 'online'}>Online</option>
      </select> */}
      <button onClick={()=> setPaymentMethod('cash')} className={paymentMethod === 'cash'? 'btn btn-success': 'btn btn-outline-success'}>Cash</button>
      <button onClick={()=> setPaymentMethod('online')} className={paymentMethod === 'online'? 'btn btn-success m-3': 'btn btn-outline-success m-3'}>Online</button>
      </div>
      {/* <h3>Products</h3> */}
        {/* <div className='d-flex align-items-between'>
          <h4 className='m-3'>Name</h4>
          <h4>Quantity</h4>
          <h4>Price</h4>
        </div> */}
        {products.map((product, index) => (
          <div key={index} className="product-group">
            <label className='form-label fs-6 fw-bold'> {product.name || product.product_name}</label>
            <input
              className='form-control'
              type="number"
              placeholder="Quantity"
              value={product.quantity}
              onChange={(e) => handleQuantityChange(index, e.target.value)}
            />
            <input
              className='form-control'
              type="number"
              placeholder="Price"
              value={product.selling_price}
              onChange={(e) => handlePriceChange(index, e.target.value)}
            />
          </div>
        ))}

        <div className="product-group mt-5">
          <label className='form-label fw-bolder fs-3 text-primary'>Total Amount</label>
          <input className='form-control' type="text" value={totalAmount} disabled />
        </div>

        <div className="modal-actions d-flex justify-content-center p-3">
        <button className='btn btn-outline-danger m-3' onClick={onClose}>Cancel</button>
          <button className='btn btn-outline-success m-3' onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
};

export default EditOrderModal;