import "./Login.css";

import LoginForm from "../../components/LoginForm/LoginForm";
import MainInfoComponent from "../../components/MainInfoComponent/MainInfoComponent";


const Login = () => {
    return (
        <div className="login-content">
            <MainInfoComponent />
            <LoginForm />
        </div>
    )
}

export default Login;