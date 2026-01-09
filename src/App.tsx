import './App.css'

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// import ProtectedRoute from './components/ProtectedRoute.tsx';

import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized.tsx';

import Login from './pages/Login/Login.tsx';

import OperatorWorkpage from './pages/Operator/OperatorWorkpage/OperatorWorkpage.tsx';
import OperatorReport from './pages/Operator/OperatorReport/OperatorReport.tsx';

import SupervisorCheck from './pages/Supervisor/SupervisorCheck/SupervisorCheck.tsx';

import SupervisorWorkpage from './pages/Supervisor/SupervisorWorkpage/SupervisorWorkpage.tsx';

import AdminAnalysis from './pages/Admin/AdminAnalysis/AdminAnalysis.tsx';
import AdminEmployees from './pages/Admin/AdminEmployees/AdminEmployees.tsx';
import AdminReferencebook from './pages/Admin/AdminReferencebook/AdminReferencebook.tsx';
import AdminWorkpage from './pages/Admin/AdminWorkpage/AdminWorkpage.tsx';
import SupervisorReportTactDuration from './pages/Supervisor/SupervisorReports/TactDuration/SupervisorReportTactDuration.tsx';
import SupervisorReportPower from './pages/Supervisor/SupervisorReports/Power/SupervisorReportPower.tsx';
import SupervisorReportNomenclatures from './pages/Supervisor/SupervisorReports/Nomenclatures/SupervisorReportNomenclatures.tsx';
import SupervisorReportLessItem from './pages/Supervisor/SupervisorReports/LessThanOneItem/SupervisorReportLessItem.tsx';
import SupervisorReportLessUnit from './pages/Supervisor/SupervisorReports/LessThanOneUnit/SupervisorReportLessUnit.tsx';

function App() {
  return (
    <>
      <BrowserRouter basename='/'>
        <Routes>
          <Route path="/" element={<Navigate to="/supervisor-workpage" />} />
          <Route path="*" element={<NotFound />} />
          
          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route path='/login' element={<Login />} />
          
          <Route path='/operator-workpage' element={<OperatorWorkpage />} />
          <Route path='/operator-report' element={<OperatorReport />} />

          <Route path='/admin-analysis' element={<AdminAnalysis />} />
          <Route path='/admin-employees' element={<AdminEmployees />} />
          <Route path='/admin-referencebook' element={<AdminReferencebook />} />
          <Route path='/admin-workpage' element={<AdminWorkpage />} />

          <Route path='/supervisor-check' element={<SupervisorCheck />} />
          <Route path='/supervisor-reportadd/tact-duration' element={<SupervisorReportTactDuration />} />
          <Route path='/supervisor-reportadd/power' element={<SupervisorReportPower />} />
          <Route path='/supervisor-reportadd/nomenclatures' element={<SupervisorReportNomenclatures />} />
          <Route path='/supervisor-reportadd/less-than-one-item' element={<SupervisorReportLessItem />} />
          <Route path='/supervisor-reportadd/less-than-one-unit' element={<SupervisorReportLessUnit />} />
          {/* <Route path='/supervisor-reportadd/drafts' element={<SupervisorReportDrafts />} /> */}
          <Route path='/supervisor-workpage' element={<SupervisorWorkpage />} />
          {/* <Route path="PATH" element={
            <ProtectedRoute allowedRoles={['ROLE']}>
              <PAGE />
            </ProtectedRoute>
          } /> */}
        </Routes>
      </BrowserRouter>
    </>
  )
}



export default App
