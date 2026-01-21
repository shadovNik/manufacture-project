import { useEffect, useState } from 'react';
import SupervisorHeader from '../../../../components/Headers/SupervisorHeader';
import SupervisorAnalysisComponent from '../../../../components/SupervisorAnalysisComponent/SupervisorAnalysisComponent';
import PowerAnalysisTable, { type PowerTableRowData } from '../../../../components/SupervisorAnalysisTable/PowerAnalysisTable/PowerAnalysisTable';
// @ts-ignore
import axiosInstance from "../../../../utils/axiosInstance";

interface DictionaryItem {
    id: number;
    name: string;
}

const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const SupervisorReportPower = () => {
    const [divisions, setDivisions] = useState<DictionaryItem[]>([]);
    const [executors, setExecutors] = useState<DictionaryItem[]>([]);

    const [shift, setShift] = useState('Дневная');
    const [division, setDivision] = useState<number | string>('');
    const [executor, setExecutor] = useState<number | string>('');
    const [date, setDate] = useState(getTodayDate());
    const [startTime, setStartTime] = useState('08:00');
    const [endTime, setEndTime] = useState('16:00');

    const [product, setProduct] = useState('Продукт А');
    const [workplacePower, setWorkplacePower] = useState<number | ''>(''); 
    const [dailyRate, setDailyRate] = useState<number | ''>('');

    const [tableData, setTableData] = useState<PowerTableRowData[]>([]);
    const [showTable, setShowTable] = useState(false);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const deptRes = await axiosInstance.get('/dictionaries/Department?page=1');
                setDivisions(deptRes.data);

                const shiftRes = await axiosInstance.get('/shifts');
                if (shiftRes.data && shiftRes.data.length > 0) {
                    const activeShift = shiftRes.data[0];
                    setShift(activeShift.shiftType || 'Дневная');
                    setDivision(activeShift.departmentId);
                    setExecutor(activeShift.operatorId);
                    
                    if (activeShift.startTime) {
                        setStartTime(new Date(activeShift.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
                    }
                }
            } catch (error) {
                console.error("Ошибка загрузки данных подразделений или смены:", error);
            }
        };
        loadInitialData();
    }, []);

    useEffect(() => {
        const fetchExecutors = async () => {
            if (!division) {
                setExecutors([]);
                return;
            }
            try {
                const res = await axiosInstance.get(`/users/${division}`);
                const formattedUsers = res.data.map((u: any) => ({
                    id: u.id,
                    name: `${u.lastName} ${u.firstName}`
                }));
                setExecutors(formattedUsers);
            } catch (error) {
                console.error("Ошибка загрузки исполнителей:", error);
                setExecutors([]);
            }
        };
        fetchExecutors();
    }, [division]);

    const generateTable = () => {
        if (!dailyRate || !date || !division || !executor || !workplacePower) {
            alert("Пожалуйста, заполните все поля, включая мощность и исполнителя.");
            return;
        }

        const timeSlots = [
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
        ];

        const workingSlotsCount = timeSlots.filter(s => !s.isBreak).length;
        // Формула: План = Суточный темп / Время работы час
        const planPerHour = Math.round(Number(dailyRate) / workingSlotsCount);

        let currentCumulativePlan = 0;
        const initialRows: PowerTableRowData[] = timeSlots.map(slot => {
            if (!slot.isBreak) currentCumulativePlan += planPerHour;
            return {
                timeRange: slot.time,
                isBreak: slot.isBreak,
                plan: slot.isBreak ? 0 : planPerHour,
                cumulativePlan: currentCumulativePlan,
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
        });

        setTableData(initialRows);
        setShowTable(true);
    };

    return (
        <>
            <SupervisorHeader />
            <SupervisorAnalysisComponent 
                divisions={divisions}
                executors={executors}
                title="Производственный анализ"
                analysisType="По мощности рабочего места"
                onGenerate={generateTable}
                commonState={{
                    shift, setShift, 
                    division: String(division), setDivision, 
                    executor: String(executor), setExecutor, 
                    date, setDate,
                    startTime, setStartTime, 
                    endTime, setEndTime
                }}
                additionalMainInfo={
                    <>
                        <div className="info-item">
                            <p className="info-item--label">Продукт:</p>
                            <select title="Продукт" className="info-item--value select" value={product} onChange={(e) => setProduct(e.target.value)}>
                                <option>Продукт А</option>
                                <option>Продукт Б</option>
                            </select>
                        </div>
                        <div className="info-item">
                            <p className="info-item--label">Мощность, шт/час:</p>
                            <input
                                title="Мощность" 
                                type="number" 
                                className="info-item--value input" 
                                value={workplacePower} 
                                onChange={(e) => setWorkplacePower(e.target.value ? Number(e.target.value) : '')} 
                            />
                        </div>
                        <div className="info-item">
                            <p className="info-item--label">Суточный темп, шт:</p>
                            <input
                                title="Темп" 
                                type="number" 
                                className="info-item--value input" 
                                value={dailyRate} 
                                onChange={(e) => setDailyRate(e.target.value ? Number(e.target.value) : '')} 
                            />
                        </div>
                    </>
                }
            />

            {showTable && <PowerAnalysisTable 
                data={tableData} 
                setData={setTableData}
                headerInfo={{ 
                    product, 
                    division: divisions.find(d => d.id === Number(division))?.name || '', 
                    executor: executors.find(e => e.id === Number(executor))?.name || '', 
                    workplacePower, 
                    dailyRate 
                }}
            />}
        </>
    );
}

export default SupervisorReportPower;