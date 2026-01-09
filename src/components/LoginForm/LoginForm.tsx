import { useState } from "react";
import "./LoginForm.css";

import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate} from "react-router-dom";

// @ts-ignore
import axiosInstance from "../../utils/axiosInstance";

type AuthResponse = {
    accessToken: string;
    refreshToken: string;
    userID: number;
    role: string; // Operator(1), Supervisor(2), Admin(3)
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

    // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();
    //     setError(null);

    //     try {
    //         const { data } = await axiosInstance.post<AuthResponse>("/api/login", {
    //             personalKey: login,
    //             password: password
    //         });

    //         localStorage.setItem("access_token", data.accessToken);
    //         localStorage.setItem("Bearer", data.accessToken);
    //         localStorage.setItem("refresh_token", data.refreshToken);
    //         localStorage.setItem("user_id", data.userID);

    //         // let roleString = "";

    //         // if (data.role === 1) {
    //         //     roleString = "Opeartor";
    //         // }
    //         // else if (data.role === 2) {
    //         //     roleString = "Supervisor";
    //         // }
    //         // else if (data.role === 3) {
    //         //     roleString = "Admin";
    //         // }

    //         // localStorage.setItem("user_role", roleString);

    //         // if (data.role === 1)
    //         // {
    //         //     navigate("/");
    //         // }
    //         // else if (data.role === 2)
    //         // {
    //         //     navigate("/");
    //         // }
    //         // else if (data.role === 3)
    //         // {
    //         //     navigate("/");
    //         // }
    //         // else
    //         // {
    //         //     navigate("/unauthorized");
    //         // }
    //     }
    //     catch (err: any) {
    //         if (err.response?.status === 401)
    //         {
    //             setError("Неверный логин или пароль");
    //         }
    //         else
    //         {
    //             setError("Ошибка при входе. Попробуйте позже");
    //         }

    //         console.log(err);
    //     }
    // };

    const handleFakeSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (login === "1") {
        navigate('/operator-workpage');
      }
      else if (login === "2") {
        navigate('/supervisor-workpage');
      }
      else {
        navigate('/admin-workpage');
      }
    }
    
    return (
      <form className="form" onSubmit={handleFakeSubmit}>
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
