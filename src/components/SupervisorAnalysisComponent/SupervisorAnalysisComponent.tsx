// SupervisorAnalysisComponent.tsx
import React, { type ReactNode } from 'react';
import './SupervisorAnalysisComponent.css';

interface BaseAnalysisProps {
    title: string;
    analysisType: string;
    onGenerate: () => void;
    
    // Общие поля (можно управлять ими извне)
    commonState: {
        shift: string;
        setShift: (val: string) => void;
        division: string;
        setDivision: (val: string) => void;
        executor: string;
        setExecutor: (val: string) => void;
        date: string;
        setDate: (val: string) => void;
        startTime: string;
        setStartTime: (val: string) => void;
        endTime: string;
        setEndTime: (val: string) => void;
    };

    // Слоты для дополнительных полей
    additionalMainInfo?: ReactNode;
    additionalCalcParams?: ReactNode;
    additionalBlocks?: ReactNode;
}

const SupervisorAnalysisComponent: React.FC<BaseAnalysisProps> = ({
    title,
    analysisType,
    onGenerate,
    commonState,
    additionalMainInfo,
    additionalCalcParams,
    additionalBlocks
}) => {
    return (
        <main className="supervisor-analysis-component-main">
            <div className="supervisor-analysis-component-header">
                <p className='supervisor-analysis-component-header--title'>{title}</p>
                <p className='supervisor-analysis-component-header--subtitle'>{analysisType}</p>
            </div>

            {/* Блок основной информации */}
            <div className="supervisor-analysis-component-main-info">
                <p className="supervisor-analysis-component-main-info--header">Основная информация</p>
                <div className="blueLine"></div>
                <div className="supervisor-analysis-component-main-info--info-block">
                    {/* Общие поля для всех 5 типов */}
                    <div className="info-item">
                        <p className="info-item--label">Смена:</p>
                        <select title="Смена" className="info-item--value select" value={commonState.shift} onChange={(e) => commonState.setShift(e.target.value)}>
                            <option>Дневная</option>
                            <option>Вечерняя</option>
                        </select>
                    </div>
                    <div className="info-item">
                        <p className="info-item--label">Подразделение:</p>
                        <select title="Подразделение" className="info-item--value select" value={commonState.division} onChange={(e) => commonState.setDivision(e.target.value)}>
                            <option>Цех 1</option>
                            <option>Цех 2</option>
                        </select>
                    </div>
                    <div className="info-item">
                        <p className="info-item--label">Исполнитель:</p>
                        <select title="Исполнитель" className="info-item--value select" value={commonState.executor} onChange={(e) => commonState.setExecutor(e.target.value)}>
                            <option>Иванов И.И.</option>
                            <option>Петров П.П.</option>
                        </select>
                    </div>
                    <div className="info-item">
                        <p className="info-item--label">Дата:</p>
                        <input title="Дата" type="date" className="info-item--value input" value={commonState.date} onChange={(e) => commonState.setDate(e.target.value)} />
                    </div>

                    {/* Сюда вставятся уникальные поля конкретного анализа */}
                    {additionalMainInfo}
                </div>
            </div>

            {/* Блок параметров расчета */}
            <div className="supervisor-analysis-component-calculations-params">
                <p className="supervisor-analysis-component-calculations-params--header">Параметры расчёта</p>
                <div className="blueLine"></div>
                <div className="supervisor-analysis-component-calculations-params--params-block">
                    <div className="param-item">
                        <p className="param-item--label">Начало смены:</p>
                        <input title="Начало смены" type="time" className="param-item--value input" value={commonState.startTime} onChange={(e) => commonState.setStartTime(e.target.value)} />
                    </div>
                    <div className="param-item">
                        <p className="param-item--label">Конец смены:</p>
                        <input title="Конец смены" type="time" className="param-item--value input" value={commonState.endTime} onChange={(e) => commonState.setEndTime(e.target.value)} />
                    </div>

                    {/* Сюда вставятся уникальные параметры расчета (если они есть) */}
                    {additionalCalcParams}
                </div>
            </div>

            {additionalBlocks}

            <button className="supervisor-analysis-component-generate-table-button" onClick={onGenerate}>
                Создать таблицу
            </button>
        </main>
    );
};

export default SupervisorAnalysisComponent;