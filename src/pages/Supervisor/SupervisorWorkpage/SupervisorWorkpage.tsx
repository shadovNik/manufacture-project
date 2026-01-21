import './SupervisorWorkpage.css';
import { useEffect, useState } from 'react';
// @ts-ignore
import axiosInstance from "../../../utils/axiosInstance";

import SupervisorHeader from '../../../components/Headers/SupervisorHeader';
import CreateWorkShiftModal from '../../../components/CreateWorkShiftModal/CreateWorkShiftModal';

interface ShiftData {
    id: number;
    startTime: string;
    endTime: string;
    departmentName: string;
    operatorName: string;
    departmentId: number;
    operatorId: number;
}

const SupervisorWorkpage = () => {
    const [isWorkShiftExist, setIsWorkShiftExist] = useState<boolean>(false);
    const [isWorkShiftModalOpen, setIsWorkShiftModalOpen] = useState<boolean>(false);
    const [shiftData, setShiftData] = useState<ShiftData>();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchCurrentShift = async () => {
        try {
            setIsLoading(true);
            const { data } = await axiosInstance.get<ShiftData>("/shifts");
            
            if (data && data.length !== 0) {
                setShiftData(data); 
                setIsWorkShiftExist(true);
            } else {
                setIsWorkShiftExist(false);
            }
        } catch (error) {
            console.error("Ошибка при проверке смены:", error);
            setIsWorkShiftExist(false);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCurrentShift();
    }, []);

    const handleCreateWorkShift = () => {
        setIsWorkShiftModalOpen((prev) => !prev);
    }

    const closeWorkShiftModal = () => {
        setIsWorkShiftModalOpen(false);
        fetchCurrentShift();
    }

    const handleEndWorkShift = async () => {
        if (!window.confirm("Вы уверены, что хотите завершить текущую смену?")) {
            return;
        }

        try {
            await axiosInstance.put(`/shifts/close/${shiftData?.id}`, {}); 
            
            alert("Смена успешно завершена");
            setShiftData(undefined);
            setIsWorkShiftExist(false);
            fetchCurrentShift();
        } catch (error) {
            console.error("Ошибка при завершении смены:", error);
            alert("Не удалось завершить смену");
        }
    };

    if (isLoading) {
        return <div className="loading-screen">Загрузка данных...</div>;
    }

    return (
        <>
            <SupervisorHeader />
            <main className="supervisor-workpage-main">
                {!isWorkShiftExist && (
                    <div className="supervisor-workpage-no-shift">
                        <p>Смена ещё не создана. Хотите создать?</p>
                        <button className="supervisor-workpage-no-shift-button" onClick={handleCreateWorkShift}>Создать смену</button>
                    </div>
                )}
                
                {isWorkShiftModalOpen && <CreateWorkShiftModal closeWorkShiftModal={closeWorkShiftModal} />}

                {isWorkShiftExist && (
                    <>
                        <div className="supervisor-workpage-info">
                            <div className="supervisor-workpage-info-element">
                                <p className="supervisor-workpage-info-element--title">Текущая смена</p>
                                <p className="supervisor-workpage-info-element--value">
                                    {shiftData ? new Date(shiftData.startTime).toLocaleDateString() : '—'}
                                </p>
                                <p className="supervisor-workpage-info-element--subtitle">
                                    {shiftData ? new Date(shiftData.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '—'} 
                                    {shiftData?.endTime ? ` - ${new Date(shiftData.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}` : ''}
                                </p>
                            </div>
                            <div className="supervisor-workpage-info-element">
                                <p className="supervisor-workpage-info-element--title">Ответственный</p>
                                <p className="supervisor-workpage-info-element--value">{shiftData?.operatorName || 'Не назначен'}</p>
                            </div>
                            <div className="supervisor-workpage-info-element">
                                <p className="supervisor-workpage-info-element--title">Подразделение</p>
                                <p className="supervisor-workpage-info-element--value">{shiftData?.departmentName || '—'}</p>
                            </div>
                        </div>

                        <div className="supervisor-workpage-actions">
                            <button 
                                className="supervisor-workpage-end-shift-button" 
                                onClick={handleEndWorkShift}
                            >
                                Завершить смену
                            </button>
                        </div>
                    </>
                )}
            </main>
        </>
    );
}

export default SupervisorWorkpage;