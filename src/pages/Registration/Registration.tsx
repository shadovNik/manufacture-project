import "./Registration.css";

import MainInfoComponent from "../../components/MainInfoComponent/MainInfoComponent";
import RegistrationForm from "../../components/RegistrationForm/RegistrationFrom";


const Registration = () => {
    return (
        <div className="registration-content">
            <MainInfoComponent />
            <RegistrationForm />
        </div>
    )
}

export default Registration;