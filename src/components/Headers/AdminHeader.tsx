import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import './Header.css';
import Clock from '../Clock';
// @ts-ignore
import axiosInstance from '../../utils/axiosInstance';

type AdminData = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
};

const AdminHeader = () => {
    const [admin, setAdmin] = useState<AdminData>();
    const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
    
    const profileModalRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const location = useLocation();

    const handleProfileModal = () => setIsProfileModalOpen(prev => !prev);
    
    const isActive = (path: string) => location.pathname === path;
    const isReferencesActive = location.pathname.startsWith('/admin-referencebook');

    const handleLogout = async () => {
        try {
            await axiosInstance.post('/logout');
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user_role');
            localStorage.removeItem('user_id');
            navigate('/login');
        }
    };

    // Закрытие модалки при клике вне её области
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isProfileModalOpen && profileModalRef.current && !profileModalRef.current.contains(event.target as Node)) {
                setIsProfileModalOpen(false);
            }
        };
    
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isProfileModalOpen]);

    // Получение данных админа при монтировании
    useEffect(() => {
        const getAdminData = async () => {
            const userId = localStorage.getItem("user_id");
            if (!userId) return;

            try {
                const { data } = await axiosInstance.get<AdminData>(`/dictionaries/User/${userId}`);
                setAdmin(data);
            } catch (error) {
                console.error("Error fetching admin data:", error);
            }
        };

        getAdminData();
    }, []);

    return (
        <header className='header'>
            <nav className='header-nav'>
                <Link 
                    to="/admin-analysis"
                    className={`header-link ${isActive("/admin-analysis") ? "header-link--active" : ""}`}
                >
                    Аналитика
                </Link>
                <Link 
                    to="/admin-referencebook"
                    className={`header-link ${isReferencesActive ? "header-link--active" : ""}`}
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
                <div className='header-info-time'>
                    <p className='header-info--work'>Администратор |</p>
                    <Clock />
                </div>
                
                <div className='header-info--profile' onClick={handleProfileModal}>
                    <img src='/ProfileIcon.svg' className='profile-icon' alt='Профиль' width='32' height='32' />
                    <p className='profile-name'>
                        {admin ? `${admin.firstName} ${admin.lastName}` : 'Загрузка...'}
                    </p>

                    {isProfileModalOpen && (
                        <div 
                            ref={profileModalRef} 
                            className='profile-dropdown' 
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button className='logout-button' onClick={handleLogout}>
                                Выйти
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default AdminHeader;