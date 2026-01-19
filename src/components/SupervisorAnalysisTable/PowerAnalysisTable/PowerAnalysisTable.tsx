import React from 'react';
import './PowerAnalysisTable.css';

export interface PowerTableRowData {
    timeRange: string;
    isBreak: boolean;
    plan: number;
    cumulativePlan: number;
    fact: number;
    cumulativeFact: number;
    deviation: number;
    cumulativeDeviation: number;
    downtimeMin: number;
    responsible: string;
    reasonGroup: string;
    reasonComment: string;
    measures: string;
}

interface PowerTableProps {
    data: PowerTableRowData[];
    setData: React.Dispatch<React.SetStateAction<PowerTableRowData[]>>;
    headerInfo: any;
}

const PowerAnalysisTable: React.FC<PowerTableProps> = ({ data, setData, headerInfo }) => {

    const handleFactChange = (index: number, value: number) => {
        const newData = [...data];
        newData[index].fact = value;

        let runningFact = 0;
        let runningDeviation = 0;

        newData.forEach((row) => {
            runningFact += row.fact;
            row.cumulativeFact = runningFact;
            
            // Формула 13 из image_9b37a2.jpg: Отклонение = План - Факт
            row.deviation = row.isBreak ? 0 : row.plan - row.fact;
            runningDeviation += row.deviation;
            row.cumulativeDeviation = runningDeviation;
        });

        setData(newData);
    };

    const handleInputChange = (index: number, field: keyof PowerTableRowData, value: any) => {
        const newData = [...data];
        (newData[index] as any)[field] = value;
        setData(newData);
    };

    return (
        <div className="table-container">
            <div className="table-header-info">
                <p>Продукт: <strong>{headerInfo.product}</strong></p>
                <p>Цех: <strong>{headerInfo.division}</strong></p>
                <p>Исполнитель: <strong>{headerInfo.executor}</strong></p>
                <p>Мощность: <strong>{headerInfo.workplacePower} шт/ч</strong></p>
                <p>Суточный темп: <strong>{headerInfo.dailyRate} шт.</strong></p>
            </div>
            <table className="analysis-table">
                <thead>
                    <tr>
                        <th rowSpan={2}>Время работы, час</th>
                        <th>План, шт.</th>
                        <th>План накоп.</th>
                        <th>Факт, шт.</th>
                        <th>Факт накоп.</th>
                        <th>Отклонение</th>
                        <th>Отклонение накоп.</th>
                        <th>Простой, мин</th>
                        <th>Ответственный</th>
                        <th>Причины и меры</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, idx) => (
                        <tr key={idx} className={row.isBreak ? 'break-row' : ''}>
                            <td>{row.timeRange}</td>
                            <td>{row.plan}</td>
                            <td>{row.cumulativePlan}</td>
                            <td>
                                {!row.isBreak && (
                                    <input
                                        title="Факт, шт" 
                                        type="number" 
                                        value={row.fact || ''} 
                                        onChange={(e) => handleFactChange(idx, Number(e.target.value))} 
                                    />
                                )}
                            </td>
                            <td>{row.cumulativeFact}</td>
                            <td className={row.deviation > 0 ? 'text-danger' : ''}>{row.deviation}</td>
                            <td>{row.cumulativeDeviation}</td>
                            <td><input title="Простой, мин" type="number" value={row.downtimeMin || ''} onChange={(e) => handleInputChange(idx, 'downtimeMin', Number(e.target.value))} /></td>
                            <td><input title="Ответственный" type="text" value={row.responsible} onChange={(e) => handleInputChange(idx, 'responsible', e.target.value)} /></td>
                            <td><input title="Комментарий" type="text" value={row.reasonComment} placeholder="Комментарий" onChange={(e) => handleInputChange(idx, 'reasonComment', e.target.value)} /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PowerAnalysisTable;