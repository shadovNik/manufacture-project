import './SupervisorWorkpage.css';

import DeviationsTable from '../../../components/DeviationsTable/DeviationsTable';
import SupervisorHeader from '../../../components/Headers/SupervisorHeader';
import CreateWorkShiftModal from '../../../components/CreateWorkShiftModal/CreateWorkShiftModal';
import { useState } from 'react';

const SupervisorWorkpage = () => {
    const [isWorkShiftExist, setIsWorkShiftExist] = useState<boolean>(false);
    const [isWorkShiftModalOpen, setIsWorkShiftModalOpen] = useState<boolean>(false);

    const handleCreateWorkShift = () => {
        setIsWorkShiftModalOpen((prev) => !prev);
    }

    const closeWorkShiftModal = () => {
        setIsWorkShiftModalOpen(false);
        setIsWorkShiftExist(false);
    }

    return(
        <>
            <SupervisorHeader />
            <main className="supervisor-workpage-main">
                {!isWorkShiftExist &&
                    <div className="supervisor-workpage-no-shift">
                        <p>Смена ещё не создана. Хотите создать?</p>
                        <button className="supervisor-workpage-no-shift-button" onClick={handleCreateWorkShift}>Создать смену</button>
                    </div>
                }
                {isWorkShiftModalOpen && <CreateWorkShiftModal closeWorkShiftModal={closeWorkShiftModal} />}

                <div className="supervisor-workpage-info">
                    <div className="supervisor-workpage-info-element">
                        <p className="supervisor-workpage-info-element--title">Текущая смена</p>
                        <p className="supervisor-workpage-info-element--value">Смена №1 | Цех №1</p>
                        <p className="supervisor-workpage-info-element--subtitle">08:00 - 20:00</p>
                    </div>
                    <div className="supervisor-workpage-info-element">
                        <p className="supervisor-workpage-info-element--title">Выполнение плана</p>
                        <p className="supervisor-workpage-info-element--value">План: XXX ед.</p>
                        <p className="supervisor-workpage-info-element--subtitle">Факт: XXX ед.</p>
                    </div>
                    <div className="supervisor-workpage-info-element">
                        <p className="supervisor-workpage-info-element--title">Отклонение от плана</p>
                        <p className="supervisor-workpage-info-element--value">Отклонений: X</p>
                        <p className="supervisor-workpage-info-element--subtitle">Время отклонений: X мин.</p>
                    </div>
                    <div className="supervisor-workpage-info-element">
                        <p className="supervisor-workpage-info-element--title">Темп производства</p>
                        <p className="supervisor-workpage-info-element--value">План: XX ед./ч.</p>
                        <p className="supervisor-workpage-info-element--subtitle">Факт: XX ед./ч.</p>
                    </div>
                </div>
                <DeviationsTable />
            </main>
        </>
    );
}

export default SupervisorWorkpage;