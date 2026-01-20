import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import Clock from '../Clock';
import { useEffect, useRef, useState } from 'react';
import SupervisorChose from '../SupervisorChose/SupervisorChose';
// @ts-ignore
import axiosInstance from '../../utils/axiosInstance';

type Supervisor = {
    id: number;
    firstName: string;
    lastName: string;
    middleName: string;
    email: string;
    phoneNumber: string;
    departmentId: number;
}

const SupervisorHeader = () => {
    const [supervisor, setSupervisor] = useState<Supervisor>();
    const [isChoseModalOpen, setIsChoseModalOpen] = useState<boolean>(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

    const choseModalRef = useRef<HTMLDivElement>(null);
    const profileModalRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const isActive = (path: string) => location.pathname === path;
    const isReportAddActive = location.pathname.startsWith('/supervisor-reportadd');
    const isCheckActive = location.pathname.startsWith('/supervisor-check');

    const handleChoseModal = () => setIsChoseModalOpen(prev => !prev);
    const handleProfileModal = () => setIsProfileModalOpen(prev => !prev);

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
            if (isChoseModalOpen && choseModalRef.current && !choseModalRef.current.contains(event.target as Node)) {
                setIsChoseModalOpen(false);
            }
            if (isProfileModalOpen && profileModalRef.current && !profileModalRef.current.contains(event.target as Node)) {
                setIsProfileModalOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isChoseModalOpen, isProfileModalOpen]);

    useEffect(() => {
        const getSupervisorData = async () => {
            try {
                const { data } = await axiosInstance.get<Supervisor>(`/dictionaries/User/${localStorage.getItem("user_id")}`);
                setSupervisor(data);
            } catch (error) {
                console.error("Error fetching supervisor data:", error);
            }
        };

        getSupervisorData();
    }, []);


    return (
        <>
            <div className='header'>
                <nav className='header-nav'>
                    <Link 
                        to="/supervisor-workpage"
                        className={`header-link ${isActive("/supervisor-workpage") ? "header-link--active" : ""}`}
                    >
                        Рабочий стол
                    </Link>
                    <p 
                        className={`header-link ${isReportAddActive ? "header-link--active" : ""}`}
                        onClick={handleChoseModal}
                    >
                        Создание ПА
                    </p>
                    <Link 
                        to="/supervisor-check"
                        className={`header-link ${isCheckActive ? "header-link--active" : ""}`}
                    >
                        Проверка
                    </Link>
                </nav>
                <div className='header-info'>
                    <div className='header-info-time' >
                        <p className='header-info--work'>Рабочий стол начальника смены |</p>
                        <Clock />
                    </div>
                    <div className='header-info--profile' onClick={handleProfileModal}>
                        <img src='/ProfileIcon.svg' className='profile-icon' alt='Профиль' width='32' height='32' />
                        <p className='profile-name'>{supervisor?.firstName} {supervisor?.lastName}</p>

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
            {isChoseModalOpen && (
                <div ref={choseModalRef}>
                    <SupervisorChose />
                </div>
            )}
        </>
    )
}

export default SupervisorHeader;