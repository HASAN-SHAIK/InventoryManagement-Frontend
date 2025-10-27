import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/common/protectedRoute';
import { ThemeProvider } from './ThemeContext';
import Orders from './pages/Orders';
import Navbar from './components/common/Navbar/Navbar';
import { useEffect, useState } from 'react';
import ProductsPage from './components/ProductsPage/ProductsPage';
import Transactions from './pages/Transactions';
import CreateOrderPage from './pages/CreateOrderPage';
import './App.css';
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
import Logout from './pages/Logout';
import { clearUserDetails } from './store/userSlice';

function App() {
  const location = window.location.pathname;
  const authPages = ['/', '/login', '/register', '/logout'];
  const userDetails = useSelector((state) => state.user.userDetails);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = Cookies.get('token');
    
    // if (!token) {
    //   dispatch(clearUserDetails());
    // } 
  }, []);
  return (
    <>
      {userDetails && !authPages.includes(location) && <div className='sticky-top'><Navbar user_name={userDetails && userDetails.user_name} /></div>}
      <Routes>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <ThemeProvider>
                <Dashboard navigate={navigate} />
              </ThemeProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path='/orders'
          element={
            <ProtectedRoute>
              <Orders navigate={navigate} userRole={userDetails && userDetails.role} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <ProductsPage navigate={navigate} userRole={userDetails && userDetails.role} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <Transactions navigate={navigate} userRole={userDetails && userDetails.role} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/neworder"
          element={
            <ProtectedRoute>
              <CreateOrderPage  />
            </ProtectedRoute>
          }
        />
        <Route
          path='/logout'
          element={
            <ProtectedRoute>
              <Logout />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={userDetails ? <Navigate to="/dashboard" replace />: <LoginPage navigate={navigate}/>} />
      </Routes>
    </>
  );
}

export default App;
