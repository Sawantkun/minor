import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import SignUp from './components/Signup';
import Login from './components/Login';
import Home from './pages/Home';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/SignUp' element={<SignUp />} />
        <Route path='/Login' element={<Login />} />
        <Route path='/' element={<Home />} />
      </Routes>
    </Router>
  )
}

export default App;