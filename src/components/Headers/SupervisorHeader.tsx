import { Link } from 'react-router-dom';
import './Header.css';
import Clock from '../Clock';

const SupervisorHeader = () => {
    const isActive = (path: string) => location.pathname === path;
    return (
        <>
            <div className='header'>
                <nav className='header-nav'>
                    <Link 
                        to="/"
                        className={`header-link ${isActive("/") ? "header-link--active" : ""}`}
                    >
                        Рабочий стол
                    </Link>
                    <Link 
                        to="/"
                        className={`header-link ${isActive("/") ? "header-link--active" : ""}`}
                    >
                        Создание ПА
                    </Link>
                    <Link 
                        to="/"
                        className={`header-link ${isActive("/") ? "header-link--active" : ""}`}
                    >
                        Проверка
                    </Link>
                </nav>
                <div className='header-info'>
                    <div className='header-info-time' >
                        <p className='header-info--work'>Рабочий стол начальника смены |</p>
                        <Clock />
                    </div>
                    <div className='header-info--profile'>
                        <img src='/ProfileIcon.svg' className='profile-icon' alt='Профиль' width='32' height='32' />
                        <p className='profile-name'>Имя Фамилия</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SupervisorHeader;