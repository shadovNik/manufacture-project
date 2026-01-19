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

    const [startTime, setStartTime] = useState('');
    const [departmentId, setDepartmentId] = useState<number | string>('');
    const [operatorId, setOperatorId] = useState<number | string>('');

    // 1. Первичная загрузка: только список цехов
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

    // 2. Загрузка операторов при изменении departmentId
    useEffect(() => {
        const fetchOperators = async () => {
            // Если цех не выбран, очищаем список операторов и ID
            if (!departmentId) {
                setOperators([]);
                setOperatorId('');
                return;
            }

            try {
                setIsOperatorsLoading(true);
                setOperatorId(''); // Сбрасываем выбранного оператора при смене цеха
                
                // Используем динамический URL с ID выбранного цеха
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
    }, [departmentId]); // Следим за изменением departmentId

    const submitCreateWorkShift = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!startTime || !departmentId || !operatorId) {
            alert("Пожалуйста, заполните все поля");
            return;
        }

        // 1. Извлекаем часы и минуты из строки "HH:mm"
        const [hours, minutes] = startTime.split(':').map(Number);

        // 2. Создаем объект даты на текущий момент
        const dateWithTime = new Date();

        // 3. Устанавливаем выбранное время (секунды и миллисекунды можно оставить текущими или обнулить)
        dateWithTime.setHours(hours);
        dateWithTime.setMinutes(minutes);
        // dateWithTime.setSeconds(0); // Опционально: обнуление секунд
        // dateWithTime.setMilliseconds(0); // Опционально: обнуление миллисекунд

        try {
            const payload = {
                startTime: dateWithTime.toISOString(),
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
                        Время начала смены:&nbsp;
                        <input 
                            type="time" 
                            className="create-work-shift-modal-input" 
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            required
                        />
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
                            disabled={!departmentId || isOperatorsLoading} // Блокируем, пока не выбран цех или идет загрузка
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