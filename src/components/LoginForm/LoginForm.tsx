import { useState } from "react";
import "./LoginForm.css";

import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

const LoginForm = () => {
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const togglePassword = () => {
        setShowPassword((prev) => !prev);
    }
    
    return (
        <form className="form">
            <h2 className="form__title">Вход</h2>
            <div className="form-input__container">
                <label className="form-input__label" htmlFor="uid">UID</label>
                <input 
                    className="form-input__field" 
                    type="text" 
                    id="uid" 
                    name="uid"
                    placeholder="Введите UID(логин)"
                    required 
                />

                <p className="form-password__title">Пароль</p>
                <div className="form-password-wrapper">
                    <input
                        type={showPassword ? "text" : "password"}
                        className="form-input__field form-input__field--password"
                        placeholder="Введите пароль"
                        maxLength={50}
                        required
                    />
                    <button
                        type="button"
                        className="password-toggle"
                        onClick={togglePassword}
                        aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
            </div>
            <button type="submit" className="login-form__submit-button">
                Войти&ensp;<ArrowRight size={18}/>
            </button>
            <Link to="/registration" className="form-link">
                Нет аккаунта? Зарегистрируйтесь!
            </Link>
        </form>
    );
}

export default LoginForm;
