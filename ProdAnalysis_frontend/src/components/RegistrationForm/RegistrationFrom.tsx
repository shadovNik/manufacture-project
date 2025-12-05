import { useState } from "react";
import "./RegistrationForm.css";

import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

const RegistrationForm = () => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState<boolean>(false);

    const togglePassword = () => {
        setShowPassword((prev) => !prev);
    }

    const togglePasswordConfirm = () => {
        setShowPasswordConfirm((prev) => !prev);
    }

    return (
        <form className="form" >
            <h2 className="form__title">Регистрация</h2>
            <div className="form-input__container">
                <label className="form-input__label" htmlFor="name">Имя</label>
                <input 
                    className="form-input__field" 
                    type="text" 
                    id="name" 
                    name="name"
                    placeholder="Введите ваше имя"
                    required 
                />
                <label className="form-input__label" htmlFor="midname">Отчество</label>
                <input 
                    className="form-input__field" 
                    type="text" 
                    id="midname" 
                    name="midname"
                    placeholder="Введите ваше отчество (если есть)"
                />
                <label className="form-input__label" htmlFor="phoneNumber">Номер телефона</label>
                <input 
                    className="form-input__field" 
                    type="phone"
                    id="phoneNumber" 
                    name="phoneNumber"
                    placeholder="Номер телефона в формате +7XXXXXXXXXX"
                    required 
                />
                <label className="form-input__label" htmlFor="email">Почта</label>
                <input 
                    className="form-input__field" 
                    type="email" 
                    id="email" 
                    name="email"
                    placeholder="Введите вашу почту"
                    required 
                />
                <label className="form-input__label" htmlFor="uid">UID (логин)</label>
                <input 
                    className="form-input__field" 
                    type="text" 
                    id="uid" 
                    name="uid"
                    placeholder="Введите ваш UID(логин)"
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

                <p className="form-password__title">Подтверждение пароля</p>
                <div className="form-password-wrapper">
                    <input
                        type={showPasswordConfirm ? "text" : "password"}
                        className="form-input__field form-input__field--password"
                        placeholder="Подтверждение пароля"
                        maxLength={50}
                        required
                    />
                    <button
                        type="button"
                        className="password-toggle"
                        onClick={togglePasswordConfirm}
                        aria-label={showPasswordConfirm ? "Скрыть пароль" : "Показать пароль"}
                    >
                        {showPasswordConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
            </div>
            <button type="submit" className="registration-form__submit-button">Регистрация</button>
            <Link to="/login" className="form-link">
                Уже есть аккаунт? Войти
            </Link>
        </form>
    )
}

export default RegistrationForm;
