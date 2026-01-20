import { useEffect, useState } from 'react';
import AdminHeader from '../../../components/Headers/AdminHeader';
// @ts-ignore
import axiosInstance from "../../../utils/axiosInstance";
import './AdminEmployees.css';
import { PencilLine, Trash2 } from 'lucide-react';

interface Employee {
    id: number;
    firstName: string;
    lastName: string;
    middleName: string;
    email: string;
    phoneNumber: string;
    departmentId: number;
    role: string;
}

interface DictionaryItem {
    id: number;
    name: string;
}

const AdminEmployees = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [divisions, setDivisions] = useState<DictionaryItem[]>([]);

    const [createdCredentials, setCreatedCredentials] = useState<{ email: string, personalKey: string } | null>(null);
    
    // Состояния для пагинации
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const pageSize = 10;

    // Состояние сайдбара и формы
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Partial<Employee> | null>(null);

    const fetchEmployees = async (page: number) => {
        try {
            const { data } = await axiosInstance.get(`/dictionaries/User?page=${page}`);
            setEmployees(data); 
            setTotalCount(data.length);
        } catch (error) {
            console.error("Ошибка при загрузке сотрудников:", error);
        } finally {
        }
    };

    const fetchDictionaries = async () => {
        try {
            const { data } = await axiosInstance.get('/dictionaries/Department?page=1');
            setDivisions(data);
        } catch (error) {
            console.error("Ошибка словарей:", error);
        }
    };

    useEffect(() => {
        fetchEmployees(currentPage);
        fetchDictionaries();
    }, [currentPage]);

    const handleOpenSidebar = (employee: Partial<Employee> | null = null) => {
        setCreatedCredentials(null);
        setSelectedEmployee(employee || { role: 'Оператор' });
        setIsSidebarOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (selectedEmployee?.id) {
                await axiosInstance.put(`/dictionaries/User/update/${selectedEmployee.id}`, selectedEmployee);
                setIsSidebarOpen(false);
            } else {
                const { data } = await axiosInstance.post('/dictionaries/User/create', selectedEmployee);
                // Если сервер вернул personalKey, показываем его
                if (data && data.personalKey) {
                    setCreatedCredentials({
                        email: data.email || selectedEmployee?.email || '',
                        personalKey: data.personalKey
                    });
                } else {
                    setIsSidebarOpen(false);
                }
            }
            fetchEmployees(currentPage);
        } catch (error) {
            alert("Ошибка при сохранении");
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Удалить сотрудника?")) return;
        try {
            await axiosInstance.delete(`/dictionaries/User/delete/${id}`);
            fetchEmployees(currentPage);
        } catch (error) {
            alert("Ошибка при удалении");
        }
    };

    const adaptRoleToDisplay = (role: string) => {
        switch (role) {
            case 'Operator':
                return 'Оператор';
            case 'Supervisor':
                return 'Начальник смены';
            case 'Admin':
                return 'Администратор';
            default:
                return role;
        }
    };

    const handleCloseCredentials = () => {
        setCreatedCredentials(null);
        setIsSidebarOpen(false);
    };

    return (
        <div className="admin-employees-page">
            <AdminHeader />
            <main className="admin-employees-container">
                <section className={`employees-list-section ${isSidebarOpen ? 'shrunk' : ''}`}>
                    <div className="section-header">
                        <h2>Список сотрудников</h2>
                        <button className="add-btn" onClick={() => handleOpenSidebar()}>
                            Добавить сотрудника <span>+</span>
                        </button>
                    </div>

                    <div className="table-wrapper">
                        <table className="employees-table">
                            <thead>
                                <tr>
                                    <th>Сотрудник</th>
                                    <th>Телефон</th>
                                    <th>Email</th>
                                    <th>Роль</th>
                                    <th>Действия</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.map(emp => (
                                    <tr key={emp.id}>
                                        <td className="user-cell">
                                            <div className="user-avatar">{emp.lastName[0]}</div>
                                            <div>{`${emp.lastName} ${emp.firstName} ${emp.middleName}`}</div>
                                        </td>
                                        <td>{emp.phoneNumber}</td>
                                        <td>{emp.email}</td>
                                        <td>{adaptRoleToDisplay(emp.role)}</td>
                                        <td className="actions-cell">
                                            <button title='edit' type='button' className="edit-icon" onClick={() => handleOpenSidebar(emp)}><PencilLine /></button>
                                            <button title='delete' type='button' className="delete-icon" onClick={() => handleDelete(emp.id)}><Trash2 /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="pagination">
                        <span>Показано {employees.length} из {totalCount} сотрудников</span>
                        <div className="page-controls">
                            <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>Назад</button>
                            <span className="page-num">{currentPage}</span>
                            <button disabled={employees.length < pageSize} onClick={() => setCurrentPage(prev => prev + 1)}>Вперед</button>
                        </div>
                    </div>
                </section>

                {isSidebarOpen && (
                    <aside className="employee-sidebar">
                        {createdCredentials ? (
                            <div className="credentials-view">
                                <h3 className="success-title">Сотрудник создан!</h3>
                                <p className="warning-text">
                                    Скопируйте данные для входа. После закрытия этого окна пароль будет <strong>невозможно</strong> восстановить.
                                </p>
                                
                                <div className="credential-box">
                                    <label>Логин (Email):</label>
                                    <div className="value-row">
                                        <span>{createdCredentials.email}</span>
                                    </div>
                                </div>

                                <div className="credential-box">
                                    <label>Пароль (Personal Key):</label>
                                    <div className="value-row password-value">
                                        <span>{createdCredentials.personalKey}</span>
                                    </div>
                                </div>

                                <button 
                                    className="confirm-btn" 
                                    onClick={handleCloseCredentials}
                                >
                                    Я сохранил данные
                                </button>
                            </div>
                        ) : (
                            <>
                                <h3>{selectedEmployee?.id ? 'Редактирование' : 'Добавление'} сотрудника</h3>
                                <form onSubmit={handleSave}>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Фамилия</label>
                                            <input title="Фамилия" required value={selectedEmployee?.lastName || ''} onChange={e => setSelectedEmployee({...selectedEmployee, lastName: e.target.value})} />
                                        </div>
                                        <div className="form-group">
                                            <label>Имя</label>
                                            <input title="Имя" required value={selectedEmployee?.firstName || ''} onChange={e => setSelectedEmployee({...selectedEmployee, firstName: e.target.value})} />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Отчество</label>
                                        <input title="Отчество" value={selectedEmployee?.middleName || ''} onChange={e => setSelectedEmployee({...selectedEmployee, middleName: e.target.value})} />
                                    </div>
                                    <div className="form-group">
                                        <label>Телефон</label>
                                        <input title="Телефон" type="tel" value={selectedEmployee?.phoneNumber || ''} onChange={e => setSelectedEmployee({...selectedEmployee, phoneNumber: e.target.value})} />
                                    </div>
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input title="Email" type="email" value={selectedEmployee?.email || ''} onChange={e => setSelectedEmployee({...selectedEmployee, email: e.target.value})} />
                                    </div>
                                    <div className="form-group">
                                        <label>Подразделение</label>
                                        <select title="Подразделение" value={selectedEmployee?.departmentId || ''} onChange={e => setSelectedEmployee({...selectedEmployee, departmentId: Number(e.target.value)})}>
                                            <option value="">Выберите подразделение</option>
                                            {divisions.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Роль в системе</label>
                                        <select title="Роль в системе" value={selectedEmployee?.role || ''} onChange={e => setSelectedEmployee({...selectedEmployee, role: e.target.value})}>
                                            <option value="Оператор">Оператор</option>
                                            <option value="Начальник смены">Начальник смены</option>
                                            <option value="Администратор">Администратор</option>
                                        </select>
                                    </div>
                                    
                                    <div className="sidebar-buttons">
                                        <button type="button" className="cancel-btn" onClick={() => setIsSidebarOpen(false)}>Отмена</button>
                                        <button type="submit" className="save-btn">Сохранить</button>
                                    </div>
                                </form>
                            </>
                        )}
                    </aside>
                )}
            </main>
        </div>
    );
}

export default AdminEmployees;