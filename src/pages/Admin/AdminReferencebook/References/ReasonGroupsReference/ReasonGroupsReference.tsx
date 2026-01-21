import React, { useEffect, useState, useCallback } from 'react';
// @ts-ignore
import axiosInstance from "../../../../../utils/axiosInstance";
import { PencilLine, Trash2, Plus, X, Save } from 'lucide-react';

interface ReasonGroup {
    id: number;
    name: string;
}

const ReasonGroupsReference = () => {
    const [groups, setGroups] = useState<ReasonGroup[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState<Partial<ReasonGroup> | null>(null);

    const fetchGroups = useCallback(async () => {
        setIsLoading(true);
        try {
            const { data } = await axiosInstance.get(`/dictionaries/ReasonGroup?page=${currentPage}`);
            setGroups(data);
        } catch (error) {
            console.error("Ошибка при загрузке групп причин:", error);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage]);

    useEffect(() => {
        fetchGroups();
    }, [fetchGroups]);

    const handleOpenSidebar = (group: Partial<ReasonGroup> | null = null) => {
        setSelectedGroup(group || { name: '' });
        setIsSidebarOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (selectedGroup?.id) {
                // Изменение
                await axiosInstance.put(`/dictionaries/ReasonGroup/update/${selectedGroup.id}`, {
                    name: selectedGroup.name
                });
            } else {
                // Создание
                await axiosInstance.post('/dictionaries/ReasonGroup/create', {
                    name: selectedGroup?.name
                });
            }
            setIsSidebarOpen(false);
            fetchGroups();
        } catch (error) {
            alert("Ошибка при сохранении группы причин");
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Вы уверены, что хотите удалить эту группу причин?")) {
            return;
        }
        try {
            await axiosInstance.delete(`/dictionaries/ReasonGroup/delete/${id}`);
            fetchGroups();
        } catch (error) {
            alert("Ошибка при удалении");
        }
    };

    return (
        <div className="product-ref-wrapper">
            <section className={`ref-main-content ${isSidebarOpen ? 'with-sidebar' : ''}`}>
                <div className="ref-content-header">
                    <div className="header-left">
                        <h2>Группы причин простоя</h2>
                    </div>
                    <button className="add-btn" onClick={() => handleOpenSidebar()}>
                        Добавить группу <Plus size={18} />
                    </button>
                </div>

                <div className="ref-table-card">
                    <table className="ref-table">
                        <thead>
                            <tr>
                                <th className='th-ID'>ID</th>
                                <th>Наименование группы</th>
                                <th className='th-action'>Действие</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan={3} className="loading-cell">Загрузка...</td></tr>
                            ) : groups.length > 0 ? (
                                groups.map((item) => (
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
                                <tr><td colSpan={3} className="empty-cell">Список групп пуст</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="ref-pagination">
                    <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
                        ← Назад
                    </button>
                    <span className="current-page">{currentPage}</span>
                    <button disabled={groups.length < pageSize} onClick={() => setCurrentPage(p => p + 1)}>
                        Вперед →
                    </button>
                </div>
            </section>

            {isSidebarOpen && (
                <aside className="ref-sidebar-right">
                    <div className="sidebar-header">
                        <h3>{selectedGroup?.id ? 'Редактирование' : 'Новая группа'}</h3>
                        <button title="Закрыть" className="close-btn" onClick={() => setIsSidebarOpen(false)}>
                            <X size={20} />
                        </button>
                    </div>

                    <form className="sidebar-form" onSubmit={handleSave}>
                        <div className="form-group">
                            <label>Наименование группы причин</label>
                            <input 
                                type="text"
                                required
                                placeholder="Напр: Технические неисправности"
                                value={selectedGroup?.name || ''} 
                                onChange={e => setSelectedGroup({...selectedGroup!, name: e.target.value})}
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

export default ReasonGroupsReference;