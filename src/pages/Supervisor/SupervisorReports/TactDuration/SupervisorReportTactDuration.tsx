import SupervisorHeader from '../../../../components/Headers/SupervisorHeader';
import SupervisorAnalysisComponent from '../../../../components/SupervisorAnalysisComponent/SupervisorAnalysisComponent';
import './SupervisorReportTactDuration.css';

const SupervisorReportTactDuration = () => {
    return(
        <>
            <SupervisorHeader />
            <SupervisorAnalysisComponent analysisComponent={{
                analysisType: 'Почасовой по времени такта',
                mainInfo: {
                    shift: 'Дневная',
                    division: 'Цех 1',
                    executor: 'Иванов И.И.',
                    date: '2024-06-15',
                    product: 'Продукт А',
                },
                calculationsParams: {
                    startTime: '08:00',
                    endTime: '16:00',
                }
            }} />
        </>
    );
}

export default SupervisorReportTactDuration;