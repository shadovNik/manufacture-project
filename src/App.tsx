import './App.css'

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute.tsx';
import RootRedirect from './utils/RootRedirect.tsx';

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
import OperatorReportDetails from './pages/Operator/OperatorReportDetails/OperatorReportDetails.tsx';
import SupervisorCheckDetails from './pages/Supervisor/SupervisorCheckDetails/SupervisorCheckDetails.tsx';
import ProductReference from './pages/Admin/AdminReferencebook/References/ProductReference/ProductReference.tsx';
import DepartmentReference from './pages/Admin/AdminReferencebook/References/DepartmentReference/DepartmentReference.tsx';
import ReasonGroupsReference from './pages/Admin/AdminReferencebook/References/ReasonGroupsReference/ReasonGroupsReference.tsx';

function App() {
  return (
    <>
      <BrowserRouter basename='/'>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="*" element={<NotFound />} />
          
          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route path='/login' element={<Login />} />

          <Route path="/operator-workpage" element={
            <ProtectedRoute allowedRoles={['Operator']}>
              <OperatorWorkpage />
            </ProtectedRoute>
          } />
          <Route path="/operator-report" element={
            <ProtectedRoute allowedRoles={['Operator']}>
              <OperatorReport />
            </ProtectedRoute>
          } />
          <Route path="/operator-report/:id" element={
            <ProtectedRoute allowedRoles={['Operator']}>
              <OperatorReportDetails />
            </ProtectedRoute>
          } />

          <Route path="/admin-analysis" element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <AdminAnalysis />
            </ProtectedRoute>
          } />
          <Route path="/admin-employees" element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <AdminEmployees />
            </ProtectedRoute>
          } />
          <Route path="/admin-referencebook" element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <AdminReferencebook />
            </ProtectedRoute>
          }>
            <Route path="products" element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <ProductReference />
              </ProtectedRoute>
            } />
            <Route path="departments" element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <DepartmentReference />
              </ProtectedRoute>
            } />
            <Route path="reason-groups" element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <ReasonGroupsReference />
              </ProtectedRoute>
            } />
          </Route>
          <Route path="/admin-workpage" element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <AdminWorkpage />
            </ProtectedRoute>
          } />

          <Route path="/supervisor-check" element={
            <ProtectedRoute allowedRoles={['Supervisor']}>
              <SupervisorCheck />
            </ProtectedRoute>
          } />
          <Route path="/supervisor-reportadd/tact-duration" element={
            <ProtectedRoute allowedRoles={['Supervisor']}>
              <SupervisorReportTactDuration />
            </ProtectedRoute>
          } />
          <Route path="/supervisor-reportadd/power" element={
            <ProtectedRoute allowedRoles={['Supervisor']}>
              <SupervisorReportPower />
            </ProtectedRoute>
          } />
          <Route path="/supervisor-reportadd/nomenclatures" element={
            <ProtectedRoute allowedRoles={['Supervisor']}>
              <SupervisorReportNomenclatures />
            </ProtectedRoute>
          } />
          <Route path="/supervisor-reportadd/less-than-one-item" element={
            <ProtectedRoute allowedRoles={['Supervisor']}>
              <SupervisorReportLessItem />
            </ProtectedRoute>
          } />
          <Route path="/supervisor-reportadd/less-than-one-unit" element={
            <ProtectedRoute allowedRoles={['Supervisor']}>
              <SupervisorReportLessUnit />
            </ProtectedRoute>
          } />
          <Route path="/supervisor-workpage" element={
            <ProtectedRoute allowedRoles={['Supervisor']}>
              <SupervisorWorkpage />
            </ProtectedRoute>
          } />
          <Route path="/supervisor-check/:id" element={
            <ProtectedRoute allowedRoles={['Supervisor']}>
              <SupervisorCheckDetails />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </>
  )
}



export default App
