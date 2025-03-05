import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import SignUp from './pages/Signup';
import Login from './pages/Login';
import Admin from './pages/Admin/Admin';
import Profile from './components/Profile';
import Error from './pages/Error';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import ProtectedRoute from './hooks/ProtectedRoutes';
import { AuthProvider } from './hooks/AuthContext';

const App = () => {
  const initialOptions = {
    'client-id': import.meta.env.VITE_PAYPAL_CLIENT_ID,
    currency: 'USD',
    intent: 'capture',
    'enable-funding': 'card',
    'merchant-id': '',
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <ToastContainer />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path='/signup' element={<SignUp />} />
            <Route path='/login' element={<Login />} />
            <Route path='/' element={<Home />} />
            <Route path='/NotFound' element={<Error />} />

            <Route
              path='/dashboard'
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path='/profile'
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />

            <Route path='*' element={<Error />} />
          </Routes>
        </Router>
      </AuthProvider>
    </PayPalScriptProvider>
  );
};

export default App;
