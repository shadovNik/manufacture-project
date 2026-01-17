import { Link } from 'react-router-dom';
import './Header.css';
import Clock from '../Clock';
import { useEffect, useRef, useState } from 'react';
import SupervisorChose from '../SupervisorChose/SupervisorChose';

const SupervisorHeader = () => {
    const [isChoseModalOpen, setIsChoseModalOpen] = useState<boolean>(false);

    const choseModalRef = useRef<HTMLDivElement>(null);

    const isActive = (path: string) => location.pathname === path;
    const isReportAddActive = location.pathname.startsWith('/supervisor-reportadd');

    const handleChoseModal = () => {
        setIsChoseModalOpen(prev => !prev);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isChoseModalOpen && choseModalRef.current && !choseModalRef.current.contains(event.target as Node)) {
                setIsChoseModalOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isChoseModalOpen]);


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
                        className={`header-link ${isActive("/supervisor-check") ? "header-link--active" : ""}`}
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
            {isChoseModalOpen && (
                <div ref={choseModalRef}>
                    <SupervisorChose />
                </div>
            )}
        </>
    )
}

export default SupervisorHeader;