import React, { useMemo } from 'react';
import './NomenclaturesAnalysisTable.css';

export interface ProductNom {
    id: number;
    name: string;
    cycleTime: number;
    dailyRate: number;
}

export interface NomTableRowData {
    id: number;
    productName: string;
    timeRange: string;
    plan: number;
    cumulativePlan: number;
    fact: number;
    cumulativeFact: number;
    deviation: number;
    cumulativeDeviation: number;
    isChangeover: boolean;
    changeoverMin?: number;
}

interface Props {
    data: NomTableRowData[];
    setData: React.Dispatch<React.SetStateAction<NomTableRowData[]>>;
}

const NomenclaturesAnalysisTable: React.FC<Props> = ({ data, setData }) => {
    
    // Функция для расчета объединения ячеек (rowSpan)
    const rowSpans = useMemo(() => {
        const spans: number[] = [];
        let i = 0;
        while (i < data.length) {
            let count = 1;
            while (i + count < data.length && data[i + count].productName === data[i].productName) {
                count++;
            }
            spans[i] = count; // Записываем количество строк для первой ячейки блока
            for (let j = 1; j < count; j++) {
                spans[i + j] = 0; // Остальные помечаем как 0 (не рендерим)
            }
            i += count;
        }
        return spans;
    }, [data]);

    const handleFactChange = (idx: number, val: number) => {
        const newData = [...data];
        newData[idx].fact = val;
        let runningFact = 0;
        let runningDev = 0;

        newData.forEach(row => {
            runningFact += row.fact;
            row.cumulativeFact = runningFact;
            row.deviation = row.plan - row.fact;
            runningDev += row.deviation;
            row.cumulativeDeviation = runningDev;
        });
        setData(newData);
    };

    return (
        <div className="table-container">
            <table className="analysis-table nom-table">
                <thead>
                    <tr>
                        <th>Изделие</th>
                        <th>Время работы</th>
                        <th>План</th>
                        <th>План накоп.</th>
                        <th>Факт</th>
                        <th>Факт накоп.</th>
                        <th>Отклонение</th>
                        <th>Отклонение накоп.</th>
                        <th>Переналадка (мин)</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, idx) => (
                        <tr key={row.id} className={row.isChangeover ? 'changeover-row' : ''}>
                            {/* Объединяем ячейки по вертикали для названия изделия */}
                            {rowSpans[idx] > 0 && (
                                <td 
                                    className="product-label-cell" 
                                    rowSpan={rowSpans[idx]}
                                >
                                    {row.productName}
                                </td>
                            )}
                            
                            <td className={row.isChangeover ? 'horizontal-text' : ''}>
                                {row.timeRange}
                            </td>
                            <td>{row.plan}</td>
                            <td>{row.cumulativePlan}</td>
                            <td>
                                {!row.isChangeover && (
                                    <input
                                        title="Факт" 
                                        type="number" 
                                        value={row.fact || ''} 
                                        onChange={e => handleFactChange(idx, Number(e.target.value))} 
                                    />
                                )}
                            </td>
                            <td>{row.cumulativeFact}</td>
                            <td className={row.deviation > 0 ? 'text-red' : ''}>
                                {row.deviation}
                            </td>
                            <td>{row.cumulativeDeviation}</td>
                            <td>
                                {row.isChangeover && (
                                    <input
                                        title="Переналадка, мин" 
                                        type="number" 
                                        className="changeover-input"
                                        value={row.changeoverMin} 
                                        onChange={e => {
                                            const d = [...data];
                                            d[idx].changeoverMin = Number(e.target.value);
                                            setData(d);
                                        }} 
                                    />
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default NomenclaturesAnalysisTable;