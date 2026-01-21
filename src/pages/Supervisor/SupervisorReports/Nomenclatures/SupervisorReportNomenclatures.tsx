import { useEffect, useState } from 'react';
import SupervisorHeader from '../../../../components/Headers/SupervisorHeader';
import SupervisorAnalysisComponent from '../../../../components/SupervisorAnalysisComponent/SupervisorAnalysisComponent';
import NomenclaturesAnalysisTable, { type NomTableRowData, type ProductNom } from '../../../../components/SupervisorAnalysisTable/NomenclaturesAnalysisTable/NomenclaturesAnalysisTable';
import './SupervisorReportNomenclatures.css';
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

const SupervisorReportNomenclatures = () => {
    const [divisions, setDivisions] = useState<DictionaryItem[]>([]);
    const [executors, setExecutors] = useState<DictionaryItem[]>([]);

    const [shift, setShift] = useState('Дневная');
    const [division, setDivision] = useState<number | string>('');
    const [executor, setExecutor] = useState<number | string>('');
    const [date, setDate] = useState(getTodayDate());
    const [startTime, setStartTime] = useState('08:00');
    const [endTime, setEndTime] = useState('20:00');

    const [nomenclatures, setNomenclatures] = useState<ProductNom[]>([
        { id: Date.now(), name: 'Втулка', cycleTime: 240, dailyRate: 150 }
    ]);

    const [tableData, setTableData] = useState<NomTableRowData[]>([]);
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
                console.error("Ошибка загрузки первичных данных номенклатуры:", error);
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

    const addNomenclature = () => {
        setNomenclatures([...nomenclatures, { id: Date.now(), name: '', cycleTime: 0, dailyRate: 0 }]);
    };

    const removeNomenclature = (id: number) => {
        setNomenclatures(nomenclatures.filter(n => n.id !== id));
    };

    const updateNom = (id: number, field: keyof ProductNom, value: string | number) => {
        setNomenclatures(nomenclatures.map(n => n.id === id ? { ...n, [field]: value } : n));
    };

    const generateTable = () => {
        if (!date || !division || !executor || nomenclatures.some(n => !n.name || n.dailyRate <= 0)) {
            alert("Пожалуйста, заполните все поля, включая подразделение, исполнителя и номенклатуру.");
            return;
        }

        const timeSlots = [
            { time: "08:00 - 09:00" }, { time: "09:00 - 10:00" }, { time: "10:15 - 11:15" },
            { time: "11:15 - 12:15" }, { time: "12:45 - 13:45" }, { time: "13:45 - 14:45" },
            { time: "15:00 - 16:00" }, { time: "16:00 - 17:00" }
        ];

        const slotsPerProduct = Math.floor(timeSlots.length / nomenclatures.length);
        const rows: NomTableRowData[] = [];
        let currentCumulativePlan = 0;

        nomenclatures.forEach((prod, pIdx) => {
            const prodSlots = timeSlots.slice(pIdx * slotsPerProduct, (pIdx + 1) * slotsPerProduct);
            const planPerSlot = Math.round(prod.dailyRate / prodSlots.length);

            prodSlots.forEach((slot) => {
                currentCumulativePlan += planPerSlot;
                rows.push({
                    id: Date.now() + Math.random(),
                    productName: prod.name,
                    timeRange: slot.time,
                    plan: planPerSlot,
                    cumulativePlan: currentCumulativePlan,
                    fact: 0,
                    cumulativeFact: 0,
                    deviation: 0,
                    cumulativeDeviation: 0,
                    isChangeover: false
                });
            });

            if (pIdx < nomenclatures.length - 1) {
                rows.push({
                    id: Date.now() + Math.random(),
                    productName: 'ПЕРЕНАЛАДКА',
                    timeRange: '15 мин',
                    plan: 0,
                    cumulativePlan: currentCumulativePlan,
                    fact: 0,
                    cumulativeFact: currentCumulativePlan,
                    deviation: 0,
                    cumulativeDeviation: 0,
                    isChangeover: true,
                    changeoverMin: 15
                });
            }
        });

        setTableData(rows);
        setShowTable(true);
    };

    return (
        <>
            <SupervisorHeader />
            <SupervisorAnalysisComponent 
                divisions={divisions}
                executors={executors}
                title="Производственный анализ"
                analysisType="По номенклатуре продукции"
                onGenerate={generateTable}
                commonState={{ 
                    shift, setShift, 
                    division: String(division), setDivision, 
                    executor: String(executor), setExecutor, 
                    date, setDate, 
                    startTime, setStartTime, 
                    endTime, setEndTime 
                }}
                additionalBlocks={
                    <div className="nomenclature-block">
                        <p className="nomenclature-title">Номенклатура продукции</p>
                        <table className="nomenclature-input-table">
                            <thead>
                                <tr>
                                    <th>Наименование продукции</th>
                                    <th>Тц, сек.</th>
                                    <th>Суточный темп, шт.</th>
                                    <th>Действия</th>
                                </tr>
                            </thead>
                            <tbody>
                                {nomenclatures.map(n => (
                                    <tr key={n.id}>
                                        <td><input title="Наименование продукции" value={n.name} onChange={e => updateNom(n.id, 'name', e.target.value)} /></td>
                                        <td><input title="Тц, сек." type="number" value={n.cycleTime} onChange={e => updateNom(n.id, 'cycleTime', Number(e.target.value))} /></td>
                                        <td><input title="Суточный темп, шт." type="number" value={n.dailyRate} onChange={e => updateNom(n.id, 'dailyRate', Number(e.target.value))} /></td>
                                        <td><button className="del-btn" onClick={() => removeNomenclature(n.id)}>🗑️</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button className="add-nom-btn" onClick={addNomenclature}>+ Добавить номенклатуру</button>
                    </div>
                }
            />
            {showTable && <NomenclaturesAnalysisTable data={tableData} setData={setTableData} />}
        </>
    );
};

export default SupervisorReportNomenclatures;