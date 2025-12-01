import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const isActive = (path: string) => location.pathname === path;

    return (
        <>
            <div className='header'>
                <nav className='header-nav'>
                    <Link 
                        to="/login"
                        className={`header-link ${isActive("/") ? "header-link--active" : ""}`}
                    >
                        Рабочий стол
                    </Link>
                    <Link 
                        to="/login"
                        className={`header-link ${isActive("/") ? "header-link--active" : ""}`}
                    >
                        Заполнение ПА
                    </Link>
                    <Link 
                        to="/login"
                        className={`header-link ${isActive("/") ? "header-link--active" : ""}`}
                    >
                        Отчёты
                    </Link>
                </nav>
                {isActive("/") && (
                    <div className='header-info'>
                        <p className='header-info--work'>Рабочий стол оператора</p>
                        <Link to="/" className='header-info--profile'>
                            <img src='/public/ProfileIcon.svg' className='profile-icon' alt='Профиль' width='32' height='32' />
                            <p className='profile-name'>Имя Фамилия</p>
                        </Link>
                    </div>
                )}
            </div>
        </>
    )
}

export default Header;