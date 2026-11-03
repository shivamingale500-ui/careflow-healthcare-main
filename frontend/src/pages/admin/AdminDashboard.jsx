import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "../../styles/admin-dashboard.css";

function AdminDashboard() {

    const navigate = useNavigate();

    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [statistics, setStatistics] = useState({});

    const [activeSection, setActiveSection] = useState("dashboard");
    const [departmentName, setDepartmentName] = useState("");

    const [loading, setLoading] = useState(true);
    const [addingDepartment, setAddingDepartment] = useState(false);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const adminName =
        localStorage.getItem("fullName") || "Administrator";

    const adminEmail =
        localStorage.getItem("email") || "admin@careflow.local";


    useEffect(() => {
        fetchAdminData();
    }, []);


    const fetchAdminData = async () => {

        try {

            setLoading(true);
            setError("");

            const [
                patientsResponse,
                doctorsResponse,
                departmentsResponse,
                appointmentsResponse,
                statisticsResponse
            ] = await Promise.all([
                api.get("/api/admin/patients"),
                api.get("/api/admin/doctors"),
                api.get("/api/admin/departments"),
                api.get("/api/admin/appointments"),
                api.get("/api/admin/appointments/statistics")
            ]);

            setPatients(patientsResponse.data);
            setDoctors(doctorsResponse.data);
            setDepartments(departmentsResponse.data);
            setAppointments(appointmentsResponse.data);
            setStatistics(statisticsResponse.data);

        } catch (err) {

            console.error("Admin data error:", err);

            setError(
                err.response?.data ||
                "Unable to load admin dashboard"
            );

        } finally {

            setLoading(false);

        }
    };


    const handleAddDepartment = async (e) => {

        e.preventDefault();

        if (!departmentName.trim()) {
            return;
        }

        try {

            setAddingDepartment(true);
            setError("");
            setMessage("");

            await api.post(
                "/api/admin/departments",
                {
                    name: departmentName
                }
            );

            setDepartmentName("");

            setMessage(
                "Department added successfully"
            );

            fetchAdminData();

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data ||
                "Unable to add department"
            );

        } finally {

            setAddingDepartment(false);

        }
    };


    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("email");
        localStorage.removeItem("fullName");

        navigate("/login");
    };


    const getStatusClass = (status) => {

        switch (status) {

            case "BOOKED":
                return "status-booked";

            case "CONFIRMED":
                return "status-confirmed";

            case "IN_PROGRESS":
                return "status-progress";

            case "COMPLETED":
                return "status-completed";

            case "CANCELLED":
                return "status-cancelled";

            default:
                return "";

        }
    };


    return (

        <div className="admin-layout">


            {/* SIDEBAR */}

            <aside className="admin-sidebar">

                <div className="brand">

                    <div className="brand-icon">
                        +
                    </div>

                    <div>
                        <h2>CareFlow</h2>
                        <span>Healthcare System</span>
                    </div>

                </div>


                <div className="sidebar-menu">

                    <p className="menu-title">
                        MAIN MENU
                    </p>


                    <button
                        className={
                            activeSection === "dashboard"
                                ? "menu-item active"
                                : "menu-item"
                        }
                        onClick={() =>
                            setActiveSection("dashboard")
                        }
                    >
                        <span>⌂</span>
                        Dashboard
                    </button>


                    <button
                        className={
                            activeSection === "patients"
                                ? "menu-item active"
                                : "menu-item"
                        }
                        onClick={() =>
                            setActiveSection("patients")
                        }
                    >
                        <span>♙</span>
                        Patients
                    </button>


                    <button
                        className={
                            activeSection === "doctors"
                                ? "menu-item active"
                                : "menu-item"
                        }
                        onClick={() =>
                            setActiveSection("doctors")
                        }
                    >
                        <span>⚕</span>
                        Doctors
                    </button>


                    <button
                        className={
                            activeSection === "departments"
                                ? "menu-item active"
                                : "menu-item"
                        }
                        onClick={() =>
                            setActiveSection("departments")
                        }
                    >
                        <span>▦</span>
                        Departments
                    </button>


                    <button
                        className={
                            activeSection === "appointments"
                                ? "menu-item active"
                                : "menu-item"
                        }
                        onClick={() =>
                            setActiveSection("appointments")
                        }
                    >
                        <span>▣</span>
                        Appointments
                    </button>


                    <button
                        className={
                            activeSection === "statistics"
                                ? "menu-item active"
                                : "menu-item"
                        }
                        onClick={() =>
                            setActiveSection("statistics")
                        }
                    >
                        <span>◈</span>
                        Statistics
                    </button>

                </div>


                <div className="sidebar-bottom">

                    <button
                        className="menu-item logout-button"
                        onClick={handleLogout}
                    >
                        <span>↪</span>
                        Logout
                    </button>

                </div>

            </aside>


            {/* MAIN AREA */}

            <main className="admin-main">


                {/* HEADER */}

                <header className="top-header">

                    <div>

                        <p className="breadcrumb">
                            Admin / {
                                activeSection === "dashboard"
                                    ? "Overview"
                                    : activeSection
                            }
                        </p>

                    </div>


                    <div className="admin-profile">

                        <div className="notification">
                            ♢
                        </div>

                        <div className="profile-avatar">
                            {adminName
                                .charAt(0)
                                .toUpperCase()}
                        </div>

                        <div className="profile-info">

                            <strong>
                                {adminName}
                            </strong>

                            <span>
                                Administrator
                            </span>

                        </div>

                    </div>

                </header>


                <div className="content-area">


                    {/* ALERTS */}

                    {message && (

                        <div className="success-message">
                            ✓ {message}
                        </div>

                    )}


                    {error && (

                        <div className="error-message">
                            ⚠ {error}
                        </div>

                    )}


                    {loading ? (

                        <div className="loading-container">

                            <div className="loader"></div>

                            <p>
                                Loading dashboard...
                            </p>

                        </div>

                    ) : (

                        <>


                            {/* DASHBOARD */}

                            {activeSection === "dashboard" && (

                                <>

                                    <div className="welcome-section">

                                        <div>

                                            <p className="small-heading">
                                                ADMIN DASHBOARD
                                            </p>

                                            <h1>
                                                Welcome back, {adminName} 👋
                                            </h1>

                                            <p>
                                                Here's what's happening
                                                in your healthcare system today.
                                            </p>

                                        </div>

                                        <div className="welcome-date">
                                            CareFlow Management
                                        </div>

                                    </div>


                                    {/* STAT CARDS */}

                                    <div className="stats-grid">


                                        <div className="stat-card">

                                            <div className="stat-icon patient-icon">
                                                ♙
                                            </div>

                                            <div>
                                                <span>
                                                    Total Patients
                                                </span>

                                                <h2>
                                                    {patients.length}
                                                </h2>

                                                <small>
                                                    Registered patients
                                                </small>
                                            </div>

                                        </div>


                                        <div className="stat-card">

                                            <div className="stat-icon doctor-icon">
                                                ⚕
                                            </div>

                                            <div>
                                                <span>
                                                    Total Doctors
                                                </span>

                                                <h2>
                                                    {doctors.length}
                                                </h2>

                                                <small>
                                                    Medical professionals
                                                </small>
                                            </div>

                                        </div>


                                        <div className="stat-card">

                                            <div className="stat-icon department-icon">
                                                ▦
                                            </div>

                                            <div>
                                                <span>
                                                    Departments
                                                </span>

                                                <h2>
                                                    {departments.length}
                                                </h2>

                                                <small>
                                                    Active departments
                                                </small>
                                            </div>

                                        </div>


                                        <div className="stat-card">

                                            <div className="stat-icon appointment-icon">
                                                ▣
                                            </div>

                                            <div>
                                                <span>
                                                    Appointments
                                                </span>

                                                <h2>
                                                    {appointments.length}
                                                </h2>

                                                <small>
                                                    Total appointments
                                                </small>
                                            </div>

                                        </div>

                                    </div>


                                    {/* LOWER DASHBOARD */}

                                    <div className="dashboard-grid">


                                        {/* RECENT APPOINTMENTS */}

                                        <div className="panel large-panel">

                                            <div className="panel-header">

                                                <div>

                                                    <h2>
                                                        Recent Appointments
                                                    </h2>

                                                    <p>
                                                        Latest patient appointments
                                                    </p>

                                                </div>

                                                <button
                                                    className="view-button"
                                                    onClick={() =>
                                                        setActiveSection(
                                                            "appointments"
                                                        )
                                                    }
                                                >
                                                    View All →
                                                </button>

                                            </div>


                                            <div className="table-container">

                                                <table>

                                                    <thead>

                                                        <tr>
                                                            <th>ID</th>
                                                            <th>Patient</th>
                                                            <th>Doctor</th>
                                                            <th>Date</th>
                                                            <th>Status</th>
                                                        </tr>

                                                    </thead>


                                                    <tbody>

                                                        {appointments
                                                            .slice(0, 5)
                                                            .map((appointment) => (

                                                                <tr
                                                                    key={
                                                                        appointment.id
                                                                    }
                                                                >

                                                                    <td>
                                                                        #
                                                                        {
                                                                            appointment.id
                                                                        }
                                                                    </td>

                                                                    <td>
                                                                        {
                                                                            appointment
                                                                                .patient
                                                                                ?.user
                                                                                ?.fullName ||
                                                                            "-"
                                                                        }
                                                                    </td>

                                                                    <td>
                                                                        {
                                                                            appointment
                                                                                .doctor
                                                                                ?.user
                                                                                ?.fullName ||
                                                                            "-"
                                                                        }
                                                                    </td>

                                                                    <td>
                                                                        {
                                                                            appointment
                                                                                .appointmentDate
                                                                        }
                                                                    </td>

                                                                    <td>

                                                                        <span
                                                                            className={`status-badge ${getStatusClass(
                                                                                appointment.status
                                                                            )}`}
                                                                        >
                                                                            {
                                                                                appointment.status
                                                                            }
                                                                        </span>

                                                                    </td>

                                                                </tr>

                                                            ))}


                                                        {appointments.length === 0 && (

                                                            <tr>

                                                                <td
                                                                    colSpan="5"
                                                                    className="empty-state"
                                                                >
                                                                    No appointments
                                                                    found
                                                                </td>

                                                            </tr>

                                                        )}

                                                    </tbody>

                                                </table>

                                            </div>

                                        </div>


                                        {/* QUICK SUMMARY */}

                                        <div className="panel summary-panel">

                                            <div className="panel-header">

                                                <div>

                                                    <h2>
                                                        Appointment Overview
                                                    </h2>

                                                    <p>
                                                        Current status
                                                    </p>

                                                </div>

                                            </div>


                                            <div className="overview-list">

                                                <div className="overview-item">

                                                    <span className="overview-dot booked-dot"></span>

                                                    <span>
                                                        Booked
                                                    </span>

                                                    <strong>
                                                        {
                                                            statistics.booked ||
                                                            0
                                                        }
                                                    </strong>

                                                </div>


                                                <div className="overview-item">

                                                    <span className="overview-dot confirmed-dot"></span>

                                                    <span>
                                                        Confirmed
                                                    </span>

                                                    <strong>
                                                        {
                                                            statistics.confirmed ||
                                                            0
                                                        }
                                                    </strong>

                                                </div>


                                                <div className="overview-item">

                                                    <span className="overview-dot progress-dot"></span>

                                                    <span>
                                                        In Progress
                                                    </span>

                                                    <strong>
                                                        {
                                                            statistics.inProgress ||
                                                            0
                                                        }
                                                    </strong>

                                                </div>


                                                <div className="overview-item">

                                                    <span className="overview-dot completed-dot"></span>

                                                    <span>
                                                        Completed
                                                    </span>

                                                    <strong>
                                                        {
                                                            statistics.completed ||
                                                            0
                                                        }
                                                    </strong>

                                                </div>


                                                <div className="overview-item">

                                                    <span className="overview-dot cancelled-dot"></span>

                                                    <span>
                                                        Cancelled
                                                    </span>

                                                    <strong>
                                                        {
                                                            statistics.cancelled ||
                                                            0
                                                        }
                                                    </strong>

                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                </>

                            )}


                            {/* PATIENTS */}

                            {activeSection === "patients" && (

                                <div className="page-section">

                                    <div className="page-title">

                                        <div>

                                            <p className="small-heading">
                                                MANAGEMENT
                                            </p>

                                            <h1>
                                                Patients
                                            </h1>

                                            <p>
                                                View all registered patients.
                                            </p>

                                        </div>

                                        <div className="page-count">
                                            {patients.length} Patients
                                        </div>

                                    </div>


                                    <div className="panel">

                                        <div className="table-container">

                                            <table>

                                                <thead>

                                                    <tr>
                                                        <th>ID</th>
                                                        <th>Patient</th>
                                                        <th>Email</th>
                                                        <th>Phone</th>
                                                    </tr>

                                                </thead>

                                                <tbody>

                                                    {patients.map((patient) => (

                                                        <tr key={patient.id}>

                                                            <td>
                                                                #{patient.id}
                                                            </td>

                                                            <td>
                                                                <strong>
                                                                    {
                                                                        patient
                                                                            .user
                                                                            ?.fullName
                                                                    }
                                                                </strong>
                                                            </td>

                                                            <td>
                                                                {
                                                                    patient
                                                                        .user
                                                                        ?.email
                                                                }
                                                            </td>

                                                            <td>
                                                                {
                                                                    patient.phone ||
                                                                    "-"
                                                                }
                                                            </td>

                                                        </tr>

                                                    ))}

                                                </tbody>

                                            </table>

                                        </div>

                                    </div>

                                </div>

                            )}


                            {/* DOCTORS */}

                            {activeSection === "doctors" && (

                                <div className="page-section">

                                    <div className="page-title">

                                        <div>

                                            <p className="small-heading">
                                                MEDICAL TEAM
                                            </p>

                                            <h1>
                                                Doctors
                                            </h1>

                                            <p>
                                                Manage registered doctors.
                                            </p>

                                        </div>

                                        <div className="page-count">
                                            {doctors.length} Doctors
                                        </div>

                                    </div>


                                    <div className="panel">

                                        <div className="table-container">

                                            <table>

                                                <thead>

                                                    <tr>
                                                        <th>ID</th>
                                                        <th>Doctor</th>
                                                        <th>Email</th>
                                                        <th>Specialization</th>
                                                        <th>Department</th>
                                                    </tr>

                                                </thead>

                                                <tbody>

                                                    {doctors.map((doctor) => (

                                                        <tr key={doctor.id}>

                                                            <td>
                                                                #{doctor.id}
                                                            </td>

                                                            <td>
                                                                <strong>
                                                                    {
                                                                        doctor
                                                                            .user
                                                                            ?.fullName
                                                                    }
                                                                </strong>
                                                            </td>

                                                            <td>
                                                                {
                                                                    doctor
                                                                        .user
                                                                        ?.email
                                                                }
                                                            </td>

                                                            <td>
                                                                {
                                                                    doctor.specialization
                                                                }
                                                            </td>

                                                            <td>
                                                                {
                                                                    doctor
                                                                        .department
                                                                        ?.name ||
                                                                    "-"
                                                                }
                                                            </td>

                                                        </tr>

                                                    ))}

                                                </tbody>

                                            </table>

                                        </div>

                                    </div>

                                </div>

                            )}


                            {/* DEPARTMENTS */}

                            {activeSection === "departments" && (

                                <div className="page-section">

                                    <div className="page-title">

                                        <div>

                                            <p className="small-heading">
                                                ORGANIZATION
                                            </p>

                                            <h1>
                                                Departments
                                            </h1>

                                            <p>
                                                Manage hospital departments.
                                            </p>

                                        </div>

                                    </div>


                                    <div className="department-layout">


                                        <div className="panel add-department-panel">

                                            <h2>
                                                Add Department
                                            </h2>

                                            <p>
                                                Create a new hospital department.
                                            </p>


                                            <form
                                                onSubmit={
                                                    handleAddDepartment
                                                }
                                            >

                                                <label>
                                                    Department Name
                                                </label>

                                                <input
                                                    type="text"
                                                    placeholder="e.g. Neurology"
                                                    value={
                                                        departmentName
                                                    }
                                                    onChange={(e) =>
                                                        setDepartmentName(
                                                            e.target.value
                                                        )
                                                    }
                                                />

                                                <button
                                                    type="submit"
                                                    className="primary-button"
                                                    disabled={
                                                        addingDepartment
                                                    }
                                                >
                                                    {addingDepartment
                                                        ? "Adding..."
                                                        : "+ Add Department"}
                                                </button>

                                            </form>

                                        </div>


                                        <div className="panel">

                                            <div className="panel-header">

                                                <div>

                                                    <h2>
                                                        All Departments
                                                    </h2>

                                                    <p>
                                                        {
                                                            departments.length
                                                        } departments
                                                    </p>

                                                </div>

                                            </div>


                                            <div className="department-list">

                                                {departments.map(
                                                    (department) => (

                                                        <div
                                                            className="department-item"
                                                            key={
                                                                department.id
                                                            }
                                                        >

                                                            <div className="department-icon">
                                                                +
                                                            </div>

                                                            <div>

                                                                <strong>
                                                                    {
                                                                        department.name
                                                                    }
                                                                </strong>

                                                                <span>
                                                                    Department #
                                                                    {
                                                                        department.id
                                                                    }
                                                                </span>

                                                            </div>

                                                        </div>

                                                    )
                                                )}

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            )}


                            {/* APPOINTMENTS */}

                            {activeSection === "appointments" && (

                                <div className="page-section">

                                    <div className="page-title">

                                        <div>

                                            <p className="small-heading">
                                                APPOINTMENT MANAGEMENT
                                            </p>

                                            <h1>
                                                Appointments
                                            </h1>

                                            <p>
                                                Monitor all patient appointments.
                                            </p>

                                        </div>

                                        <div className="page-count">
                                            {appointments.length} Appointments
                                        </div>

                                    </div>


                                    <div className="panel">

                                        <div className="table-container">

                                            <table>

                                                <thead>

                                                    <tr>
                                                        <th>ID</th>
                                                        <th>Patient</th>
                                                        <th>Doctor</th>
                                                        <th>Date</th>
                                                        <th>Time</th>
                                                        <th>Status</th>
                                                    </tr>

                                                </thead>

                                                <tbody>

                                                    {appointments.map(
                                                        (appointment) => (

                                                            <tr
                                                                key={
                                                                    appointment.id
                                                                }
                                                            >

                                                                <td>
                                                                    #
                                                                    {
                                                                        appointment.id
                                                                    }
                                                                </td>

                                                                <td>
                                                                    <strong>
                                                                        {
                                                                            appointment
                                                                                .patient
                                                                                ?.user
                                                                                ?.fullName ||
                                                                            "-"
                                                                        }
                                                                    </strong>
                                                                </td>

                                                                <td>
                                                                    {
                                                                        appointment
                                                                            .doctor
                                                                            ?.user
                                                                            ?.fullName ||
                                                                        "-"
                                                                    }
                                                                </td>

                                                                <td>
                                                                    {
                                                                        appointment
                                                                            .appointmentDate
                                                                    }
                                                                </td>

                                                                <td>
                                                                    {
                                                                        appointment
                                                                            .appointmentTime
                                                                    }
                                                                </td>

                                                                <td>

                                                                    <span
                                                                        className={`status-badge ${getStatusClass(
                                                                            appointment.status
                                                                        )}`}
                                                                    >
                                                                        {
                                                                            appointment.status
                                                                        }
                                                                    </span>

                                                                </td>

                                                            </tr>

                                                        )
                                                    )}

                                                </tbody>

                                            </table>

                                        </div>

                                    </div>

                                </div>

                            )}


                            {/* STATISTICS */}

                            {activeSection === "statistics" && (

                                <div className="page-section">

                                    <div className="page-title">

                                        <div>

                                            <p className="small-heading">
                                                ANALYTICS
                                            </p>

                                            <h1>
                                                Appointment Statistics
                                            </h1>

                                            <p>
                                                Overview of appointment activity.
                                            </p>

                                        </div>

                                    </div>


                                    <div className="statistics-grid">


                                        <div className="analytics-card">

                                            <span>
                                                Total
                                            </span>

                                            <h2>
                                                {statistics.total || 0}
                                            </h2>

                                            <p>
                                                All appointments
                                            </p>

                                        </div>


                                        <div className="analytics-card">

                                            <span>
                                                Booked
                                            </span>

                                            <h2>
                                                {statistics.booked || 0}
                                            </h2>

                                            <p>
                                                New bookings
                                            </p>

                                        </div>


                                        <div className="analytics-card">

                                            <span>
                                                Confirmed
                                            </span>

                                            <h2>
                                                {statistics.confirmed || 0}
                                            </h2>

                                            <p>
                                                Confirmed appointments
                                            </p>

                                        </div>


                                        <div className="analytics-card">

                                            <span>
                                                In Progress
                                            </span>

                                            <h2>
                                                {statistics.inProgress || 0}
                                            </h2>

                                            <p>
                                                Active consultations
                                            </p>

                                        </div>


                                        <div className="analytics-card">

                                            <span>
                                                Completed
                                            </span>

                                            <h2>
                                                {statistics.completed || 0}
                                            </h2>

                                            <p>
                                                Completed visits
                                            </p>

                                        </div>


                                        <div className="analytics-card">

                                            <span>
                                                Cancelled
                                            </span>

                                            <h2>
                                                {statistics.cancelled || 0}
                                            </h2>

                                            <p>
                                                Cancelled appointments
                                            </p>

                                        </div>

                                    </div>

                                </div>

                            )}

                        </>

                    )}

                </div>

            </main>

        </div>
    );
}

export default AdminDashboard;

