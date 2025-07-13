import React, { useState } from 'react';
// import { Modal } from 'bootstrap'
import { useNavigate } from "react-router-dom";
import './Navbar.css'
import api from '../../../utils/axios';
import { useDispatch } from 'react-redux';
import { clearUserDetails } from '../../../store/userSlice';


const Navbar = ({setShowNavbar}) => {
      const navigate = useNavigate();
      const dispatch = useDispatch();

      const navigateTo = (route) => {
        navigate(route);
      };
  const logoutUser = async () => {
    try{
      setIsLoading(true);
      setShowNavbar(false)
      const response = await api.post('/auth/logout');
    }
    catch (error) {
      alert('Logout failed. Please try again.');
       console.error('Logout error:', error);
    }
    finally {
      setIsLoading(false);
    }
  }
    
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className=' navbar-style'>
        <div className="custom-navbar d-flex justify-content-between align-items-center sticky-top">
            <h4 className="companyName"><button onClick={() => navigateTo('/dashboard')} className='m-1 btn companyName fs-3 btn-block'><i class="bi bi-motherboard fs-3 m-1"></i>Hasan Inventory</button></h4>
             <button className="btn newOrderBtn fw-bold" onClick={() => navigateTo('/neworder')}>
              <span className='fs-5'>New Order</span>
           </button>
            <div className="btn-group">
            <button className="btn btn-outline-primary" onClick={() => navigateTo('/dashboard')}><i class="bi bi-speedometer2 fs-6"><span className='m-1'>Dashboard</span></i></button>
            <button className="btn btn-outline-primary" onClick={() => navigateTo('/orders')}><i class="bi bi-collection fs-6"><span className='m-1'>Orders</span></i></button>
            <button className="btn btn-outline-primary" onClick={() => navigateTo('/products')}><i class="bi bi-box-seam fs-6"><span className='m-1'>Products</span></i></button>
            <button className="btn btn-outline-primary" onClick={() => navigateTo('/transactions')}><i class="bi bi-credit-card fs-6"><span className='m-1'>Transactions</span></i></button>
            <button className="btn btn-outline-danger" onClick={async() =>{await logoutUser(); dispatch(clearUserDetails()); navigateTo('/login')}}>{isLoading? <div className="spinner-border fs" role="status"></div>: <i class="bi bi-box-arrow-right fs-6"><span className='m-1'>Logout</span></i>}</button>
            </div>
        </div>
    </div>
  );
};

export default Navbar;
