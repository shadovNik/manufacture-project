import { useState } from "react";
import "./LoginForm.css";

import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { useNavigate} from "react-router-dom";

// @ts-ignore
import axiosInstance from "../../utils/axiosInstance";

type AuthResponse = {
    accessToken: string;
    refreshToken: string;
    id: number;
    role: string; // Operator(1), Supervisor(2), Admin(3)
};

const LoginForm = () => {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        try {
            const { data } = await axiosInstance.post<AuthResponse>("/login", {
                email: login,
                personalKey: password
            });

            navigate('/login');

            localStorage.setItem("access_token", data.accessToken);
            localStorage.setItem("refresh_token", data.refreshToken);
            localStorage.setItem("user_id", data.id);
            localStorage.setItem("user_role", data.role);

            if (data.role === "Operator")
            {
                navigate("/operator-workpage");
            }
            else if (data.role === "Supervisor")
            {
                navigate("/supervisor-workpage");
            }
            else if (data.role === "Admin")
            {
                navigate("/admin-workpage");
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

            console.log(err);
        }
    };
    
    return (
      <form className="form" onSubmit={handleSubmit}>
        <h2 className="form__title">Вход</h2>

        <div className="form-input__container">
          <label className="form-input__label" htmlFor="email">
            Почта
          </label>
          <input
            className="form-input__field"
            type="email"
            id="email"
            name="email"
            placeholder="Введите почту"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            required
          />

          <label className="form-input__label" htmlFor="password">
            UID (Personal Key)
          </label>

          <div className="password-input-wrapper">
            <input
              id="uid"
              type={showPassword ? "text" : "password"}
              className="form-input__field password-field"
              placeholder="Введите UID (Personal Key)"
              maxLength={50}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {error && <p className="login-form-error">{error}</p>}

        <button type="submit" className="login-form__submit-button">
          Войти <ArrowRight size={18} />
        </button>
      </form>
    );
}

export default LoginForm;
