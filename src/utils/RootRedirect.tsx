import { Navigate } from 'react-router-dom';

const RootRedirect = () => {
    const userRole = localStorage.getItem('user_role');

    switch (userRole) {
        case 'Admin':
            return <Navigate to="/admin-employees" replace />;
        case 'Operator':
            return <Navigate to="/operator-workpage" replace />;
        case 'Supervisor':
            return <Navigate to="/supervisor-workpage" replace />;
        default:
            return <Navigate to="/login" replace />;
    }
};

export default RootRedirect;