import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from './AuthContext';

const ProtectedRoute = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { userData, isAdmin } = useAuth();

    if (!userData) {
        navigate('/login');
        return null;
    }

    if (location.pathname === '/admin' && !isAdmin) {
        navigate('/NotFound');
        return null;
    }

    return children;
};

export default ProtectedRoute;
