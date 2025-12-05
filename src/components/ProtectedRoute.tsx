// src/components/ProtectedRoute/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';

function isTokenExpired(token: any) {
    try {
        // разделяем JWT на три части, берём payload (вторую), делаем base64-decode
        const payload = JSON.parse(atob(token.split('.')[1]));
        // exp — время в секундах с начала эпохи
        return Date.now() >= payload.exp * 1000;
    } catch {
        // если не получилось распарсить — считаем токен просроченным/невалидным
        return true;
    }
}

function ProtectedRoute({ children, allowedRoles }: { children: ReactNode; allowedRoles: string[] }) {
    const token = localStorage.getItem('access_token');
    if (!token) {
        // нет токена — сразу на unauthorized
        return <Navigate to="/unauthorized" />;
    }

    if (isTokenExpired(token)) {
        // токен просрочен или невалиден — чистим всё и кидаем на логин
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_role');
        localStorage.removeItem('user_id');
        return <Navigate to="/login" />;
    }

    const userRole = localStorage.getItem('user_role');
    if (allowedRoles && (!userRole || !allowedRoles.includes(userRole))) {
        return <Navigate to="/unauthorized" />;
    }

    return children;
}

export default ProtectedRoute;
