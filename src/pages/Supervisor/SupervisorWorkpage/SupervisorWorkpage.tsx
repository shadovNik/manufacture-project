import './SupervisorWorkpage.css';
import { useEffect, useState } from 'react';
// @ts-ignore
import axiosInstance from "../../../utils/axiosInstance";

import DeviationsTable from '../../../components/DeviationsTable/DeviationsTable';
import SupervisorHeader from '../../../components/Headers/SupervisorHeader';
import CreateWorkShiftModal from '../../../components/CreateWorkShiftModal/CreateWorkShiftModal';

// Типизация данных смены
interface ShiftData {
    id: number;
    startTime: string;
    departmentName: string;
    operatorName: string;
    status: string;
}

const SupervisorWorkpage = () => {
    const [isWorkShiftExist, setIsWorkShiftExist] = useState<boolean>(false);
    const [isWorkShiftModalOpen, setIsWorkShiftModalOpen] = useState<boolean>(false);
    const [shiftData, setShiftData] = useState<ShiftData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Функция для получения данных о текущей смене
    const fetchCurrentShift = async () => {
        try {
            setIsLoading(true);
            // Замените URL на ваш реальный эндпоинт для проверки активной смены
            const { data } = await axiosInstance.get<ShiftData>("/shifts");
            
            if (data) {
                setShiftData(data[0]);
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
        // После закрытия модалки и успешного создания смены 
        // запрашиваем актуальные данные заново
        fetchCurrentShift();
    }

    if (isLoading) {
        return <div className="loading-screen">Загрузка данных...</div>;
    }

    return (
        <>
            <SupervisorHeader />
            <main className="supervisor-workpage-main">
                {/* Блок создания смены, если она не существует */}
                {!isWorkShiftExist && (
                    <div className="supervisor-workpage-no-shift">
                        <p>Смена ещё не создана. Хотите создать?</p>
                        <button className="supervisor-workpage-no-shift-button" onClick={handleCreateWorkShift}>Создать смену</button>
                    </div>
                )}
                
                {isWorkShiftModalOpen && <CreateWorkShiftModal closeWorkShiftModal={closeWorkShiftModal} />}

                {/* Блок информации отображается только если смена существует */}
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
                                </p>
                            </div>
                            <div className="supervisor-workpage-info-element">
                                <p className="supervisor-workpage-info-element--title">Состояние бланка</p>
                                <p className="supervisor-workpage-info-element--value">{shiftData?.status || 'В работе'}</p>
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
                        <DeviationsTable />
                    </>
                )}
            </main>
        </>
    );
}

export default SupervisorWorkpage;