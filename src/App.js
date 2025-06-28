
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
// import {useHistory} from 'react-router-dom'
import Login from './pages/LoginPage';
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
import './App.css'
import LoginPage from './pages/LoginPage';

function App() {
  const location = window.location.pathname;
  const authPages = ['/','/login', '/register','/logout'];
  const [showNavbar, setShowNavbar] = useState(false);
  const [userDetails , setUserDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const routeLocation = useLocation();
  const navigate = useNavigate();
  // const history = useHistory();
  // useEffect(()=>{
  //   if(authPages.includes(location))
  //   setShowNavbar(false);
  // },[window.location.pathname])
  useEffect(()=>{
    if(authPages.includes(location))
      setShowNavbar(false);
    const fetchUserRole = async () => {
      const getUserDetails = await getUserRole();
      setUserDetails(getUserDetails);
      setShowNavbar(true);
    }
    if(userDetails == null && !authPages.includes(location))
      fetchUserRole();
  }, [routeLocation, userDetails,showNavbar, window.location.pathname]);
  return (
    <>
      {showNavbar && <div className='sticky-top'><Navbar user_name={userDetails && userDetails.user_name}/></div>}
      <Routes>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <ThemeProvider>
              <Dashboard navigate={navigate}/>
              </ThemeProvider>
            </ProtectedRoute>
          }
        />
        <Route
        path='/orders'
        element={
          <ProtectedRoute>
            <Orders navigate={navigate} userRole = {userDetails && userDetails.role}/>
          </ProtectedRoute>
        }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <ProductsPage navigate={navigate} userRole = {userDetails && userDetails.role}/>
            </ProtectedRoute>
          }
        />
         <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <Transactions navigate={navigate} userRole = {userDetails && userDetails.role}/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/new-order"
          element={
            <ProtectedRoute>
              <CreateOrderPage userDetails={userDetails} navigate={navigate} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} user_name = {userDetails && userDetails.user_name} user_id ={userDetails && userDetails.id}/>
            </ProtectedRoute>
          }
        />
        <Route
        path='/logout'
        element={
          <ProtectedRoute>
            <Logout setUserDetails={setUserDetails} setShowNavbar={setShowNavbar}/>
          </ProtectedRoute>
        }
        />
        <Route path='*' element={<LoginPage navigate={navigate} setShowNavbar={setShowNavbar}/>} />
      </Routes>
    </>
  );
}

export default App;