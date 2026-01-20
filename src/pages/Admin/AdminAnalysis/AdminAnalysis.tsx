import AdminHeader from '../../../components/Headers/AdminHeader';
import './AdminAnalysis.css';

const AdminAnalysis = () => {
    return(
        <>
            <AdminHeader />
            <main className="admin-analysis-page">
                <h1>Аналитика</h1>
                <p>Здесь будет отображаться аналитика по продуктам и сотрудникам.</p>
            </main>
        </>
    );
}

export default AdminAnalysis;