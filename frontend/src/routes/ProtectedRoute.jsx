import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRole }) {

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // User is not logged in
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // User has wrong role
    if (allowedRole && role !== allowedRole) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;
