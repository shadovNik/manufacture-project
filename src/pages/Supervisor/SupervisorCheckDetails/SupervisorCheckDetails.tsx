import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import "./SupervisorCheckDetails.css";

import TactAnalysisTable, { type TableRowData } from '../../../components/SupervisorAnalysisTable/TactAnalysisTable/TactAnalysisTable';
// @ts-ignore
import axiosInstance from "../../../utils/axiosInstance";
import SupervisorHeader from '../../../components/Headers/SupervisorHeader';

const SCHEDULE_TEMPLATE = [
    { time: "08:00 - 09:00", isBreak: false },
    { time: "09:00 - 10:00", isBreak: false },
    { time: "Перерыв 15 мин", isBreak: true },
    { time: "10:15 - 11:15", isBreak: false },
    { time: "11:15 - 12:15", isBreak: false },
    { time: "Обед 30 мин", isBreak: true },
    { time: "12:45 - 13:45", isBreak: false },
    { time: "13:45 - 14:45", isBreak: false },
    { time: "Перерыв 15 мин", isBreak: true },
    { time: "15:00 - 16:00", isBreak: false },
    { time: "16:00 - 17:00", isBreak: false },
];

const SupervisorCheckDetails = () => {
    const { id } = useParams<{ id: string }>();
    const [tableData, setTableData] = useState<TableRowData[]>([]);
    const [headerInfo, setHeaderInfo] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const mapServerRows = useCallback((serverRows: any[]) => {
        let workRowIndex = 0;
        return SCHEDULE_TEMPLATE.map((slot) => {
            if (slot.isBreak) {
                return {
                    timeRange: slot.time,
                    isBreak: true,
                    plan: 0,
                    cumulativePlan: 0,
                    fact: 0,
                    cumulativeFact: 0,
                    deviation: 0,
                    cumulativeDeviation: 0,
                    downtimeMin: 0,
                    responsible: '',
                    reasonGroup: '',
                    reasonComment: '',
                    measures: ''
                };
            }
            const row = serverRows[workRowIndex];
            workRowIndex++;
            return {
                rowId: row?.rowId,
                timeRange: slot.time,
                isBreak: false,
                plan: row?.planQTY || 0,
                cumulativePlan: row?.planCumulative || 0,
                fact: row?.factQTY || 0,
                cumulativeFact: row?.factCumulative || 0,
                deviation: row?.deviation || 0,
                cumulativeDeviation: row?.deviationCumulative || 0,
                downtimeMin: row?.downtimeMinutes || 0,
                responsibleUserId: row?.responsibleUserId,
                responsible: (row?.responsibleUserName || '').trim(),
                reasonGroup: row?.reasonGroupName || '',
                reasonComment: row?.comment || '',
                measures: row?.takenMeasures || ''
            };
        });
    }, []);

    useEffect(() => {
        const fetchTableData = async () => {
            try {
                setIsLoading(true);
                const res = await axiosInstance.get(`/PowerPerHourTable/table/${id}`);
                
                if (res.data) {
                    const data = res.data;
                    setHeaderInfo({
                        product: data.productName,
                        division: data.departmentName,
                        divisionId: data.departmentId,
                        executor: data.filledBy,
                        tactTimeSec: data.powerPerHour,
                        dailyRate: data.dailyTarget
                    });

                    const rows = mapServerRows(data.rows);
                    setTableData(rows);
                }
            } catch (error) {
                console.error("Ошибка:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) fetchTableData();
    }, [id, mapServerRows]);

    if (isLoading) {
        return <div className="loading-screen">Загрузка данных анализа...</div>;
    }

    return (
        <>
            <SupervisorHeader />
            <main className="supervisor-report-details-main">
                <div className="supervisor-report-details-content">
                    {tableData.length > 0 && headerInfo && (
                        <TactAnalysisTable 
                            tableId={id!} 
                            data={tableData} 
                            setData={setTableData} 
                            headerInfo={headerInfo} 
                            isReviewPage={true}
                        />
                    )}
                </div>
            </main>
        </>
    );
};

export default SupervisorCheckDetails;