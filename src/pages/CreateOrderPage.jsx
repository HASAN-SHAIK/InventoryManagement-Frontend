import React, { useEffect, useState } from 'react';
import api from '../utils/axios';
import { useNavigate } from 'react-router-dom';
import PopUp from '../components/common/PopUp/PopUp';
import { useDispatch, useSelector } from 'react-redux';
import { clearOrderDetails, setOrderDetails } from '../store/orderSlice';

const CreateOrderPage = () => {
  const [categories, setCategories] = useState([]);
  const [saleMethods, setSaleMethods] = useState(['sale', 'purchase', 'personal']);
  const userDetails = useSelector((state) => state.user.userDetails);
  const [transactionType, setTransactionType] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [products, setProducts] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [personalAmount, setPersonalAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const orderDetails = useSelector((state) => state.order.orderDetails);
  const dispatch = useDispatch();
  const navigate = useNavigate();
useEffect(() => {
  (async () => {
    try {
            // Remove 'personal' if not admin
      if (!orderDetails && userDetails.role !== 'admin') {
        setSaleMethods((prev) => prev.filter((method) => method !== 'personal'));
      }
      else if (orderDetails) {
        setSaleMethods((prev) => prev.filter((method) => method === 'sale'));
      }
      if(orderDetails){
        const reconstructedProducts = orderDetails.items.map(item => {
          const clonedItem = JSON.parse(JSON.stringify(item)); // deep clone

          return {
            ...clonedItem,
            id: clonedItem.product_id || clonedItem.id,
            suggestions: [],
          };
        });
        setProducts(reconstructedProducts);
        setTransactionType(orderDetails.type);
        setTotalAmount(parseFloat(orderDetails.total_price));
        setPaymentMethod(orderDetails.payment);
        setPersonalAmount(res.data.order.personal_amount || '');
      }
      const res = await api.get('/orders/getcategories');
      setCategories(res.data);
      
    } catch (err) {
      const message = err?.response?.data?.message;
      const status = err?.response?.status || err?.status;

      if (
        message === 'Invalid Token' ||
        message === 'Access Denied' ||
        status === 400 ||
        status === 401 ||
        status === 403
      ) {
        alert("Token Expired or Access Denied. Please Login Again!");
        navigate('/logout');
      } else {
        console.error("Failed to load categories:", err);
      }
    }
  })();
}, []);
useEffect(() => {
  dispatch(clearOrderDetails()); // Clear order details on mount
}, [navigate]);




  const handleTransactionTypeChange = (e) => {
    setTransactionType(e.target.value);
    setProducts([]);
    setTotalAmount(0);
    setPaymentMethod('');
    setPersonalAmount('');
  };

  const handlePaymentMethodChange = (e) => setPaymentMethod(e.target.value);

  const handleAddProductRow = () => {
    if (transactionType === 'sale') {
      setProducts([...products, { product_name: '', id: null, quantity: '', suggestions: [] }]);
    } else if (transactionType === 'purchase') {
      setProducts([...products, {
        product_name: '', company: '', quantity: '', actual_price: '', selling_price: '', category: '', time_for_delivery: ''
      }]);
    }
  };

  const removeProductRow = (index) => {
    const updated = [...products];
    updated.splice(index, 1);
    setProducts(updated);
    calculateTotal(updated);
  };

  const handleSaleProductSearch = async (text, index) => {
    if (text.length < 2) return;
    try {
      const response = await api.get(`/products/search?name=${text}`);
      const updated = [...products];
      updated[index].suggestions = response.data.products;
      setProducts(updated);
    } catch (err) {
      if ((err.response.data && err.response.data.message === 'Invalid Token') || err.status === 400 || err.response.status === 401 || err.response.status === 403) {
        alert("Token Expired Please Login Again!");
        navigate('/logout');
      } else {
        console.log(err);
      }
    }
  };

  const handleSaleProductSelect = (product, index) => {
    const updated = [...products];
    updated[index] = {
      product_name: product.name,
      id: product.id,
      quantity: 0,
      suggestions: [],
      selling_price: product.selling_price
    };
    setProducts(updated);
    calculateTotal(updated);
  };

  const handlePurchaseProductSearch = async (text, index) => {
  if (text.length < 2) return;
  try {
    const response = await api.get(`/products/search?name=${text}`);
    const updated = [...products];
    updated[index].suggestions = response.data.products;
    setProducts(updated);
  } catch (err) {
    if ((err.response.data && err.response.data.message === 'Invalid Token') || err.status === 400 || err.response.status === 401 || err.response.status === 403) {
      alert("Token Expired Please Login Again!");
      navigate('/logout');
    } else {
      console.log(err);
    }
  }
};

const handlePurchaseProductSelect = (product, index) => {
  const updated = [...products];
  updated[index] = {
    ...updated[index],
    product_name: product.name,
    company: product.company,
    quantity: 1,
    actual_price: product.actual_price,
    selling_price: product.selling_price,
    category: product.category,
    time_for_delivery: '',
    suggestions: [],
  };
  setProducts(updated);
  calculateTotal(updated);
};

  const handleQuantityChange = (value, index) => {
    const updated = [...products];
    updated[index].quantity = value;
    setProducts(updated);
    calculateTotal(updated);
  };

  const handlePurchaseFieldChange = (value, index, field) => {
    const updated = [...products];
    updated[index][field] = value;
    setProducts(updated);
    calculateTotal(updated);
  };
  

  const calculateTotal = (updatedProducts = products) => {
    if (transactionType === 'sale') {
      const total = updatedProducts.reduce((sum, p) => {
        return sum + (parseFloat(p.quantity || 0) * parseFloat(p.selling_price || 0));
      }, 0);
      setTotalAmount(total);
    } else if (transactionType === 'purchase') {
      const total = updatedProducts.reduce((sum, p) => {
        return sum + (parseFloat(p.quantity || 0) * parseFloat(p.actual_price || 0));
      }, 0);
      setTotalAmount(total);
    }
  };

  const handleSubmit = async (key) => {
    setIsLoading(true);
    if(key === 0) {
      navigate('/orders');
      dispatch(clearOrderDetails());
      setIsLoading(false);
      return;
    }
    if (!transactionType) return alert('Select transaction type');

    if ((transactionType === 'sale' || transactionType === 'personal') && !paymentMethod)
      return alert('Select payment method');

    if (transactionType === 'sale') {
      for (const p of products) {
        if (!p.id || !p.quantity) return alert('Select product and quantity');
      }
    } else if (transactionType === 'purchase') {
      for (const p of products) {
        if (!p.product_name || !p.company || !p.quantity || !p.actual_price || !p.selling_price || !p.category || !p.time_for_delivery)
          return alert('Fill all product details');
        if (p.selling_price < p.actual_price)
          return alert('Actual Price is Less than Selling price');
      }
    } else if (transactionType === 'personal' && !personalAmount) {
      return alert('Enter amount for personal transaction');
    }

    const payload = {
      transaction_type: transactionType,
      user_id: userDetails.id,
      total_amount: transactionType === 'personal' ? parseFloat(personalAmount) : totalAmount,
      payment_method: paymentMethod,
      products: products.map(p => {
        if (transactionType === 'sale') return { product_id: p.id, quantity: p.quantity, selling_price: p.selling_price };
        if (transactionType === 'purchase') return { ...p };
        return {};
      })
    };

    try {
      if(orderDetails) {
        payload.order_id = orderDetails.id; // Include order ID for updates
        await api.put(`/orders/${orderDetails.id}`, payload);
        dispatch(clearOrderDetails()); // Dispatch updated order details to Redux store
        navigate('/orders');
        return alert('Order Updated!!');
      }
      await api.post('/orders', payload);
      alert('Order Placed!!');
      navigate('/orders');
    } catch (err) {
      if ((err.response.data && err.response.data.message === 'Invalid Token') || err.status === 400 || err.response.status === 401 || err.response.status === 403) {
        alert("Token Expired Please Login Again!");
        navigate('/logout');
      } else {
        alert("Please Enter valid Products/Details!");
        console.log(err);
      }
    }
    finally { 
      setIsLoading(false);
    }
  };
  

  return (
    <div className="container mt-4 p-5 v-100">
      <h3 className='display-5 text-center b-2'>Create New Order</h3>
      <div className="mb-3">
        {saleMethods && saleMethods.map(type => (
          <label key={type} className="me-3">
            <input
              type="radio"
              value={type}
              checked={transactionType === type}
              onChange={handleTransactionTypeChange}
            /> {type}
          </label>
        ))}
      </div>

      <div className="mb-3">
        <label>User Name:</label>
        <input className="form-control" value={userDetails.name} disabled />
      </div>

      {(transactionType === 'sale' || transactionType === 'personal' || transactionType === 'purchase') && (
        <div className="mb-3">
          <label>Payment Method:</label>
          <div>
            {['cash', 'online'].map(method => (
              <label key={method} className="me-3">
                <input
                  type="radio"
                  value={method}
                  checked={paymentMethod === method}
                  onChange={handlePaymentMethodChange}
                /> {method}
              </label>
            ))}
          </div>
        </div>
      )}

      {transactionType === 'sale' && products.map((p, index) => (
        <div className="row mb-2" key={index}>
          <div className="col-md-4">
            <input
              className="form-control"
              placeholder="Search Product"
              value={p.product_name}
              onChange={(e) => {
                const updated = [...products];
                updated[index].product_name = e.target.value;
                setProducts(updated);
                handleSaleProductSearch(e.target.value, index);
              }}
            />
            {p.suggestions?.length > 0 && (
              <ul className="list-group">
                {p.suggestions.map((s, i) => (
                  s.stock_quantity > 0 ?
                    <li
                      key={i}
                      className="list-group-item list-group-item-action"
                      onClick={() => handleSaleProductSelect(s, index)}
                    >
                      {s.name + " - " + s.company + '(Rs. ' + s.selling_price + ')'}
                    </li>
                    : <li className="list-group-item list-group-item-action text-danger" disabled>
                      {s.name + '(Out Of Stock)'}
                    </li>
                ))}
              </ul>
            )}
          </div>
          <div className="col-md-2">
            <input
              type="number"
              className="form-control"
              placeholder="Quantity"
              value={p.quantity}
              onChange={(e) => handleQuantityChange(e.target.value, index)}
              disabled={!p.id}
            />
          </div>
          <div className="col-md-1 d-flex align-items-center">
            <button className="btn btn-danger btn-sm" onClick={() => removeProductRow(index)}>×</button>
          </div>
        </div>
      ))}

  {transactionType === 'purchase' && products.map((p, index) => (
  <div className="row mb-2" key={index}>
    {['product_name', 'company', 'quantity', 'actual_price', 'selling_price', 'category', 'time_for_delivery'].map((field) => (
      <div className="col" key={field}>
        {field === 'product_name' ? (
          <>
            <input
              className="form-control"
              placeholder="Product Name"
              value={p.product_name}
              onChange={(e) => {
                handlePurchaseFieldChange(e.target.value, index, 'product_name');
                handlePurchaseProductSearch(e.target.value, index);
              }}
            />
            {p.suggestions?.length > 0 && (
              <ul className="list-group">
                {p.suggestions.map((s, i) => (
                  <li
                    key={i}
                    className="list-group-item list-group-item-action"
                    onClick={() => handlePurchaseProductSelect(s, index)}
                  >
                    {s.name} - {s.company} (₹{s.actual_price})
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : field === 'category' ? (
          <>
            <input
              list="categories-list"
              className="form-control"
              placeholder="Category"
              value={p.category}
              onChange={(e) => handlePurchaseFieldChange(e.target.value, index, 'category')}
            />
            <datalist id="categories-list">
              {categories.data && categories.data.map((cat, idx) => (
                <option key={idx} value={cat.category} />
              ))}
            </datalist>
          </>
        ) : (
          <input
            className="form-control"
            placeholder={field.replace(/_/g, ' ')}
            value={p[field]}
            onChange={(e) => handlePurchaseFieldChange(e.target.value, index, field)}
          />
        )}
      </div>
    ))}
    <div className="col-1 d-flex align-items-center">
      <button className="btn btn-danger btn-sm" onClick={() => removeProductRow(index)}>×</button>
    </div>
  </div>
))}


      {transactionType && transactionType !== 'personal' && (
        <div className="mb-3">
          <button className="btn btn-secondary" onClick={handleAddProductRow}>Add Product</button>
        </div>
      )}

      {transactionType === 'personal' && (
        <div className="mb-3">
          <label>Total Amount:</label>
          <input
            type="number"
            className="form-control"
            value={personalAmount}
            onChange={(e) => setPersonalAmount(e.target.value)}
          />
        </div>
      )}

      {(transactionType === 'sale' || transactionType === 'purchase') && (
        <div className="mb-3">
          <strong>Total: ₹{totalAmount.toFixed(2)}</strong>
        </div>
      )}

      <button className="btn btn-danger m-1" onClick={()=>handleSubmit(0)}>{ isLoading ? <div class="spinner-border spinner-style text-light" role="status"></div> : `Cancel`}</button>
      <button className="btn btn-primary m-1" onClick={()=>handleSubmit(1)}>{ isLoading ? <div class="spinner-border spinner-style text-light" role="status"></div> : `Create Order`}</button>
    </div>
  );
};

export default CreateOrderPage;
