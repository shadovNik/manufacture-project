import { useState } from 'react';
import SupervisorHeader from '../../../../components/Headers/SupervisorHeader';
import SupervisorAnalysisComponent from '../../../../components/SupervisorAnalysisComponent/SupervisorAnalysisComponent';
import NomenclaturesAnalysisTable, { type NomTableRowData, type ProductNom } from '../../../../components/SupervisorAnalysisTable/NomenclaturesAnalysisTable/NomenclaturesAnalysisTable';
import './SupervisorReportNomenclatures.css';

const SupervisorReportNomenclatures = () => {
    // Общие поля
    const [shift, setShift] = useState('Дневная');
    const [division, setDivision] = useState('Цех 1');
    const [executor, setExecutor] = useState('Иванов И.И.');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [startTime, setStartTime] = useState('08:00');
    const [endTime, setEndTime] = useState('20:00');

    // Состояние для блока номенклатуры (как на image_a5ac4b.png)
    const [nomenclatures, setNomenclatures] = useState<ProductNom[]>([
        { id: Date.now(), name: 'Втулка', cycleTime: 240, dailyRate: 150 }
    ]);

    const [tableData, setTableData] = useState<NomTableRowData[]>([]);
    const [showTable, setShowTable] = useState(false);

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
        if (!date || nomenclatures.some(n => !n.name || n.dailyRate <= 0)) {
            alert("Проверьте, все ли поля заполнены корректно.");
            return;
        }

        // Базовая сетка часов (упрощенная для примера)
        const timeSlots = [
            { time: "08:00 - 09:00" }, { time: "09:00 - 10:00" }, { time: "10:15 - 11:15" },
            { time: "11:15 - 12:15" }, { time: "12:45 - 13:45" }, { time: "13:45 - 14:45" },
            { time: "15:00 - 16:00" }, { time: "16:00 - 17:00" }
        ];

        // Логика распределения: делим доступные часы между продуктами поровну
        const slotsPerProduct = Math.floor(timeSlots.length / nomenclatures.length);
        const rows: NomTableRowData[] = [];
        let currentCumulativePlan = 0;

        nomenclatures.forEach((prod, pIdx) => {
            const prodSlots = timeSlots.slice(pIdx * slotsPerProduct, (pIdx + 1) * slotsPerProduct);
            const planPerSlot = Math.round(prod.dailyRate / prodSlots.length); // Формула: Суточный темп / Время работы

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

            // Добавляем строку переналадки после каждого продукта, кроме последнего (image_a5ab54.png)
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
                    changeoverMin: 15 // Ручной ввод из формулы №22
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
                    title="Производственный анализ"
                    analysisType="По номенклатуре продукции"
                    onGenerate={generateTable}
                    commonState={{ shift, setShift, division, setDivision, executor, setExecutor, date, setDate, startTime, setStartTime, endTime, setEndTime }}
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