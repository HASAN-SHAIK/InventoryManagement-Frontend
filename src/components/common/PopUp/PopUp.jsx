import React from 'react';
import './PopUp.css'; // We'll create this CSS file next

const PopUp = ({ title, message, onClose, isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <p>{message}</p>
        </div>
        {/* <div className="modal-footer">
          <button className="modal-button" onClick={onClose}>
            Close
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default PopUp;