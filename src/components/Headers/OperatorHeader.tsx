import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import Clock from '../Clock';
import { useEffect, useRef, useState } from 'react';
// @ts-ignore
import axiosInstance from '../../utils/axiosInstance';

type Operator = {
    id: number;
    firstName: string;
    lastName: string;
    middleName: string;
    email: string;
    phoneNumber: string;
    departmentId: number;
}

const OperatorHeader = () => {
    const [operator, setOperator] = useState<Operator>();
    const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

    const profileModalRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const handleProfileModal = () => setIsProfileModalOpen(prev => !prev);
    
    const isActive = (path: string) => location.pathname === path;

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

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isProfileModalOpen && profileModalRef.current && !profileModalRef.current.contains(event.target as Node)) {
                setIsProfileModalOpen(false);
            }
        };
    
        document.addEventListener('mousedown', handleClickOutside);
    
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isProfileModalOpen]);

    useEffect(() => {
        const getOperatorData = async () => {
            try {
                const { data } = await axiosInstance.get<Operator>(`/dictionaries/User/${localStorage.getItem("user_id")}`);
                setOperator(data);
            } catch (error) {
                console.error("Error fetching operator data:", error);
            }
        };

        getOperatorData();
    }, []);
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
                    <div className='header-info--profile' onClick={handleProfileModal}>
                        <img src='/ProfileIcon.svg' className='profile-icon' alt='Профиль' width='32' height='32' />
                        <p className='profile-name'>{operator?.firstName} {operator?.lastName}</p>

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
            </div>
        </>
    )
}

export default OperatorHeader;