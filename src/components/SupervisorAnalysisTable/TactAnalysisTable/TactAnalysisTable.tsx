// TactAnalysisTable.tsx
import React from 'react';
import './TactAnalysisTable.css';

export interface TableRowData {
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

interface Props {
    data: TableRowData[];
    setData: React.Dispatch<React.SetStateAction<TableRowData[]>>;
    headerInfo: any;
}

const TactAnalysisTable: React.FC<Props> = ({ data, setData, headerInfo }) => {

    const handleFactChange = (index: number, value: number) => {
        const newData = [...data];
        newData[index].fact = value;

        // Пересчет всей таблицы от места изменения до конца
        let runningFact = 0;
        let runningDeviation = 0;

        newData.forEach((row) => {
            runningFact += row.fact;
            row.cumulativeFact = runningFact;
            
            row.deviation = row.plan - row.fact; //
            runningDeviation += row.deviation;
            row.cumulativeDeviation = runningDeviation;
        });

        setData(newData);
    };

    const handleInputChange = (index: number, field: keyof TableRowData, value: any) => {
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
                <p>Время такта: <strong>{headerInfo.tactTimeSec} сек.</strong></p>
                <p>Суточный темп: <strong>{headerInfo.dailyRate} шт.</strong></p>
            </div>
            <table className="analysis-table">
                <thead>
                    <tr>
                        <th rowSpan={3}>Время работы, час</th>
                        <th>План, шт.</th>
                        <th>План накоп., шт</th>
                        <th>Факт, шт.</th>
                        <th>Факт накоп., шт</th>
                        <th>Отклонение, шт.</th>
                        <th>Отклонение накоп.</th>
                        <th>Простой, мин</th>
                        <th>Ответственный</th>
                        <th>Группы причин</th>
                        <th colSpan={2}>Причины и меры</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, idx) => (
                        <tr key={idx} className={row.isBreak ? 'break-row' : ''}>
                            <td>{row.timeRange}</td>
                            <td>{row.plan}</td>
                            <td>{row.cumulativePlan}</td>
                            <td>
                                {!row.isBreak && <input title='Факт' type="number" value={row.fact} onChange={(e) => handleFactChange(idx, Number(e.target.value))} />}
                            </td>
                            <td>{row.cumulativeFact}</td>
                            <td>{row.deviation}</td>
                            <td>{row.cumulativeDeviation}</td>
                            <td><input title='Простой' type="number" value={row.downtimeMin} onChange={(e) => handleInputChange(idx, 'downtimeMin', Number(e.target.value))} /></td>
                            <td><input title='Описание причины' type="text" value={row.responsible} onChange={(e) => handleInputChange(idx, 'responsible', e.target.value)} /></td>
                            <td>
                                <select title='Группы причин' value={row.reasonGroup} onChange={(e) => handleInputChange(idx, 'reasonGroup', e.target.value)}>
                                    <option value="">Выбор...</option>
                                    <option value="Орг.">Орг.</option>
                                    <option value="Тех.">Тех.</option>
                                    <option value="Лог.">Лог.</option>
                                    <option value="Рег.">Рег.</option>
                                    <option value="Кач.">Кач.</option>
                                    <option value="Восп.">Восп.</option>
                                </select>
                            </td>
                            <td><input type="text" placeholder="Причина" value={row.reasonComment} onChange={(e) => handleInputChange(idx, 'reasonComment', e.target.value)} /></td>
                            <td><input type="text" placeholder="Меры" value={row.measures} onChange={(e) => handleInputChange(idx, 'measures', e.target.value)} /></td>
                        </tr>
                    ))}
                    <tr className="total-row">
                        <td>ИТОГО</td>
                        <td>{data.reduce((acc, r) => acc + r.plan, 0)}</td>
                        <td>-</td>
                        <td>{data.reduce((acc, r) => acc + r.fact, 0)}</td>
                        <td>-</td>
                        <td>{data.reduce((acc, r) => acc + r.deviation, 0)}</td>
                        <td colSpan={5}></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default TactAnalysisTable;