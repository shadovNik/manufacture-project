import React, { useEffect, useState, useCallback } from 'react';
// @ts-ignore
import axiosInstance from "../../../../../utils/axiosInstance";
import { PencilLine, Trash2, Plus, X, Save } from 'lucide-react';

interface Product {
    id: number;
    name: string;
    code: string;
    description: string;
}

const ProductReference = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Partial<Product> | null>(null);

    const fetchProducts = useCallback(async () => {
        try {
            const { data } = await axiosInstance.get(`/dictionaries/Product?page=${currentPage}`);
            setProducts(data);
        } catch (error) {
            console.error("Ошибка загрузки:", error);
        } finally {
        }
    }, [currentPage]);

    useEffect(() => { fetchProducts(); }, [fetchProducts]);

    const handleOpenSidebar = (product: Partial<Product> | null = null) => {
        setSelectedProduct(product || { name: '', code: '', description: '' });
        setIsSidebarOpen(true);
    };

    const handleDeleteProduct = async (productId: number) => {
        if (!window.confirm("Вы уверены, что хотите удалить этот продукт?")) {
            return;
        }

        try {
            await axiosInstance.delete(`/dictionaries/Product/delete/${productId}`);
            fetchProducts();
        } catch (error) {
            alert("Ошибка удаления");
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (selectedProduct?.id) {
                await axiosInstance.put(`/dictionaries/Product/update/${selectedProduct.id}`, selectedProduct);
            } else {
                await axiosInstance.post('/dictionaries/Product/create', selectedProduct);
            }
            setIsSidebarOpen(false);
            fetchProducts();
        } catch (error) {
            alert("Ошибка сохранения");
        }
    };

    return (
        <div className="product-ref-wrapper">
            <section className={`ref-main-content ${isSidebarOpen ? 'with-sidebar' : ''}`}>
                <div className="ref-content-header">
                    <div className="header-left">
                        <h2>Справочник продукции</h2>
                    </div>
                    <button className="add-btn" onClick={() => handleOpenSidebar()}>
                        Добавить продукт <Plus size={18} />
                    </button>
                </div>

                <div className="ref-table-card">
                    <table className="ref-table">
                        <thead>
                            <tr>
                                <th>Код</th>
                                <th>Наименование</th>
                                <th>Описание</th>
                                <th>Действие</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((item) => (
                                <tr key={item.id}>
                                    <td className="code-cell">{item.code}</td>
                                    <td className="name-cell">{item.name}</td>
                                    <td className="desc-cell">{item.description || '—'}</td>
                                    <td className="actions-cell">
                                        <button title="Редактировать" className="edit-btn" onClick={() => handleOpenSidebar(item)}><PencilLine size={18} /></button>
                                        <button title="Удалить" className="delete-btn" onClick={() => handleDeleteProduct(item.id)}><Trash2 size={18} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="ref-pagination">
                    <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>← Назад</button>
                    <span className="current-page">{currentPage}</span>
                    <button onClick={() => setCurrentPage(p => p + 1)}>Вперед →</button>
                </div>
            </section>

            {isSidebarOpen && (
                <aside className="ref-sidebar-right">
                    <div className="sidebar-header">
                        <h3>{selectedProduct?.id ? 'Редактирование' : 'Добавление'}</h3>
                        <button title="Закрыть" className="close-btn" onClick={() => setIsSidebarOpen(false)}><X size={20} /></button>
                    </div>

                    <form className="sidebar-form" onSubmit={handleSave}>
                        <div className="form-group">
                            <label>Код продукта</label>
                            <input 
                                required
                                value={selectedProduct?.code || ''} 
                                onChange={e => setSelectedProduct({...selectedProduct!, code: e.target.value})}
                            />
                        </div>
                        <div className="form-group">
                            <label>Наименование</label>
                            <input 
                                required
                                value={selectedProduct?.name || ''} 
                                onChange={e => setSelectedProduct({...selectedProduct!, name: e.target.value})}
                            />
                        </div>
                        <div className="form-group">
                            <label>Описание</label>
                            <textarea 
                                rows={5}
                                value={selectedProduct?.description || ''} 
                                onChange={e => setSelectedProduct({...selectedProduct!, description: e.target.value})}
                            />
                        </div>

                        <div className="sidebar-footer">
                            <button type="button" className="btn-cancel" onClick={() => setIsSidebarOpen(false)}>Отмена</button>
                            <button type="submit" className="btn-save">Сохранить <Save size={16} /></button>
                        </div>
                    </form>
                </aside>
            )}
        </div>
    );
};

export default ProductReference;