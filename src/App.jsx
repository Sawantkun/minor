import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import SignUp from './components/Signup';
import Login from './components/Login';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; //
import "./App.css"

const App = () => {
  return (
    <Router>
                    <ToastContainer />
      <Routes>
        <Route path='/signup' element={<SignUp />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/login' element={<Login />} />
        <Route path='/' element={<Home />} />
      </Routes>
    </Router>
  )
}

export default App;
