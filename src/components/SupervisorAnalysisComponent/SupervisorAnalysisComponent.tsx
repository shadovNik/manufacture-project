import './SupervisorAnalysisComponent.css';

import { useState, useMemo } from 'react';
import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';

interface ISupervisorAnalysisComponentProps {
    analysisComponent: {
        analysisType: string;
        mainInfo: {
            shift: string,
            division: string,
            executor: string,
            date: string,
            product: string | null,
        };
        calculationsParams: {
            startTime: string,
            endTime: string,
        }
    }
}

type ProductionRow = {
    time: string;
    plan: number | '';
    planAccum: number | '';
    fact: number | '';
    factAccum: number | '';
    deviation: number | '';
    deviationAccum: number | '';
    downtimeMin: number | '';
    responsible: string;
    reasonGroup: string;
    reasonComment: string;
    measures: string;

    // Для редактирования
    id: string; // уникальный id строки
};

const SupervisorAnalysisComponent = ({ analysisComponent } : ISupervisorAnalysisComponentProps) => {
    // Состояния формы
    const [shift, setShift] = useState('Дневная');
    const [division, setDivision] = useState('Цех 1');
    const [executor, setExecutor] = useState('Иванов И.И.');
    const [date, setDate] = useState('');
    const [product, setProduct] = useState('');
    const [tactTimeSec, setTactTimeSec] = useState<number | ''>('');
    const [dailyRate, setDailyRate] = useState<number | ''>('');

    const [data, setData] = useState<ProductionRow[]>([]);

    const [startTime, setStartTime] = useState('08:00');
    const [endTime, setEndTime] = useState('17:00');


    // Состояние сгенерированной таблицы
    const [tableData, setTableData] = useState<ProductionRow[]>([]);
    
    const updateCell = (rowIndex: number, columnId: string, value: any) => {
        setData(old =>
            old.map((row, index) =>
            index === rowIndex
                ? { ...row, [columnId]: value }
                : row
            )
        );
        console.log(data);
    };

    // Генерация расписания и начальных данных таблицы
    const generateTable = () => {
        if (!dailyRate || !startTime || !endTime) {
        alert('Заполните обязательные поля: суточный темп, время начала и окончания смены');
        return;
        }

        const start = parseTime(startTime);
        const end = parseTime(endTime);
        let totalWorkingHours = (end - start) / 60; // в часах

        // Учитываем, что могут быть перерывы/обед — здесь упрощённо
        // В реальности лучше иметь массив интервалов с флагом "рабочий/нерабочий"
        const workingIntervals = generateWorkingIntervals(startTime, endTime);

        const rows: ProductionRow[] = [];

        let planAccum = 0;
        let factAccum = 0;
        let deviationAccum = 0;

        let hourlyPlan = Math.round(Number(dailyRate) / totalWorkingHours);

        workingIntervals.forEach(interval => {
        const isWorking = !interval.includes('Обед') && !interval.includes('Перерыв') && !interval.includes('Уборка');

        const row: ProductionRow = {
            time: interval,
            plan: isWorking ? hourlyPlan : '',
            planAccum: isWorking ? (planAccum += hourlyPlan) : planAccum,
            fact: '',
            factAccum: '',
            deviation: '',
            deviationAccum: '',
            downtimeMin: '',
            responsible: '',
            reasonGroup: '',
            reasonComment: '',
            measures: '',
            id: ''
        };

        rows.push(row);
        });

        // Добавляем строку ИТОГО
        rows.push({
            time: 'ИТОГО',
            plan: planAccum,
            planAccum: planAccum,
            fact: '',
            factAccum: factAccum,
            deviation: '',
            deviationAccum: deviationAccum,
            downtimeMin: '',
            responsible: '',
            reasonGroup: '',
            reasonComment: '',
            measures: '',
            id: ''
        });

        setTableData(rows);
        updateCell(1, "1", 0);
    };

    // Вспомогательная функция парсинга времени (HH:MM → минуты с начала суток)
    const parseTime = (timeStr: string): number => {
        const [h, m] = timeStr.split(':').map(Number);
        return h * 60 + m;
    };

    const formatTime = (minutes: number): string => {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    };

    // Генерация интервалов (можно сделать более точной)
    const generateWorkingIntervals = (startTime: string, endTime: string): string[] => {
    const intervals: string[] = [];
    
    let current = parseTime(startTime);
    const end = parseTime(endTime);

    while (current < end) {
        // Определяем, начинается ли сейчас час перерыва/обеда
        const currentHour = Math.floor(current / 60);
        const currentMinute = current % 60;

        let intervalDuration = 60; // по умолчанию 1 час

        // Обед ~12:00–12:30 (можно настроить точное время)
        if (currentHour === 12 && currentMinute === 0) {
        intervals.push("Обед 30 мин");
        current += 30;
        continue;
        }

        // Перерывы в 9:00 и 15:00 по 15 мин
        if ((currentHour === 9 || currentHour === 15) && currentMinute === 0) {
        // Сначала добавляем рабочий час до перерыва
        const beforeBreakEnd = current + 60;
        intervals.push(`${formatTime(current)} - ${formatTime(beforeBreakEnd)}`);
        
        // Затем перерыв
        intervals.push("Перерыв 15 мин");
        
        // Продолжаем после перерыва
        current = beforeBreakEnd + 15;
        continue;
        }

        // Обычный рабочий интервал
        const next = Math.min(current + intervalDuration, end);
        intervals.push(`${formatTime(current)} - ${formatTime(next)}`);
        current = next;
    }

    // Финальная уборка (всегда в конце, даже если смена закончилась раньше)
    intervals.push("Уборка 15 мин");

    return intervals;
    };

    // Колонки с сокращениями
    const columns = useMemo<ColumnDef<ProductionRow>[]>(
        () => [
        { accessorKey: 'time',          header: 'Время',               size: 130 },
        { accessorKey: 'plan',          header: 'План',                size: 70  },
        { accessorKey: 'planAccum',     header: 'План ∑',              size: 90  },
        { accessorKey: 'fact',          header: 'Факт',                size: 70  },
        { accessorKey: 'factAccum',     header: 'Факт ∑',              size: 90  },
        { accessorKey: 'deviation',     header: 'Откл.',               size: 80  },
        { accessorKey: 'deviationAccum',header: 'Откл. ∑',             size: 100 },
        { accessorKey: 'downtimeMin',   header: 'Простой',             size: 80  },
        { accessorKey: 'responsible',   header: 'Отв.',                size: 100 },
        { accessorKey: 'reasonGroup',   header: 'Группа причин',       size: 130 },
        { accessorKey: 'reasonComment', header: 'Причина / коммент',   size: 180 },
        { accessorKey: 'measures',      header: 'Меры',                size: 160 },
        ],
        []
    );

    const table = useReactTable({
        data: tableData,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return(
        <main className="supervisor-analysis-component-main">
            <div className="supervisor-analysis-component-header">
                <p className='supervisor-analysis-component-header--title'>Производственный анализ</p>
                <p className='supervisor-analysis-component-header--subtitle'>{analysisComponent.analysisType}</p>
            </div>
            <div className="supervisor-analysis-component-main-info">
                <p className="supervisor-analysis-component-main-info--header">Основная информация</p>
                <div className="blueLine"></div>
                <div className="supervisor-analysis-component-main-info--info-block">
                    <div className="supervisor-analysis-component-main-info--info-item">
                        <p className="info-item--label">Смена:</p>
                        <select 
                            value={shift}
                            className="info-item--value select" 
                            title='Смена'
                            onChange={(e) => setShift(e.target.value)}
                        >
                            <option>Дневная</option>
                            <option>Вечерняя</option>
                        </select>
                    </div>
                    <div className="supervisor-analysis-component-main-info--info-item">
                        <p className="info-item--label">Подразделение:</p>
                        <select 
                            value={division}
                            className="info-item--value select" 
                            title='Подразделение'
                            onChange={(e) => setDivision(e.target.value)}
                        >
                            <option>Цех 1</option>
                            <option>Цех 2</option>
                        </select>
                    </div>
                    <div className="supervisor-analysis-component-main-info--info-item">
                        <p className="info-item--label">Исполнитель:</p>
                        <select 
                            value={executor}
                            onChange={(e) => setExecutor(e.target.value)}
                            className="info-item--value select" 
                            title='Исполнитель'>
                            <option>Иванов И.И.</option>
                            <option>Петров П.П.</option>
                        </select>
                    </div>
                    <div className="supervisor-analysis-component-main-info--info-item">
                        <p className="info-item--label">Дата:</p>
                        <input 
                            type="date" 
                            className="info-item--value input" 
                            title='Дата'
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        >
                        </input>
                    </div>
                    <div className="supervisor-analysis-component-main-info--info-item">
                        <p className="info-item--label">Продукт:</p>
                        <select 
                            className="info-item--value select" 
                            title='Продукт'
                            value={product}
                            onChange={(e) => setProduct(e.target.value)}
                        >
                            <option>Продукт А</option>
                            <option>Продукт Б</option>
                        </select>
                    </div>
                    <div className="supervisor-analysis-component-main-info--info-item">
                        <p className="info-item--label">Время такта, сек:</p>
                        <input 
                            type="number" 
                            className="info-item--value input" 
                            title='Время такта'
                            value={tactTimeSec}
                            onChange={(e) => setTactTimeSec(e.target.value ? Number(e.target.value) : '')}
                        ></input>
                    </div>
                    <div className="supervisor-analysis-component-main-info--info-item">
                        <p className="info-item--label">Суточный темп, шт:</p>
                        <input 
                            type="number" 
                            className="info-item--value input" 
                            title='Суточный темп'
                            value={dailyRate}
                            onChange={(e) => setDailyRate(e.target.value ? Number(e.target.value) : '')}
                        ></input>
                    </div>
                </div>
            </div>
            <div className="supervisor-analysis-component-calculations-params">
                <p className="supervisor-analysis-component-calculations-params--header">Параметры расчёта</p>
                <div className="blueLine"></div>
                <div className="supervisor-analysis-component-calculations-params--params-block">
                    <div className="supervisor-analysis-component-calculations-params--param-item">
                        <p className="param-item--label">Начало смены:</p>
                        <input 
                            type="time" 
                            className="param-item--value input" 
                            title='Начало смены'
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                        ></input>
                    </div>
                    <div className="supervisor-analysis-component-calculations-params--param-item">
                        <p className="param-item--label">Конец смены:</p>
                        <input 
                            type="time" 
                            className="param-item--value input" 
                            title='Конец смены'
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                        ></input>
                    </div>
                </div>
            </div>
            <button className="supervisor-analysis-component-generate-table-button" onClick={generateTable}>Создать таблицу</button>
            {tableData.length > 0 && (
                <div className="generated-table-container">
                <table className="production-table">
                    <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                            <th key={header.id} style={{ width: header.column.getSize() }}>
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            </th>
                        ))}
                        </tr>
                    ))}
                    </thead>
                    <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                            <td key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                        ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
      )}
        </main>
    );
}

export default SupervisorAnalysisComponent;