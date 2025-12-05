import { Link } from "react-router-dom";

const NotFound = () => {
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
                    color: '#6ba4c5', // пастельно-голубой акцент
                    fontSize: '48px',
                    margin: 0,
                    fontWeight: '600'
                }}
            >
                404
            </h1>

            <p
                style={{
                    color: '#4c6d80',
                    fontSize: '18px',
                    margin: 0
                }}
            >
                Упс... Такой страницы не существует.
            </p>

            <Link
                to="/"
                style={{
                    marginTop: '15px',
                    padding: '10px 22px',
                    backgroundColor: '#cfe2ec',
                    color: '#355466',
                    textDecoration: 'none',
                    borderRadius: '12px',
                    fontSize: '16px',
                    transition: '0.2s ease',
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = '#bfd7e4')}
                onMouseLeave={(e) => (e.target.style.backgroundColor = '#cfe2ec')}
            >
                Вернуться на главную
            </Link>
        </div>
    );
};

export default NotFound;
