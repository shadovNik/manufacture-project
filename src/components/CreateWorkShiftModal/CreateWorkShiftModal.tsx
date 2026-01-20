import { useEffect, useState } from 'react';
import './CreateWorkShiftModal.css';
// @ts-ignore
import axiosInstance from '../../utils/axiosInstance';

interface CreateWorkShiftModalProps {
    closeWorkShiftModal: () => void;
}

interface Department {
    id: number;
    name: string;
}

interface Operator {
    id: number;
    firstName: string;
    lastName: string;
}

const CreateWorkShiftModal = ({ closeWorkShiftModal }: CreateWorkShiftModalProps) => {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [operators, setOperators] = useState<Operator[]>([]);
    const [isOperatorsLoading, setIsOperatorsLoading] = useState(false);

    const [shiftType, setShiftType] = useState('');
    const [departmentId, setDepartmentId] = useState<number | string>('');
    const [operatorId, setOperatorId] = useState<number | string>('');

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const res = await axiosInstance.get('/dictionaries/Department?page=1');
                setDepartments(res.data);
            } catch (error) {
                console.error("Ошибка загрузки цехов:", error);
            }
        };
        fetchDepartments();
    }, []);

    useEffect(() => {
        const fetchOperators = async () => {
            if (!departmentId) {
                setOperators([]);
                setOperatorId('');
                return;
            }

            try {
                setIsOperatorsLoading(true);
                setOperatorId('');
                
                const res = await axiosInstance.get(`/users/${departmentId}`);
                setOperators(res.data);
            } catch (error) {
                console.error("Ошибка загрузки операторов:", error);
                setOperators([]);
            } finally {
                setIsOperatorsLoading(false);
            }
        };

        fetchOperators();
    }, [departmentId]);

    const submitCreateWorkShift = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!shiftType || !departmentId || !operatorId) {
            alert("Пожалуйста, заполните все поля");
            return;
        }

        try {
            const payload = {
                shiftType: shiftType,
                departmentId: Number(departmentId),
                operatorId: Number(operatorId)
            };

            await axiosInstance.post('/shift/create', payload);
            alert("Смена успешно создана");
            closeWorkShiftModal();
        } catch (error) {
            console.error("Ошибка при создании смены:", error);
            alert("Не удалось создать смену");
        }
    };

    return (
        <div className="create-work-shift-modal-overlay">
            <div className="create-work-shift-modal">
                <h2 className="create-work-shift-modal-title">Создание новой смены</h2>
                <form className="create-work-shift-modal-form" onSubmit={submitCreateWorkShift}>
                    
                    <label className="create-work-shift-modal-label">
                        Тип смены:&nbsp;
                        <select 
                            className="create-work-shift-modal-input"
                            value={shiftType}
                            onChange={(e) => setShiftType(e.target.value)}
                            required
                        >
                            <option value="">Выберите тип смены...</option>
                            <option value="Дневная">Дневная</option>
                            <option value="Вечерняя">Вечерняя</option>
                        </select>
                    </label>

                    <label className="create-work-shift-modal-label">
                        Цех:&nbsp;
                        <select 
                            className="create-work-shift-modal-input"
                            value={departmentId}
                            onChange={(e) => setDepartmentId(e.target.value)}
                            required
                        >
                            <option value="">Выберите цех...</option>
                            {departments.map(dept => (
                                <option key={dept.id} value={dept.id}>{dept.name}</option>
                            ))}
                        </select>
                    </label>

                    <label className="create-work-shift-modal-label">
                        Оператор:&nbsp;
                        <select 
                            className="create-work-shift-modal-input"
                            value={operatorId}
                            onChange={(e) => setOperatorId(e.target.value)}
                            disabled={!departmentId || isOperatorsLoading}
                            required
                        >
                            <option value="">
                                {isOperatorsLoading ? "Загрузка..." : "Выберите оператора..."}
                            </option>
                            {operators.map(op => (
                                <option key={op.id} value={op.id}>
                                    {op.lastName} {op.firstName}
                                </option>
                            ))}
                        </select>
                    </label>

                    <div className="create-work-shift-modal-buttons">
                        <button 
                            type="button" 
                            onClick={closeWorkShiftModal} 
                            className="create-work-shift-modal-button create-work-shift-modal-button--cancel"
                        >
                            Отмена
                        </button>
                        <button 
                            type="submit" 
                            className="create-work-shift-modal-button create-work-shift-modal-button--create"
                        >
                            Создать
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateWorkShiftModal;