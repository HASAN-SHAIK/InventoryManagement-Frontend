import React, { useState, useEffect } from 'react';
import './EditProductModal.css';

const EditProductModal = ({ item, onClose, onSubmit }) => {

  const [sellingPrice, setSellingPrice] = useState(item.selling_price);
  const [actualPrice, setActualPrice] = useState(item.actual_price);
  const [stockQuantity, setStockQuantity] = useState(item.quantity)


  const handlePriceChange = (value, index = 0) => {
    index === 0?setActualPrice(value): index == 1? setSellingPrice(value): setStockQuantity(value);
  };


  const handleSubmit = () => {
    const updatedProduct = {
      selling_price: sellingPrice,
      actual_price:actualPrice,
      stock_quantity: stockQuantity,
      id: item.id
    };
    onSubmit(updatedProduct);
  };

  if (!item) return null;

  return (
    <div className="modal-overlay edit-product-modal">
      <div className="modal-content d-flex align-items-center">
        {/* <h2 className='fw-bold m-3'>Edit Order</h2> */}
        {/* <div className="product-group">
          <label className='form-label'>Order ID</label>
          <input className='form-control' type="text" value={item.id} disabled />
        </div> */}
      {/* <select id='payment_method' className='w-50 my-3 text-center'>
        <option value='cash'>Cash</option>
        <option value='online'>Online</option>
      </select> */}
      {/* <div> */}
      {/* <select class="form-select" id='payment_method' aria-label="Default select example">
        <option value="cash" onChange={()=>setPaymentMethod('cash')} selected={item.payment === 'cash'}>Cash</option>
        <option value="online" onChange={()=>setPaymentMethod('online')} selected={item.payment === 'online'}>Online</option>
      </select> */}
      {/* <button onClick={()=> setPaymentMethod('cash')} className={paymentMethod === 'cash'? 'btn btn-success m-3': 'btn btn-outline-success m-3'}>Cash</button>
      <button onClick={()=> setPaymentMethod('online')} className={paymentMethod === 'online'? 'btn btn-success m-3': 'btn btn-outline-success m-3'}>Online</button> */}
      {/* </div> */}
      <h3>Edit Product</h3>
        {/* {columns.map((col, index) => (
          <div key={index} className="product-group">
            <label className='form-label fs-6 fw-bold'> col </label>
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
        ))} */}
      <div className='m-1'>
        <label className='col-form-label product-form-label'>Product Name</label>
        <input className='product-form-input' type='string' value={item.name} disabled/>
      </div>
      <div className='m-1'>
        <label className='col-form-label product-form-label'>Company</label>
        <input className='product-form-input' type='string' value={item.company} disabled/>
      </div>
      <div className='m-1'>
        <label className='col-form-label product-form-label'>Actual Price</label>
        <input onChange={(e)=> handlePriceChange(e.target.value)} className='product-form-input' type='Decimal(10,0)' value={actualPrice} />
      </div>
      <div className='m-1'>
        <label className='col-form-label product-form-label'>Selling Price</label>
        <input onChange={(e)=> handlePriceChange(e.target.value, 1)} className='product-form-input' type='Decimal(10,0)' value={sellingPrice} />
      </div>

      <div className='m-1'>
        <label className='col-form-label product-form-label'>Stock Quantity</label>
        <input onChange={(e)=> handlePriceChange(e.target.value, 2)} className='product-form-input' type='Decimal(10,0)' value={stockQuantity} />
      </div>
      

        <div className="modal-actions d-flex justify-content-center p-3">
        <button className='btn btn-outline-danger m-3' onClick={onClose}>Cancel</button>
          <button className='btn btn-outline-success m-3' onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;