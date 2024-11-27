import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; //
import "./App.css"
import SignUp from './pages/Signup';
import Login from './pages/Login'
import Profile from './components/Profile'
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const App = () => {
    const initialOptions = {
        "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
        currency: "USD",
        intent: "capture",
        "enable-funding": "card",
        // If you want to accept multiple currencies, you can specify them here
        "merchant-id": "",  // Your PayPal merchant ID if you have one
      };
  return (
    <PayPalScriptProvider
    options={initialOptions}
    >
    <Router>
      <ToastContainer />
      <Routes>
        <Route path='/signup' element={<SignUp />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/login' element={<Login />} />
        <Route path='/' element={<Home />} />
      </Routes>
    </Router>
    </PayPalScriptProvider>
  )
}

export default App;
