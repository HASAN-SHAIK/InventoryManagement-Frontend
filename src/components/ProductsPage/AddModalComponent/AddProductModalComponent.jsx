import React, { useEffect, useState } from 'react';
import './AddProductModalComponent.css'; // Add this CSS file
import api from '../../../utils/axios';

const AddProductModalComponent = ({ modalId, title, fields, formData, onChange, onSubmit, navigate }) => {
  const [categories, setCategories] = useState([]);
  useEffect(()=>{
    try{
    const getCategories = async () => {
      const res = await api.get('/orders/getcategories');
      setCategories(res.data);
    }
    getCategories();
  }
    catch(err){
     if((err.response.data && err.response.data.message === 'Invalid Token') || err.response.status === '400' || err.response.status == 401 || err.response.status === 403){
      alert("Token Expired Please Login Again!");
      navigate('/logout');
      }
      else{
        console.log(err);
      }
    }
  },[]);
  return (
    <div className="modal fade" id={modalId} tabIndex="-1" aria-labelledby={`${modalId}Label`} aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered custom-modal-width">
        <form onSubmit={onSubmit}>
          <div className="modal-content custom-modal">
            <div className="modal-header border-0">
              <h5 className="modal-title fw-bold text-primary" id={`${modalId}Label`}>{title}</h5>
              <button type="button" className="btn-close custom-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <div className="modal-body">
              {fields.map(({ label, name, type }) => (
                <div className="form-group mb-3" key={name}>
                  <label htmlFor={name} className="form-label text-muted">{label}</label>
                  {
                    (type === 'select') ? (
                    <select
                        className="form-control custom-input"
                        id={name}
                        name={name}
                        value={formData[name] || ''}
                        onChange={onChange}
                        required
                    >
                        <option value="" disabled>Select {label}</option>
                        { categories.data && categories.data.map((option) => (
                        <option key={option} value={option.category}>{option.category}</option>
                        ))}
                    </select>
                    ): (
                  <input
                    type={type || 'text'}
                    className="form-control custom-input"
                    id={name}
                    name={name}
                    value={formData[name] || ''}
                    onChange={onChange}
                    required
                  />)
                }
                </div>
              ))}
            </div>

            <div className="modal-footer border-0">
              <button type="button" className="btn btn-light custom-btn" data-bs-dismiss="modal">Cancel</button>
              <button type="submit" className="btn btn-primary custom-btn">Save</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModalComponent;