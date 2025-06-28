import React, { useState, useEffect } from 'react';
import './ProductsPage.css'; // Custom styles
import TableComponent from '../common/TableComponent/TableComponent';
import api from '../../utils/axios';
import { Modal } from 'bootstrap';
import AddProductModalComponent from './AddModalComponent/AddProductModalComponent';

const ProductsPage = ({ userRole, navigate }) => {
//Modal data
 const [showEditModal, setShowEditModal] = useState(false);
 const [selectedOrder, setSelectedOrder] = useState(null);
 const [productUpdateFlag, setProductUpdateFlag] = useState(false);
const [formData, setFormData] = useState({
  product_name: '',
    company: '',
    selling_price: '',
    actual_price: '',
    stock_quantity: '',
    category: '',
    time_for_delivery: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditClick = (order) => {
    setSelectedOrder(order);
    setShowEditModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post('/products', formData); // Your endpoint
      // Optional: show success toast, close modal, refresh product list
      setFormData({
        product_name: '',
        company: '',
        category:'',
        selling_price: '',
        actual_price: '',
        stock_quantity: '',
        time_for_delivery: ''
      });
      const modalElement = document.getElementById('addProductModal');
      const modal = Modal.getInstance(modalElement);
      modal.hide();

    } catch (err) {
      if(err.response.data.message === 'Invalid Token' || err.response.status === '400' || err.response.status == '401' || err.response.status === '403'){
      alert("Token Expired Please Login Again!");
      navigate('/login');
      }
      else{
      alert("Issue while adding please try later")
      console.error('Error adding product:', err);
      }
    }
    setProductUpdateFlag(true).then(()=> alert("Product Added Successfully!"));
    
  };

  const productFields = [
    { label: 'Product Name', name: 'product_name' },
    { label: 'Company', name: 'company' },
    { label: 'Category', name: 'category',type:'select', options: ['Electronics', 'Construction', 'Furniture', 'Accessories'], },
    { label: 'Selling Price', name: 'selling_price', type: 'number' },
    { label: 'Actual Price', name: 'actual_price', type: 'number' },
    { label: 'Quantity', name: 'stock_quantity', type: 'number' },
    { label: 'Time For Delivery', name:'time_for_delivery', type: 'number'},
  ];

  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts().then(()=> setIsLoading(false));
  }, [productUpdateFlag]);

  const fetchProducts = async () => {
    try{
    const response = await api.get('/products');
    setProducts(response.data);
    }
    catch(err){
     if((err.response.data && err.response.data.message === 'Invalid Token') || err.status === 400 || err.response.status == 401 || err.response.status === 403){
      alert("Token Expired Please Login Again!");
      navigate('/login');
      }
      else{
        console.log(err);
      }
    }
  };

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const handleSort = (e) => setSortBy(e.target.value);

  const filteredProducts = products
    .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (!sortBy) return 0;
      return a[sortBy].localeCompare(b[sortBy]);
    });
    const handleOpenModal = () => {
        const modalElement = document.getElementById('addProductModal');
        const bootstrapModal = new Modal(modalElement);
        setShowModal(true);
        bootstrapModal.show();
    }

  return (
    
      isLoading ? 
      <div className='p-5 d-flex justify-content-center align-items-center'>
      <div class="text-center spinner-border" role="status"></div> 
      </div>
     :
    <div style={{background:'linear-gradient(to right top, #6ba0f6, #0c52bb)'}}>
    <div className="container-fluid pt-4">
      <div className="d-flex float-end">
        {userRole === 'admin' &&<div><button className={`btn btn-success form-control mx-3 `} onClick={() => handleOpenModal(true)}>Add Product</button></div>}
      </div>

      <div className="d-flex mb-3 gap-3">
        <input className="form-control" placeholder="Search products..." value={searchTerm} onChange={handleSearch} />
        <select className="form-select" onChange={handleSort}>
          <option value="">Sort by</option>
          <option value="name">Name</option>
          <option value="company">Company</option>
        </select>
        
      </div>

      <TableComponent
        columns={['Name', 'Company', 'Selling_Price', ...(userRole === 'admin' ? ['Actual_Price'] : []), 'Quantity', ...(userRole === 'admin' ? ['Edit'] : [])]}
        data={filteredProducts}
        isAdmin={userRole === 'admin'}
        setProductUpdateFlag={setProductUpdateFlag}
      />

        <AddProductModalComponent navigate={navigate} setProductUpdateFlag={setProductUpdateFlag}  modalId="addProductModal" title="Add Product" fields={productFields} formData={formData} onChange={handleChange} onSubmit={handleSubmit} onClose={() => setShowModal(false)} onProductAdded={fetchProducts} />
    </div>
    </div>
  );
};

export default ProductsPage;