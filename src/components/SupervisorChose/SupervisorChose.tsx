import { NavLink } from 'react-router-dom';
import './SupervisorChose.css';

const SupervisorChose = () => {
    const isActive = (path: string) => location.pathname === path;

    return (
        <>
            <div className='chose-container'>
                <ul className='chose-list'>
                    <NavLink to='/supervisor-reportadd/tact-duration'>
                        <li className={`chose-list-element ${isActive("/supervisor-reportadd/tact-duration") ? "chose-list-element--active" : ""}`}>
                            По времени такта
                        </li>
                    </NavLink>
                    <NavLink to='/supervisor-reportadd/power'>
                        <li className={`chose-list-element ${isActive("/supervisor-reportadd/power") ? "chose-list-element--active" : ""}`}>
                            По мощности
                        </li>
                    </NavLink>
                    <NavLink to='/supervisor-reportadd/nomenclatures'>
                        <li className={`chose-list-element ${isActive("/supervisor-reportadd/nomenclatures") ? "chose-list-element--active" : ""}`}>
                            Для нескольких номенклатур
                        </li>
                    </NavLink>
                    <NavLink to='/supervisor-reportadd/less-than-one-item'>
                        <li className={`chose-list-element ${isActive("/supervisor-reportadd/less-than-one-item") ? "chose-list-element--active" : ""}`}>
                            Менее 1 детали в час
                        </li>
                    </NavLink>
                    <NavLink to='/supervisor-reportadd/less-than-one-unit'>
                        <li className={`chose-list-element ${isActive("/supervisor-reportadd/less-than-one-unit") ? "chose-list-element--active" : ""}`}>
                            Менее 1 ед. в смену
                        </li>
                    </NavLink>
                    {/* <NavLink to='/supervisor-reportadd/drafts'>
                        <li className={`chose-list-element ${isActive("/supervisor-reportadd/drafts") ? "chose-list-element--active" : ""}`}>
                            Черновики
                        </li>
                    </NavLink> */}
                </ul>
            </div>
        </>
    );
}

export default SupervisorChose;