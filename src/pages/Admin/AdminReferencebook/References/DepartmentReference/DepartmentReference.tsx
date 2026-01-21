import React, { useEffect, useState, useCallback } from 'react';
// @ts-ignore
import axiosInstance from "../../../../../utils/axiosInstance";
import { PencilLine, Trash2, Plus, X, Save } from 'lucide-react';

interface Department {
    id: number;
    name: string;
}

const DepartmentReference = () => {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedDept, setSelectedDept] = useState<Partial<Department> | null>(null);

    const fetchDepartments = useCallback(async () => {
        setIsLoading(true);
        try {
            const { data } = await axiosInstance.get(`/dictionaries/Department?page=${currentPage}`);
            setDepartments(data);
        } catch (error) {
            console.error("Ошибка при загрузке подразделений:", error);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage]);

    useEffect(() => {
        fetchDepartments();
    }, [fetchDepartments]);

    const handleOpenSidebar = (dept: Partial<Department> | null = null) => {
        setSelectedDept(dept || { name: '' });
        setIsSidebarOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (selectedDept?.id) {
                // Обновление
                await axiosInstance.put(`/dictionaries/Department/update/${selectedDept.id}`, {
                    name: selectedDept.name
                });
            } else {
                // Создание
                await axiosInstance.post('/dictionaries/Department/create', {
                    name: selectedDept?.name
                });
            }
            setIsSidebarOpen(false);
            fetchDepartments();
        } catch (error) {
            alert("Ошибка при сохранении подразделения");
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Вы уверены, что хотите удалить это подразделение?")) {
            return;
        }
        try {
            await axiosInstance.delete(`/dictionaries/Department/delete/${id}`);
            fetchDepartments();
        } catch (error) {
            alert("Ошибка при удалении");
        }
    };

    return (
        <div className="product-ref-wrapper">
            <section className={`ref-main-content ${isSidebarOpen ? 'with-sidebar' : ''}`}>
                <div className="ref-content-header">
                    <div className="header-left">
                        <h2>Справочник подразделений</h2>
                    </div>
                    <button className="add-btn" onClick={() => handleOpenSidebar()}>
                        Добавить подразделение <Plus size={18} />
                    </button>
                </div>

                <div className="ref-table-card">
                    <table className="ref-table">
                        <thead>
                            <tr>
                                <th className='th-ID'>ID</th>
                                <th>Наименование</th>
                                <th className='th-action'>Действие</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan={3} className="loading-cell">Загрузка...</td></tr>
                            ) : departments.length > 0 ? (
                                departments.map((item) => (
                                    <tr key={item.id}>
                                        <td className="code-cell">#{item.id}</td>
                                        <td className="name-cell">{item.name}</td>
                                        <td className="actions-cell">
                                            <button title="Редактировать" className="edit-btn" onClick={() => handleOpenSidebar(item)}>
                                                <PencilLine size={18} />
                                            </button>
                                            <button title="Удалить" className="delete-btn" onClick={() => handleDelete(item.id)}>
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan={3} className="empty-cell">Список пуст</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="ref-pagination">
                    <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
                        ← Назад
                    </button>
                    <span className="current-page">{currentPage}</span>
                    <button disabled={departments.length < pageSize} onClick={() => setCurrentPage(p => p + 1)}>
                        Вперед →
                    </button>
                </div>
            </section>

            {isSidebarOpen && (
                <aside className="ref-sidebar-right">
                    <div className="sidebar-header">
                        <h3>{selectedDept?.id ? 'Редактирование' : 'Новое подразделение'}</h3>
                        <button title="Закрыть" className="close-btn" onClick={() => setIsSidebarOpen(false)}>
                            <X size={20} />
                        </button>
                    </div>

                    <form className="sidebar-form" onSubmit={handleSave}>
                        <div className="form-group">
                            <label>Наименование подразделения</label>
                            <input 
                                type="text"
                                required
                                placeholder="Напр: Цех сборки №1"
                                value={selectedDept?.name || ''} 
                                onChange={e => setSelectedDept({...selectedDept!, name: e.target.value})}
                            />
                        </div>

                        <div className="sidebar-footer">
                            <button type="button" className="btn-cancel" onClick={() => setIsSidebarOpen(false)}>
                                Отмена
                            </button>
                            <button type="submit" className="btn-save">
                                Сохранить <Save size={16} />
                            </button>
                        </div>
                    </form>
                </aside>
            )}
        </div>
    );
};

export default DepartmentReference;