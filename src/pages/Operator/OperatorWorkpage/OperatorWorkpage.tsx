import { useEffect, useState } from 'react';
// @ts-ignore
import axiosInstance from "../../../utils/axiosInstance";

import OperatorHeader from "../../../components/Headers/OperatorHeader";
import './OperatorWorkpage.css';

interface ShiftData {
    id: number;
    startTime: string;
    endTime: string;
    departmentName: string;
    operatorName: string;
    departmentId: number;
    operatorId: number;
}

const OperatorWorkpage = () => {
    const [isWorkShiftExist, setIsWorkShiftExist] = useState<boolean>(false);
    const [shiftData, setShiftData] = useState<ShiftData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchCurrentShift = async () => {
        try {
            setIsLoading(true);
            const { data } = await axiosInstance.get("/shifts");
            
            const activeShift = Array.isArray(data) ? data[0] : data;

            if (activeShift && activeShift.id) {
                setShiftData(activeShift);
                setIsWorkShiftExist(true);
            } else {
                setIsWorkShiftExist(false);
            }
        } catch (error) {
            console.error("Ошибка при проверке смены оператором:", error);
            setIsWorkShiftExist(false);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCurrentShift();
    }, []);

    if (isLoading) {
        return <div className="loading-screen">Загрузка данных оператора...</div>;
    }

    return (
        <>
            <OperatorHeader />
            <main className="operator-workpage-main">
                {!isWorkShiftExist ? (
                    <div className="operator-workpage-no-shift">
                        <div className="no-shift-message">
                            <h2>Смена не открыта</h2>
                            <p>Для начала работы начальник смены должен создать рабочую смену в системе.</p>
                            <p className="hint">Пожалуйста, обратитесь к руководителю подразделения.</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="operator-workpage-info">
                            <div className="operator-workpage-info-element shift-info">
                                <p className="operator-workpage-info-element--title">Текущая смена</p>
                                <p className="operator-workpage-info-element--value">
                                    {shiftData?.departmentName || 'Цех не указан'}
                                </p>
                                <p className="operator-workpage-info-element--subtitle">
                                    {shiftData ? new Date(shiftData.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--'}
                                    {shiftData?.endTime ? ` - ${new Date(shiftData.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}` : ' - ...'}
                                </p>
                            </div>

                            <div className="operator-workpage-info-element deviations-info">
                                <p className="operator-workpage-info-element--title">Отклонения от плана</p>
                                <p className="operator-workpage-info-element--value">Всего: </p>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </>
    );
}

export default OperatorWorkpage;