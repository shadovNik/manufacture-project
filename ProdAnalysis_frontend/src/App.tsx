import './App.css'

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute.tsx';

import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized.tsx';

import Registration from './pages/Registration/Registration.tsx';
import Login from './pages/Login/Login.tsx';

function App() {
  return (
    <>
      <BrowserRouter basename='/'>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<NotFound />} />
          
          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route path='/registration' element={<Registration />} />
          <Route path='/login' element={<Login />} />
          {/* <Route path="/reader-profile" element={
            <ProtectedRoute allowedRoles={['Reader']}>
              <ReaderProfile />
            </ProtectedRoute>
          } /> */}
        </Routes>
      </BrowserRouter>
    </>
  )
}



export default App
