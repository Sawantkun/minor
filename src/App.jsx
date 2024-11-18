import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import SignUp from './components/Signup';
import Login from './components/Login';
import Home from './pages/Home';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; //

const App = () => {
  return (
    <Router>
                    <ToastContainer />
      <Routes>
        <Route path='/SignUp' element={<SignUp />} />
        <Route path='/Login' element={<Login />} />
        <Route path='/' element={<Home />} />
      </Routes>
    </Router>
  )
}

export default App;
