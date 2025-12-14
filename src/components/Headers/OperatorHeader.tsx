import { Link } from 'react-router-dom';
import './Header.css';
import Clock from '../Clock';

const OperatorHeader = () => {
    const isActive = (path: string) => location.pathname === path;
    return (
        <>
            <div className='header'>
                <nav className='header-nav'>
                    <Link 
                        to="/operator-workpage"
                        className={`header-link ${isActive("/operator-workpage") ? "header-link--active" : ""}`}
                    >
                        Рабочий стол
                    </Link>
                    <Link 
                        to="/operator-report"
                        className={`header-link ${isActive("/operator-report") ? "header-link--active" : ""}`}
                    >
                        Заполнение ПА
                    </Link>
                </nav>
                <div className='header-info'>
                    <div className='header-info-time' >
                        <p className='header-info--work'>Рабочий стол оператора |</p>
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

export default OperatorHeader;