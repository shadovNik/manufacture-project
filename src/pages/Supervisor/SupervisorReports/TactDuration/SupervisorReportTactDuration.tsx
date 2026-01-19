import { useState } from 'react';
import SupervisorHeader from '../../../../components/Headers/SupervisorHeader';
import SupervisorAnalysisComponent from '../../../../components/SupervisorAnalysisComponent/SupervisorAnalysisComponent';
import TactAnalysisTable, { type TableRowData } from '../../../../components/SupervisorAnalysisTable/TactAnalysisTable/TactAnalysisTable';
const SupervisorReportTactDuration = () => {
    // Общие поля
    const [shift, setShift] = useState('Дневная');
    const [division, setDivision] = useState('Цех 1');
    const [executor, setExecutor] = useState('Иванов И.И.');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [startTime, setStartTime] = useState('08:00');
    const [endTime, setEndTime] = useState('20:00');

    // Специфичные поля для такта
    const [product, setProduct] = useState('Продукт А');
    const [tactTimeSec, setTactTimeSec] = useState<number | ''>();
    const [dailyRate, setDailyRate] = useState<number | ''>();

    // Состояние таблицы
    const [tableData, setTableData] = useState<TableRowData[]>([]);
    const [showTable, setShowTable] = useState(false);

    const generateTable = () => {
        if (!dailyRate || !date) {
            alert("Проверьте, все ли поля заполнены корректно.");
            return;
        }

        // Определяем временные интервалы согласно вашему шаблону (image_99d5ed.png)
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
            { time: "16:00 - 17:00", isBreak: false },
            { time: "Уборка 15 мин", isBreak: true },
        ];

        const workingSlotsCount = timeSlots.filter(s => !s.isBreak).length; // В данном случае 8 часов
        const planPerHour = Math.round(Number(dailyRate) / workingSlotsCount);

        let currentCumulativePlan = 0;

        const initialRows: TableRowData[] = timeSlots.map(slot => {
            if (!slot.isBreak) {
                currentCumulativePlan += planPerHour;
            }
            
            return {
                timeRange: slot.time,
                isBreak: slot.isBreak,
                plan: slot.isBreak ? 0 : planPerHour,
                cumulativePlan: slot.isBreak ? currentCumulativePlan : currentCumulativePlan,
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
                    title="Производственный анализ"
                    analysisType="По времени такта"
                    onGenerate={generateTable}
                    commonState={{
                        shift, setShift, division, setDivision, 
                        executor, setExecutor, date, setDate,
                        startTime, setStartTime, endTime, setEndTime
                    }}
                    additionalMainInfo={
                        <>
                            <div className="info-item">
                                <p className="info-item--label">Продукт:</p>
                                <select title='Продукт' className="info-item--value select" value={product} onChange={(e) => setProduct(e.target.value)}>
                                    <option>Продукт А</option>
                                    <option>Продукт Б</option>
                                </select>
                            </div>
                            <div className="info-item">
                                <p className="info-item--label">Время такта, сек:</p>
                                <input title='Время такта' type="number" className="info-item--value input" value={tactTimeSec} onChange={(e) => setTactTimeSec(Number(e.target.value))} />
                            </div>
                            <div className="info-item">
                                <p className="info-item--label">Суточный темп, шт:</p>
                                <input title='Суточный темп' type="number" className="info-item--value input" value={dailyRate} onChange={(e) => setDailyRate(Number(e.target.value))} />
                            </div>
                        </>
                    }
                />

                {showTable && <TactAnalysisTable 
                    data={tableData} 
                    setData={setTableData}
                    headerInfo={{ product, division, executor, tactTimeSec, dailyRate }}
                />}
        </>
    );
}

export default SupervisorReportTactDuration;