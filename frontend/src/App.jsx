import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import PatientDashboard from "./pages/patient/PatientDashboard";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";

import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
    return (
        <BrowserRouter>

            <Routes>

                {/* Public Routes */}

                <Route
                    path="/"
                    element={<Login />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />


                {/* Patient Route */}

                <Route
                    path="/patient/dashboard"
                    element={
                        <ProtectedRoute allowedRole="PATIENT">
                            <PatientDashboard />
                        </ProtectedRoute>
                    }
                />


                {/* Doctor Route */}

                <Route
                    path="/doctor/dashboard"
                    element={
                        <ProtectedRoute allowedRole="DOCTOR">
                            <DoctorDashboard />
                        </ProtectedRoute>
                    }
                />


                {/* Admin Route */}

                <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedRoute allowedRole="ADMIN">
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;
