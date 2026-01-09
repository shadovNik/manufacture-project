import DeviationsTable from "../../../components/DeviationsTable/DeviationsTable";
import OperatorHeader from "../../../components/Headers/OperatorHeader";
import './OperatorWorkpage.css';

const OperatorWorkpage = () => {
    return(
        <>
            <OperatorHeader />
            <main className="operator-workpage-main">
                <div className="operator-workpage-info">
                    <div className="operator-workpage-info-element">
                        <p className="operator-workpage-info-element--title">Текущая смена</p>
                        <p className="operator-workpage-info-element--value">Смена №1 | Цех №1</p>
                        <p className="operator-workpage-info-element--subtitle">08:00 - 20:00</p>
                    </div>
                    <div className="operator-workpage-info-element">
                        <p className="operator-workpage-info-element--title">Выполнение плана</p>
                        <p className="operator-workpage-info-element--value">План: XXX ед.</p>
                        <p className="operator-workpage-info-element--subtitle">Факт: XXX ед.</p>
                    </div>
                    <div className="operator-workpage-info-element">
                        <p className="operator-workpage-info-element--title">Отклонение от плана</p>
                        <p className="operator-workpage-info-element--value">Отклонений: X</p>
                        <p className="operator-workpage-info-element--subtitle">Время отклонений: X мин.</p>
                    </div>
                    <div className="operator-workpage-info-element">
                        <p className="operator-workpage-info-element--title">Темп производства</p>
                        <p className="operator-workpage-info-element--value">План: XX ед./ч.</p>
                        <p className="operator-workpage-info-element--subtitle">Факт: XX ед./ч.</p>
                    </div>
                </div>
                <DeviationsTable />
            </main>
        </>
    );
}

export default OperatorWorkpage;