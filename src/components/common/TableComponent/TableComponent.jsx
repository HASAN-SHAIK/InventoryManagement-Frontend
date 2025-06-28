import React, { useEffect } from "react";
import { useState } from "react";
import "./TableComponent.css";
import api from "../../../utils/axios";
import EditProductModal from "../../ProductsPage/EditOrderModal/EditProductModal";

const TableComponent = ({ title, columns, data, setProductUpdateFlag, color }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  
  const handleEditClick = (item) => {
    setSelectedItem(item);
    setShowEditModal(true);
  };

  const handleSubmitEdit = async (updatedProduct) => {
    try {
      const response = await api.put(`/products/${updatedProduct.id}`, updatedProduct);
  
      if (response.status === 200) {
        alert('Product updated successfully!');
        handleCloseModal();
      }
      setProductUpdateFlag(true);
    } catch (error) {
      console.error('Failed to update order:', error);
      alert('Error updating order', error);
    }
  };
  const handleCloseModal = () => {
    setShowEditModal(false);
    setSelectedItem(null);
  };
  return (
    <div  className="table-box text-center">

      <h4 style={{color: color}}> {title}</h4>
      <table className="responsive-table">
      {/* <div className="floating-shape circle red"></div>
      <div className="floating-shape triangle purple"></div> */}
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th  key={i}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
        {/* <div className="floating-shape tablecircle red"></div>
        <div className="floating-shape triangle purple"></div>
        <div className="floating-shape square yellow"></div>
        <div className="floating-shape wave pink"></div>
        <div className="floating-shape tablering orange"></div>
        <div className="floating-shape tablecube green"></div> */}
          {data && data.length > 0 ? data.map((row, i) => (
            <tr key={i}>
              {columns.map((col, j) => (
                (col.toLowerCase() === 'edit')? <button onClick={() => handleEditClick(row)} className="btn btn-info m-1"> Edit</button> :
                <td key={j}>{row[col.toLowerCase()]}</td>
              ))}
            </tr>
          )) : (
            <tr><td colSpan={columns.length}>No Data</td></tr>
          )}
        </tbody>
      </table>
      {showEditModal && (
        <EditProductModal
          item={selectedItem}
          columns = {columns}
          onClose={handleCloseModal}
          onSubmit={handleSubmitEdit}
        />
      )}
    </div>
  );
};

export default TableComponent;