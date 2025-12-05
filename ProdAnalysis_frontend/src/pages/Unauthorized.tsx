import { Link } from "react-router-dom";

const Unauthorized = () => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                textAlign: 'center',
                gap: '10px',
                backgroundColor: '#e9f3f8', // нежный голубовато-пудровый фон
                padding: '20px'
            }}
        >
            <h1
                style={{
                    color: '#6ba4c5', 
                    fontSize: '48px',
                    margin: 0,
                    fontWeight: '600'
                }}
            >
                401
            </h1>

            <p
                style={{
                    color: '#4c6d80',
                    fontSize: '18px',
                    margin: 0
                }}
            >
                Вы не авторизованы.
            </p>

            <p
                style={{
                    color: '#6c8898',
                    fontSize: '15px',
                    margin: 0,
                }}
            >
                Чтобы продолжить, пожалуйста, войдите в аккаунт.
            </p>

            <Link to="/login" className="enter-button">
                Войти
            </Link>
        </div>
    );
};

export default Unauthorized;
