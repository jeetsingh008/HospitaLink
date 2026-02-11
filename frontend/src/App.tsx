import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Layout from './layouts/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Patient Pages
import PatientDashboard from './pages/patient/Dashboard';
import MyAppointments from './pages/patient/MyAppointments';

// Doctor Pages
import DoctorDashboard from './pages/doctor/Dashboard';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AddDoctor from './pages/admin/AddDoctor';
import DoctorsList from './pages/admin/DoctorsList';
import AdminAppointments from './pages/admin/AdminAppointments';

function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/" element={<Layout />}>
                <Route index element={<Navigate to="/login" replace />} />

                {/* Patient Routes */}
                <Route
                    path="patient/dashboard"
                    element={
                        <ProtectedRoute allowedRoles={['patient']}>
                            <PatientDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="patient/appointments"
                    element={
                        <ProtectedRoute allowedRoles={['patient']}>
                            <MyAppointments />
                        </ProtectedRoute>
                    }
                />

                {/* Doctor Routes */}
                <Route
                    path="doctor/dashboard"
                    element={
                        <ProtectedRoute allowedRoles={['doctor']}>
                            <DoctorDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="doctor/appointments"
                    element={
                        <ProtectedRoute allowedRoles={['doctor']}>
                            <DoctorDashboard />
                            {/* Doctor Dashboard handles both slots and appointments for simplicity as per requirements */}
                        </ProtectedRoute>
                    }
                />

                {/* Admin Routes */}
                <Route
                    path="admin/dashboard"
                    element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="admin/doctors"
                    element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <DoctorsList />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="admin/add-doctor"
                    element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <AddDoctor />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="admin/appointments"
                    element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <AdminAppointments />
                        </ProtectedRoute>
                    }
                />
            </Route>

            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}

export default App;
