import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/common/protectedRoute';
import { ThemeProvider } from './ThemeContext';
import Orders from './pages/Orders';
import { getUserRole } from './utils/auth';
import Navbar from './components/common/Navbar/Navbar';
import { useEffect, useState } from 'react';
import Logout from './pages/Logout';
import ProductsPage from './components/ProductsPage/ProductsPage';
import Transactions from './pages/Transactions';
import CreateOrderPage from './pages/CreateOrderPage';
import './App.css';

function App() {
  const location = window.location.pathname;
  const authPages = ['/', '/login', '/register', '/logout'];
  const [showNavbar, setShowNavbar] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const routeLocation = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const getUserDetails = await getUserRole();
        setUserDetails(getUserDetails);
        setShowNavbar(true);
      } catch (err) {
        console.error('Error fetching user role', err);
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    if (authPages.includes(location)) {
      setShowNavbar(false);
      setIsLoading(false);
    } else {
      fetchUserRole();
    }
  }, [routeLocation]);

  if (isLoading) {
    return (
      <div className='d-flex justify-content-center align-items-center vh-100'>
        <div className="spinner-border" role="status"></div>
      </div>
    );
  }

  return (
    <>
      {showNavbar && <div className='sticky-top'><Navbar user_name={userDetails && userDetails.user_name} /></div>}
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
              <CreateOrderPage userDetails={userDetails} navigate={navigate} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
            </ProtectedRoute>
          }
        />
        <Route
          path='/logout'
          element={
            <ProtectedRoute>
              <Logout setUserDetails={setUserDetails} setShowNavbar={setShowNavbar} />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<LoginPage navigate={navigate} setShowNavbar={setShowNavbar} />} />
      </Routes>
    </>
  );
}

export default App;
