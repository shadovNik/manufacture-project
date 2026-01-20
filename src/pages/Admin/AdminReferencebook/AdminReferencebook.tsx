import { NavLink, Outlet } from 'react-router-dom';
import AdminHeader from '../../../components/Headers/AdminHeader';
import './AdminReferencebook.css';

const AdminReferencebook = () => {
    // Список справочников для рендера ссылок
    const dictionaryLinks = [
        { path: 'products', label: 'Продукция' },
        { path: 'departments', label: 'Подразделения' },
        { path: 'reason-groups', label: 'Группы причин простоя' },
    ];

    return (
        <div className="admin-ref-page">
            <AdminHeader />
            <div className="admin-ref-layout">
                <aside className="ref-sidebar-left">
                    <h3>Справочники системы</h3>
                    <nav className="ref-nav">
                        {dictionaryLinks.map((link) => (
                            <NavLink 
                                key={link.path}
                                to={`/admin-referencebook/${link.path}`}
                                className={({ isActive }) => 
                                    `ref-nav-item ${isActive ? 'active' : ''}`
                                }
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </nav>
                </aside>
                <main className="ref-content">
                    <Outlet /> 
                </main>
            </div>
        </div>
    );
};

export default AdminReferencebook;