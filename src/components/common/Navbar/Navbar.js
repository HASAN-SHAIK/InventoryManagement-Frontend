import React, { useState } from 'react';
// import { Modal } from 'bootstrap'
import { useNavigate } from "react-router-dom";
import './Navbar.css'
// import CreateOrderModal from '../../OrdersPage/CreateOrderModal/CreateOrderModal';


const Navbar = ({user_name}) => {
      const navigate = useNavigate();
      const navigateTo = (route) => {
        navigate(route);
      };
      // const [showModal, setShowModal] = useState(false);
      // const [orderCreated, setOrderCreated] = useState(false);
    
      // const handleOpenModal = () => setShowModal(true);
    
      // const handleCloseModal = () => {
      //   setShowModal(false);
      //   // Cleanup backdrop manually just in case
      //   const backdrops = document.querySelectorAll('.modal-backdrop');
      //   backdrops.forEach(b => b.remove());
      //   document.body.classList.remove('modal-open');
      //   document.body.style = ''; // clear any leftover styles
      // };
    
      // const handleOrderCreated = () => {
      //   setOrderCreated(true);
      //   // Refresh order list or show toast if needed
      // };
    


  return (
    <div className=' navbar-style'>
        <div className="custom-navbar d-flex justify-content-between align-items-center sticky-top">
            <h4 className="companyName"><button onClick={() => navigateTo('/dashboard')} className='m-1 btn companyName fs-3 btn-block'><i class="bi bi-motherboard fs-3 m-1"></i>Hasan Inventory</button></h4>
             <button className="btn newOrderBtn fw-bold" onClick={() => navigateTo('/new-order')}>
               {/* <i class="bi bi-mailbox fs-4 p-1  text-success"></i> */}
               <span className='fs-5'>New Order</span>
           </button>
         
        {/* <CreateOrderModal
          user_name={user_name}
          modalId="createOrderModal"
          onClose={handleCloseModal}
          onOrderCreated={handleOrderCreated}
        /> */}

              {/* <CreateOrderModal  user_name={user_name}/> */}
            <div className="btn-group">
            <button className="btn btn-outline-primary" onClick={() => navigateTo('/dashboard')}><i class="bi bi-speedometer2 fs-6"><span className='m-1'>Dashboard</span></i></button>
            <button className="btn btn-outline-primary" onClick={() => navigateTo('/orders')}><i class="bi bi-collection fs-6"><span className='m-1'>Orders</span></i></button>
            <button className="btn btn-outline-primary" onClick={() => navigateTo('/products')}><i class="bi bi-box-seam fs-6"><span className='m-1'>Products</span></i></button>
            <button className="btn btn-outline-primary" onClick={() => navigateTo('/transactions')}><i class="bi bi-credit-card fs-6"><span className='m-1'>Transactions</span></i></button>
            <button className="btn btn-outline-danger" onClick={() => navigateTo('/logout')}><i class="bi bi-box-arrow-right fs-6"><span className='m-1'>Logout</span></i></button>
            </div>
        </div>
    </div>
  );
};

export default Navbar;