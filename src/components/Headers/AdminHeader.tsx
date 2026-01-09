import { Link } from 'react-router-dom';
import './Header.css';
import Clock from '../Clock';

const AdminHeader = () => {
    const isActive = (path: string) => location.pathname === path;
    return (
        <>
            <div className='header'>
                <nav className='header-nav'>
                    <Link 
                        to="/admin-workpage"
                        className={`header-link ${isActive("/admin-workpage") ? "header-link--active" : ""}`}
                    >
                        Рабочий стол
                    </Link>
                    <Link 
                        to="/admin-analysis"
                        className={`header-link ${isActive("/admin-analysis") ? "header-link--active" : ""}`}
                    >
                        Аналитика
                    </Link>
                    <Link 
                        to="/admin-referencebook"
                        className={`header-link ${isActive("/admin-referencebook") ? "header-link--active" : ""}`}
                    >
                        Справочники
                    </Link>
                    <Link 
                        to="/admin-employees"
                        className={`header-link ${isActive("/admin-employees") ? "header-link--active" : ""}`}
                    >
                        Сотрудники
                    </Link>
                </nav>
                <div className='header-info'>
                    <div className='header-info-time' >
                        <p className='header-info--work'>Администратор |</p>
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

export default AdminHeader;