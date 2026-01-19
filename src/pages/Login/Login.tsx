import "./Login.css";

import LoginForm from "../../components/LoginForm/LoginForm";
import MainInfoComponent from "../../components/MainInfoComponent/MainInfoComponent";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            navigate('/'); 
        }
    }, []);

    return (
        <div className="login-content">
            <MainInfoComponent />
            <LoginForm />
        </div>
    )
}

export default Login;