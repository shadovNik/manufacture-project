import React, { type ReactNode, useEffect } from 'react';
import './SupervisorAnalysisComponent.css';
// @ts-ignore
import axiosInstance from "../../utils/axiosInstance";

interface DictionaryItem {
    id: number | string;
    name: string;
}

interface BaseAnalysisProps {
    title: string;
    analysisType: string;
    onGenerate: () => void;
    divisions: DictionaryItem[];
    executors: DictionaryItem[];
    isGenerateDisabled?: boolean;

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

    additionalMainInfo?: ReactNode;
    additionalBlocks?: ReactNode;
}

const SupervisorAnalysisComponent: React.FC<BaseAnalysisProps> = ({
    title,
    analysisType,
    onGenerate,
    commonState,
    divisions,
    executors,
    isGenerateDisabled,
    additionalMainInfo,
    additionalBlocks
}) => {

    useEffect(() => {
        const fetchActiveShift = async () => {
            try {
                const res = await axiosInstance.get('/shifts');
                
                if (res.data) {
                    const activeShift = res.data;
                    if (activeShift.shiftType) commonState.setShift(activeShift.shiftType);
                    if (activeShift.departmentId) commonState.setDivision(String(activeShift.departmentId));
                    if (activeShift.operatorId) commonState.setExecutor(String(activeShift.operatorId));
                    
                    if (activeShift.startTime) {
                        const dateObj = new Date(activeShift.startTime);
                        const formattedTime = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        commonState.setStartTime(formattedTime);

                        const formattedDate = dateObj.toISOString().split('T')[0];
                        commonState.setDate(formattedDate);
                    }
                }
            } catch (error) {
                console.error("Ошибка при получении данных смены в компоненте:", error);
            }
        };

        fetchActiveShift();
    }, []);

    return (
        <main className="supervisor-analysis-component-main">
            <div className="supervisor-analysis-component-header">
                <p className='supervisor-analysis-component-header--title'>{title}</p>
                <p className='supervisor-analysis-component-header--subtitle'>{analysisType}</p>
            </div>

            <div className="supervisor-analysis-component-main-info">
                <p className="supervisor-analysis-component-main-info--header">Основная информация</p>
                <div className="blueLine"></div>
                <div className="supervisor-analysis-component-main-info--info-block">
                    
                    <div className="info-item">
                        <p className="info-item--label">Смена:</p>
                        <select 
                            title="Смена" 
                            className="info-item--value select" 
                            value={commonState.shift} 
                            disabled 
                        >
                            <option value="Дневная">Дневная</option>
                            <option value="Вечерняя">Вечерняя</option>
                        </select>
                    </div>

                    <div className="info-item">
                        <p className="info-item--label">Подразделение:</p>
                        <select 
                            title="Подразделение" 
                            className="info-item--value select" 
                            value={commonState.division} 
                            disabled 
                        >
                            <option value="">Выберите подразделение...</option>
                            {divisions.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="info-item">
                        <p className="info-item--label">Исполнитель:</p>
                        <select 
                            title="Исполнитель" 
                            className="info-item--value select" 
                            value={commonState.executor} 
                            disabled 
                        >
                            <option value="">Выберите исполнителя...</option>
                            {executors.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="info-item">
                        <p className="info-item--label">Дата:</p>
                        <input 
                            title="Дата" 
                            type="date" 
                            className="info-item--value input" 
                            value={commonState.date} 
                            disabled 
                        />
                    </div>

                    {additionalMainInfo}
                </div>
            </div>

            {additionalBlocks}

            <button 
                className={`supervisor-analysis-component-generate-table-button`} 
                onClick={onGenerate}
                disabled={isGenerateDisabled}
            >
                {isGenerateDisabled ? 'Анализ уже создан' : 'Создать таблицу'}
            </button>
        </main>
    );
};

export default SupervisorAnalysisComponent;