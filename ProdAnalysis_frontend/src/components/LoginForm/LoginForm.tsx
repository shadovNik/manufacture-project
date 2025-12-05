import { useState } from "react";
import "./LoginForm.css";

import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

// @ts-ignore
import axiosInstance from "../../utils/axiosInstance";

type AuthResponse = {
    accessToken: string;
    refreshToken: string;
    UID: number;
    role: number; // 1 = Opeartor, 2 = Supervisor, 3 = Admin
};

const LoginForm = () => {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    const togglePassword = () => {
        setShowPassword((prev) => !prev);
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        try {
            const { data } = await axiosInstance.post<AuthResponse>("auth/login", {
                login: login,
                password: password
            });

            localStorage.setItem("access_token", data.accessToken);
            localStorage.setItem("Bearer", data.accessToken);
            localStorage.setItem("refresh_token", data.refreshToken);
            localStorage.setItem("user_id", data.userId);

            let roleString = "";

            if (data.role === 1) {
                roleString = "Opeartor";
            }
            else if (data.role === 2) {
                roleString = "Supervisor";
            }
            else if (data.role === 3) {
                roleString = "Admin";
            }

            localStorage.setItem("user_role", roleString);

            if (data.role === 1)
            {
                navigate("/");
            }
            else if (data.role === 2)
            {
                navigate("/");
            }
            else if (data.role === 3)
            {
                navigate("/");
            }
            else
            {
                navigate("/unauthorized");
            }
        }
        catch (err: any) {
            if (err.response?.status === 401)
            {
                setError("Неверный логин или пароль");
            }
            else
            {
                setError("Ошибка при входе. Попробуйте позже");
            }
        }
    };
    
    return (
      <form className="form" onSubmit={handleSubmit}>
        <h2 className="form__title">Вход</h2>
        <div className="form-input__container">
          <label className="form-input__label" htmlFor="uid">
            UID
          </label>
          <input
            className="form-input__field"
            type="text"
            id="uid"
            name="uid"
            placeholder="Введите UID(логин)"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            required
          />
          <p className="form-password__title">Пароль</p>
          <div className="form-password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              className="form-input__field form-input__field--password"
              placeholder="Введите пароль"
              maxLength={50}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

        {error && <p className="login-form-error">{error}</p>}

        <button type="submit" className="login-form__submit-button">
          Войти&ensp;
          <ArrowRight size={18} />
        </button>
        <Link to="/registration" className="form-link">
          Нет аккаунта? Зарегистрируйтесь!
        </Link>
      </form>
    );
}

export default LoginForm;
