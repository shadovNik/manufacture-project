import { useEffect, useState } from 'react';
import SupervisorHeader from '../../../components/Headers/SupervisorHeader';
import './SupervisorCheck.css';
import { useNavigate } from 'react-router-dom';
// @ts-ignore
import axiosInstance from "../../../utils/axiosInstance";

interface ReportItem {
    productionAnalysisId: number;
    userId: number;
    scenario: string;
    status: string;
}

const SupervisorCheck = () => {
    const [reports, setReports] = useState<ReportItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchReports = async () => {
            try {
                setIsLoading(true);
                const { data } = await axiosInstance.get<ReportItem[]>("/PowerPerHourTable/supervisorPA");

                console.log("Все отчеты:", data);
                
                const filteredReports = data.filter((report: { status: string; }) => report.status === "На проверке");
                
                setReports(filteredReports);
            } catch (error) {
                console.error("Ошибка при загрузке отчетов:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchReports();
    }, []);

    const handleCardClick = (id: number) => {
        navigate(`/supervisor-check/${id}`);
    };

    return (
        <>
            <SupervisorHeader />
            <main className="supervisor-reports-container">
                <div className="supervisor-reports-header">
                    <h1>Доступные производственные анализы</h1>
                    <p>Выберите сценарий для заполнения данных</p>
                </div>

                {isLoading ? (
                    <div className="loading-spinner">Загрузка бланков...</div>
                ) : (
                    <div className="reports-grid">
                        {reports.length > 0 ? (
                            reports.map((report) => (
                                <div 
                                    key={report.productionAnalysisId} 
                                    className="report-card"
                                    onClick={() => handleCardClick(report.productionAnalysisId)}
                                >
                                    <div className="report-card-icon">
                                        <i className="analysis-icon">📊</i>
                                    </div>
                                    <div className="report-card-content">
                                        <h3>{report.scenario}</h3>
                                        <span className="report-card-id">ID: {report.productionAnalysisId} {report.status}</span>
                                    </div>
                                    <div className="report-card-arrow">
                                        →
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-reports">
                                <p>На данный момент нет активных бланков для заполнения.</p>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </>
    );
}

export default SupervisorCheck;