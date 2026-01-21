import React, { useEffect, useState } from 'react';
import './TactAnalysisTable.css';
// @ts-ignore
import axiosInstance from "../../../utils/axiosInstance";
import { useNavigate } from 'react-router-dom';

export interface TableRowData {
    rowId?: number;
    timeRange: string;
    isBreak: boolean;
    plan: number;
    cumulativePlan: number;
    fact: number;
    cumulativeFact: number;
    deviation: number;
    cumulativeDeviation: number;
    downtimeMin: number;
    responsible: string;
    responsibleUserId?: number;
    reasonGroup: string;
    reasonComment: string;
    measures: string;
}

interface ReasonGroup {
    id: number;
    name: string;
}

interface ShiftUser {
    id: number;
    firstName: string;
    lastName: string;
}

interface Props {
    tableId: string | number;
    data: TableRowData[];
    setData: React.Dispatch<React.SetStateAction<TableRowData[]>>;
    headerInfo: {
        divisionId: number;
        product: string;
        division: string;
        executor: string;
        tactTimeSec: number;
        dailyRate: number;
    };
    isOperatorPage?: boolean;
    isReviewPage?: boolean;
}

const TactAnalysisTable: React.FC<Props> = ({ tableId, data, setData, headerInfo, isOperatorPage = false, isReviewPage = false }) => {
    const [reasonGroups, setReasonGroups] = useState<ReasonGroup[]>([]);
    const [shiftUsers, setShiftUsers] = useState<ShiftUser[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            if (!headerInfo?.divisionId) return;
            
            try {
                const res = await axiosInstance.get(`/users/${headerInfo.divisionId}`);
                setShiftUsers(res.data);
            } catch (error) {
                console.error("Ошибка загрузки пользователей цеха:", error);
            }
        };
        fetchUsers();
    }, [headerInfo?.divisionId]);

    useEffect(() => {
        const fetchReasonGroups = async () => {
            try {
                const res = await axiosInstance.get('/dictionaries/ReasonGroup?page=1');
                setReasonGroups(res.data);
            } catch (error) {
                console.error("Ошибка при загрузке групп причин:", error);
            }
        };
        fetchReasonGroups();
    }, []);

    useEffect(() => {
        const fetchUsersByDepartment = async () => {
            if (!headerInfo.divisionId) return;

            try {
                const res = await axiosInstance.get(`/users/${headerInfo.divisionId}`);
                setShiftUsers(res.data);
            } catch (error) {
                console.error("Ошибка при загрузке пользователей подразделения:", error);
            }
        };
        fetchUsersByDepartment();
    }, [headerInfo.divisionId]);

    const handleInputChange = (index: number, field: keyof TableRowData, value: any) => {
        const newData = [...data];
        (newData[index] as any)[field] = value;
        setData(newData);
    };

    const handleResponsibleChange = (index: number, userId: number) => {
        const selectedUser = shiftUsers.find(u => u.id === userId);
        const newData = [...data];
        
        newData[index].responsibleUserId = userId;
        newData[index].responsible = selectedUser 
            ? `${selectedUser.lastName} ${selectedUser.firstName}` 
            : '';
            
        setData(newData);
    };

    const handleFactChange = (index: number, value: number) => {
        const newData = [...data];
        newData[index].fact = value;
        let runningFact = 0;
        let runningDeviation = 0;

        newData.forEach((row) => {
            runningFact += row.fact;
            row.cumulativeFact = runningFact;
            row.deviation = row.plan - row.fact;
            runningDeviation += row.deviation;
            row.cumulativeDeviation = runningDeviation;
        });
        setData(newData);
    };

    const handleSave = async () => {
        setIsSubmitting(true);
        try {
            const payload = {
                tableId: String(tableId),
                rows: data
                    .filter(row => !row.isBreak && row.rowId)
                    .map(row => {
                        const group = reasonGroups.find(g => g.name === row.reasonGroup);
                        return {
                            rowId: row.rowId,
                            factQTY: row.fact,
                            downtimeMinutes: row.downtimeMin,
                            reasonGroupId: group ? group.id : 0,
                            responsibleUserId: row.responsibleUserId || 0,
                            comment: row.reasonComment,
                            takenMeasures: row.measures
                        };
                    })
            };

            await axiosInstance.post(`/PowerPerHourTable/fill/${tableId}`, payload);
            alert(isOperatorPage ? "Изменения сохранены" : "Данные успешно отправлены!");
        } catch (error) {
            console.error("Ошибка сохранения:", error);
            alert("Ошибка при сохранении данных.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReject = async () => {
        if (!window.confirm("Вернуть таблицу оператору на доработку?")) return;
        setIsSubmitting(true);
        try {
            await axiosInstance.put(`/PowerPerHourTable/update/status/${tableId}?status=На доработке`);
            alert("Отправлено на доработку");
            navigate('/supervisor-check');
        } catch (error) {
            alert("Ошибка при смене статуса");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleApprove = async () => {
        if (!window.confirm("Принять таблицу? После этого редактирование будет закрыто.")) return;
        setIsSubmitting(true);
        try {
            await axiosInstance.put(`/PowerPerHourTable/update/status/${tableId}?status=Принято`);
            alert("Таблица принята");
            navigate('/supervisor-check');
        } catch (error) {
            alert("Ошибка при одобрении");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSendToReview = async () => {
        await handleSave();

        if (!window.confirm("Вы уверены? После отправки редактирование будет заблокировано.")) return;

        setIsSubmitting(true);
        try {
            await axiosInstance.put(`/PowerPerHourTable/update/status/${tableId}?status=На проверке`);
            alert("Таблица отправлена на проверку!");
        } catch (error) {
            console.error("Ошибка отправки:", error);
            alert("Не удалось отправить на проверку.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="table-container">
            <div className="table-header-info">
                <p>Продукт: <strong>{headerInfo.product}</strong></p>
                <p>Цех: <strong>{headerInfo.division}</strong></p>
                <p>Исполнитель: <strong>{headerInfo.executor}</strong></p>
                <p>Время такта: <strong>{headerInfo.tactTimeSec} сек.</strong></p>
                <p>Суточный темп: <strong>{headerInfo.dailyRate} шт.</strong></p>
            </div>

            <table className="analysis-table">
                <thead>
                    <tr>
                        <th rowSpan={3}>Время работы, час</th>
                        <th>План, шт.</th>
                        <th>План накоп., шт</th>
                        <th>Факт, шт.</th>
                        <th>Факт накоп., шт</th>
                        <th>Отклонение, шт.</th>
                        <th>Отклонение накоп.</th>
                        <th>Простой, мин</th>
                        <th>Ответственный</th>
                        <th>Группы причин</th>
                        <th colSpan={2}>Причины и меры</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, idx) => (
                        <tr key={idx} className={row.isBreak ? 'break-row' : ''}>
                            <td>{row.timeRange}</td>
                            <td>{row.plan}</td>
                            <td>{row.cumulativePlan}</td>
                            <td>
                                {!row.isBreak && (
                                    <input
                                        title="Факт, шт." 
                                        type="number" 
                                        value={row.fact} 
                                        onChange={(e) => handleFactChange(idx, Number(e.target.value))} 
                                    />
                                )}
                            </td>
                            <td>{row.cumulativeFact}</td>
                            <td>{row.deviation}</td>
                            <td>{row.cumulativeDeviation}</td>
                            <td>
                                <input
                                    title="Простой, мин" 
                                    type="number" 
                                    value={row.downtimeMin} 
                                    onChange={(e) => handleInputChange(idx, 'downtimeMin', Number(e.target.value))} 
                                />
                            </td>
                            <td>
                                {!row.isBreak && (
                                    <select 
                                        className="table-select"
                                        title="Выберите ответственного"
                                        value={row.responsibleUserId || ""} 
                                        onChange={(e) => handleResponsibleChange(idx, Number(e.target.value))}
                                    >
                                        <option value="">Выбор...</option>
                                        {shiftUsers.map((user) => (
                                            <option key={user.id} value={user.id}>
                                                {user.lastName} {user.firstName}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </td>
                            <td>
                                <select
                                    title="Группа причин" 
                                    value={row.reasonGroup} 
                                    onChange={(e) => handleInputChange(idx, 'reasonGroup', e.target.value)}
                                >
                                    <option value="">Выбор...</option>
                                    {reasonGroups.map((group) => (
                                        <option key={group.id} value={group.name}>{group.name}</option>
                                    ))}
                                </select>
                            </td>
                            <td>
                                <input 
                                    type="text" 
                                    placeholder="Причина" 
                                    value={row.reasonComment} 
                                    onChange={(e) => handleInputChange(idx, 'reasonComment', e.target.value)} 
                                />
                            </td>
                            <td>
                                <input 
                                    type="text" 
                                    placeholder="Меры" 
                                    value={row.measures} 
                                    onChange={(e) => handleInputChange(idx, 'measures', e.target.value)} 
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="table-actions">
                {isReviewPage ? (
                    // КНОПКИ ДЛЯ СТРАНИЦЫ ПРОВЕРКИ (Супервайзер)
                    <>
                        <button className="save-table-button" onClick={handleSave} disabled={isSubmitting}>
                            Сохранить
                        </button>
                        <button className="reject-table-button" onClick={handleReject} disabled={isSubmitting}>
                            Отправить на доработку
                        </button>
                        <button className="approve-table-button" onClick={handleApprove} disabled={isSubmitting}>
                            Принять
                        </button>
                    </>
                ) : isOperatorPage ? (
                    // КНОПКИ ДЛЯ ОПЕРАТОРА
                    <>
                        <button className="save-table-button" onClick={handleSave} disabled={isSubmitting}>
                            Сохранить таблицу
                        </button>
                        <button className="submit-to-review-button" onClick={handleSendToReview} disabled={isSubmitting}>
                            Отправить на проверку
                        </button>
                    </>
                ) : (
                    // КНОПКА ПРИ СОЗДАНИИ (Супервайзер)
                    <button className="submit-to-operator-button" onClick={handleSave} disabled={isSubmitting}>
                        Сохранить и отправить таблицу оператору
                    </button>
                )}
            </div>
        </div>
    );
};

export default TactAnalysisTable;