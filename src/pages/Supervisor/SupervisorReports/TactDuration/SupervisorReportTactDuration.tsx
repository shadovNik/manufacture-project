import { useEffect, useState, useCallback } from 'react';
import SupervisorHeader from '../../../../components/Headers/SupervisorHeader';
import SupervisorAnalysisComponent from '../../../../components/SupervisorAnalysisComponent/SupervisorAnalysisComponent';
import TactAnalysisTable, { type TableRowData } from '../../../../components/SupervisorAnalysisTable/TactAnalysisTable/TactAnalysisTable';
// @ts-ignore
import axiosInstance from "../../../../utils/axiosInstance";

interface DictionaryItem {
    id: number;
    name: string;
}

interface ServerTableRow {
    workInterval: string;
    planQTY: number;
    planCumulative: number;
    factQTY: number;
    factCumulative: number;
    deviation: number;
    deviationCumulative: number;
    downtimeMinutes: number;
    responsibleUserName: string;
    reasonGroupName: string;
    comment: string;
    takenMeasures: string;
}

const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const SupervisorReportTactDuration = () => {
    const [divisions, setDivisions] = useState<DictionaryItem[]>([]);
    const [executors, setExecutors] = useState<DictionaryItem[]>([]);
    const [products, setProducts] = useState<DictionaryItem[]>([]);

    const [headerNames, setHeaderNames] = useState({
        product: '',
        division: '',
        executor: ''
    });

    const [shift, setShift] = useState('Дневная');
    const [shiftId, setShiftId] = useState<number | null>(null);
    const [division, setDivision] = useState<number | string>('');
    const [executor, setExecutor] = useState<number | string>('');
    const [date, setDate] = useState(getTodayDate());
    const [startTime, setStartTime] = useState('08:00');
    const [endTime, setEndTime] = useState('16:00');

    const [product, setProduct] = useState<number | string>('');
    const [tactTimeSec, setTactTimeSec] = useState<number | ''>('');
    const [dailyRate, setDailyRate] = useState<number | ''>('');

    const [tableData, setTableData] = useState<TableRowData[]>([]);
    const [tableId, setTableId] = useState<string | number>('');
    const [showTable, setShowTable] = useState(false);
    const [isExistingTable, setIsExistingTable] = useState(false);

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

    const mapServerRows = useCallback((serverRows: ServerTableRow[]) => {
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
                rowId: (row as any).rowId,
                timeRange: slot.time,
                isBreak: false,
                plan: row?.planQTY || 0,
                cumulativePlan: row?.planCumulative || 0,
                fact: row?.factQTY || 0,
                cumulativeFact: row?.factCumulative || 0,
                deviation: row?.deviation || 0,
                cumulativeDeviation: row?.deviationCumulative || 0,
                downtimeMin: row?.downtimeMinutes || 0,
                responsibleUserId: (row as any).responsibleUserId || undefined, 
                responsible: (row?.responsibleUserName || '').trim(),
                reasonGroup: row?.reasonGroupName || '',
                reasonComment: row?.comment || '',
                measures: row?.takenMeasures || ''
            };
        });
    }, []);

    const fetchTableByShift = useCallback(async (sId: number) => {
        try {
            const tableRes = await axiosInstance.get(`/PowerPerHourTable/${sId}/table`);
            if (tableRes.data && tableRes.data.rows) {
                const data = tableRes.data;

                setTableId(data.id);
                
                setTableData(mapServerRows(data.rows));

                if (data.productId) {
                    setProduct(String(data.productId)); 
                }
                
                setTactTimeSec(data.powerPerHour || '');
                setDailyRate(data.dailyTarget || '');
                
                setHeaderNames({
                    product: data.productName || '',
                    division: data.departmentName || '',
                    executor: data.filledBy || ''
                });

                setShowTable(true);
                setIsExistingTable(true);
            }
        } catch (error: any) {
            if (error.response?.status === 404) {
                setIsExistingTable(false);
            }
        }
    }, [mapServerRows]);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [deptRes, prodRes, shiftRes] = await Promise.all([
                    axiosInstance.get('/dictionaries/Department?page=1'),
                    axiosInstance.get('/dictionaries/Product?page=1'),
                    axiosInstance.get('/shifts')
                ]);

                setDivisions(deptRes.data);
                setProducts(prodRes.data);

                if (shiftRes.data) {
                    const activeShift = shiftRes.data;
                    setShift(activeShift.shiftType || 'Дневная');
                    setShiftId(activeShift.id);
                    setDivision(activeShift.departmentId);
                    setExecutor(activeShift.operatorId);
                    
                    if (activeShift.startTime) {
                        setStartTime(new Date(activeShift.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
                    }
                    
                    fetchTableByShift(activeShift.id);
                }
            } catch (error) {
                console.error("Ошибка загрузки данных:", error);
            }
        };
        loadInitialData();
    }, [fetchTableByShift]);

    useEffect(() => {
        const fetchExecutors = async () => {
            if (!division) {
                setExecutors([]);
                return;
            }
            try {
                const res = await axiosInstance.get(`/users/${division}`);
                setExecutors(res.data.map((u: any) => ({
                    id: u.id,
                    name: `${u.lastName} ${u.firstName}`
                })));
            } catch (error) {
                console.error("Ошибка загрузки исполнителей:", error);
                setExecutors([]);
            }
        };
        fetchExecutors();
    }, [division]);

    const handleCreateReport = async () => {
        if (!dailyRate || !tactTimeSec || !product) {
            alert("Пожалуйста, заполните Продукт, Время такта и Суточный темп.");
            return;
        }

        const payload = {
            productId: Number(product),
            departmentId: Number(division),
            operatorId: Number(executor),
            shiftId: shiftId,
            powerPerHour: Number(tactTimeSec),
            dailyTarget: Number(dailyRate),
            scenarioName: "По времени такта"
        };

        try {
            await axiosInstance.post('/PowerPerHourTable/create', payload);
            if (shiftId) await fetchTableByShift(shiftId);
        } catch (error) {
            console.error("Ошибка при создании:", error);
            alert("Не удалось создать таблицу");
        }
    };

    return (
        <>
            <SupervisorHeader />
            <SupervisorAnalysisComponent 
                divisions={divisions}
                executors={executors}
                title="Производственный анализ"
                analysisType="По времени такта"
                onGenerate={isExistingTable ? () => {} : handleCreateReport}
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
                            <select 
                                title='Продукт' 
                                className="info-item--value select" 
                                value={String(product)}
                                onChange={(e) => setProduct(e.target.value)}
                                disabled={isExistingTable}
                            >
                                <option value="">Выберите продукт...</option>
                                {products.map(p => (
                                    <option key={p.id} value={String(p.id)}>{p.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="info-item">
                            <p className="info-item--label">Время такта, сек:</p>
                            <input 
                                title='Время такта' 
                                type="number" 
                                className="info-item--value input" 
                                value={tactTimeSec} 
                                onChange={(e) => setTactTimeSec(Number(e.target.value))} 
                                disabled={isExistingTable}
                            />
                        </div>
                        <div className="info-item">
                            <p className="info-item--label">Суточный темп, шт:</p>
                            <input 
                                title='Суточный темп' 
                                type="number" 
                                className="info-item--value input" 
                                value={dailyRate} 
                                onChange={(e) => setDailyRate(Number(e.target.value))} 
                                disabled={isExistingTable}
                            />
                        </div>
                    </>
                }
                isGenerateDisabled={isExistingTable}
            />

            {showTable && <TactAnalysisTable 
                tableId={tableId}
                data={tableData} 
                setData={setTableData}
                headerInfo={{ 
                    divisionId: Number(division),
                    product: isExistingTable 
                        ? headerNames.product 
                        : (products.find(p => p.id === Number(product))?.name || ''), 
                    division: isExistingTable 
                        ? headerNames.division 
                        : (divisions.find(d => d.id === Number(division))?.name || ''),
                    executor: isExistingTable 
                        ? headerNames.executor 
                        : (executors.find(e => e.id === Number(executor))?.name || ''),
                    tactTimeSec: tactTimeSec || 0, 
                    dailyRate: dailyRate || 0 
                }}
            />}
        </>
    );
}

export default SupervisorReportTactDuration;