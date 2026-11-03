import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "../../styles/doctor-dashboard.css";

function DoctorDashboard() {

    const navigate = useNavigate();

    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [activeSection, setActiveSection] = useState("dashboard");

    const doctorName =
        localStorage.getItem("fullName") || "Doctor";

    const doctorEmail =
        localStorage.getItem("email") || "";


    useEffect(() => {
        fetchAppointments();
    }, []);


    const fetchAppointments = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await api.get("/api/doctor/appointments");

            setAppointments(response.data);

        } catch (err) {

            console.error(
                "Appointment fetch error:",
                err
            );

            setError(
                err.response?.data ||
                "Unable to load appointments"
            );

        } finally {

            setLoading(false);

        }
    };


    const updateStatus = async (
        appointmentId,
        status
    ) => {

        try {

            setUpdatingId(appointmentId);
            setMessage("");
            setError("");

            await api.put(
                `/api/doctor/appointments/${appointmentId}/status`,
                null,
                {
                    params: {
                        status: status
                    }
                }
            );

            setMessage(
                `Appointment #${appointmentId} updated to ${status}`
            );

            await fetchAppointments();

        } catch (err) {

            console.error(
                "Status update error:",
                err
            );

            setError(
                err.response?.data ||
                "Unable to update appointment"
            );

        } finally {

            setUpdatingId(null);

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


    const totalAppointments =
        appointments.length;

    const bookedCount =
        appointments.filter(
            a => a.status === "BOOKED"
        ).length;

    const confirmedCount =
        appointments.filter(
            a => a.status === "CONFIRMED"
        ).length;

    const completedCount =
        appointments.filter(
            a => a.status === "COMPLETED"
        ).length;

    const inProgressCount =
        appointments.filter(
            a => a.status === "IN_PROGRESS"
        ).length;

    const cancelledCount =
        appointments.filter(
            a => a.status === "CANCELLED"
        ).length;


    const getActionButton = (appointment) => {

        if (updatingId === appointment.id) {

            return (
                <button
                    className="action-button disabled"
                    disabled
                >
                    Updating...
                </button>
            );
        }


        if (appointment.status === "BOOKED") {

            return (
                <button
                    className="action-button confirm"
                    onClick={() =>
                        updateStatus(
                            appointment.id,
                            "CONFIRMED"
                        )
                    }
                >
                    Confirm
                </button>
            );

        }


        if (appointment.status === "CONFIRMED") {

            return (
                <button
                    className="action-button start"
                    onClick={() =>
                        updateStatus(
                            appointment.id,
                            "IN_PROGRESS"
                        )
                    }
                >
                    Start
                </button>
            );

        }


        if (appointment.status === "IN_PROGRESS") {

            return (
                <button
                    className="action-button complete"
                    onClick={() =>
                        updateStatus(
                            appointment.id,
                            "COMPLETED"
                        )
                    }
                >
                    Complete
                </button>
            );

        }


        return (
            <span className="no-action">
                No action
            </span>
        );
    };


    return (

        <div className="doctor-layout">


            {/* SIDEBAR */}

            <aside className="doctor-sidebar">

                <div className="doctor-brand">

                    <div className="doctor-brand-icon">
                        +
                    </div>

                    <div>
                        <h2>CareFlow</h2>
                        <span>
                            Doctor Portal
                        </span>
                    </div>

                </div>


                <div className="doctor-menu">

                    <p className="doctor-menu-title">
                        DOCTOR PORTAL
                    </p>


                    <button
                        className={
                            activeSection === "dashboard"
                                ? "doctor-menu-item active"
                                : "doctor-menu-item"
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
                            activeSection === "appointments"
                                ? "doctor-menu-item active"
                                : "doctor-menu-item"
                        }
                        onClick={() =>
                            setActiveSection(
                                "appointments"
                            )
                        }
                    >
                        <span>▣</span>
                        My Appointments
                    </button>


                    <button
                        className={
                            activeSection === "patients"
                                ? "doctor-menu-item active"
                                : "doctor-menu-item"
                        }
                        onClick={() =>
                            setActiveSection("patients")
                        }
                    >
                        <span>♙</span>
                        Patients
                    </button>

                </div>


                <div className="doctor-sidebar-bottom">

                    <button
                        className="doctor-menu-item logout"
                        onClick={handleLogout}
                    >
                        <span>↪</span>
                        Logout
                    </button>

                </div>

            </aside>


            {/* MAIN */}

            <main className="doctor-main">


                {/* HEADER */}

                <header className="doctor-header">

                    <div>

                        <p className="doctor-breadcrumb">
                            Doctor / {
                                activeSection === "dashboard"
                                    ? "Overview"
                                    : activeSection
                            }
                        </p>

                    </div>


                    <div className="doctor-profile">

                        <div className="doctor-notification">
                            ♢
                        </div>

                        <div className="doctor-avatar">
                            {doctorName
                                .charAt(0)
                                .toUpperCase()}
                        </div>

                        <div className="doctor-profile-info">

                            <strong>
                                {doctorName}
                            </strong>

                            <span>
                                Medical Doctor
                            </span>

                        </div>

                    </div>

                </header>


                <div className="doctor-content">


                    {/* MESSAGES */}

                    {message && (

                        <div className="doctor-success">
                            ✓ {message}
                        </div>

                    )}


                    {error && (

                        <div className="doctor-error">
                            ⚠ {error}
                        </div>

                    )}


                    {loading ? (

                        <div className="doctor-loading">

                            <div className="doctor-loader"></div>

                            <p>
                                Loading your appointments...
                            </p>

                        </div>

                    ) : (

                        <>


                            {/* DASHBOARD */}

                            {activeSection === "dashboard" && (

                                <>

                                    <div className="doctor-welcome">

                                        <div>

                                            <p className="doctor-small-title">
                                                DOCTOR DASHBOARD
                                            </p>

                                            <h1>
                                                Good day, Dr. {doctorName} 👋
                                            </h1>

                                            <p>
                                                Here's your appointment
                                                overview for today.
                                            </p>

                                        </div>

                                        <div className="doctor-role-card">

                                            <div className="role-icon">
                                                ⚕
                                            </div>

                                            <div>

                                                <strong>
                                                    Medical Doctor
                                                </strong>

                                                <span>
                                                    {doctorEmail}
                                                </span>

                                            </div>

                                        </div>

                                    </div>


                                    {/* STAT CARDS */}

                                    <div className="doctor-stats">


                                        <div className="doctor-stat-card">

                                            <div className="doctor-stat-icon blue">
                                                ▣
                                            </div>

                                            <div>

                                                <span>
                                                    Total Appointments
                                                </span>

                                                <h2>
                                                    {totalAppointments}
                                                </h2>

                                                <small>
                                                    All appointments
                                                </small>

                                            </div>

                                        </div>


                                        <div className="doctor-stat-card">

                                            <div className="doctor-stat-icon orange">
                                                ◷
                                            </div>

                                            <div>

                                                <span>
                                                    Pending
                                                </span>

                                                <h2>
                                                    {bookedCount}
                                                </h2>

                                                <small>
                                                    Awaiting confirmation
                                                </small>

                                            </div>

                                        </div>


                                        <div className="doctor-stat-card">

                                            <div className="doctor-stat-icon green">
                                                ✓
                                            </div>

                                            <div>

                                                <span>
                                                    Confirmed
                                                </span>

                                                <h2>
                                                    {confirmedCount}
                                                </h2>

                                                <small>
                                                    Ready for consultation
                                                </small>

                                            </div>

                                        </div>


                                        <div className="doctor-stat-card">

                                            <div className="doctor-stat-icon purple">
                                                ★
                                            </div>

                                            <div>

                                                <span>
                                                    Completed
                                                </span>

                                                <h2>
                                                    {completedCount}
                                                </h2>

                                                <small>
                                                    Completed visits
                                                </small>

                                            </div>

                                        </div>

                                    </div>


                                    {/* DASHBOARD CONTENT */}

                                    <div className="doctor-dashboard-grid">


                                        <div className="doctor-panel large">

                                            <div className="doctor-panel-header">

                                                <div>

                                                    <h2>
                                                        Upcoming Appointments
                                                    </h2>

                                                    <p>
                                                        Your latest patient appointments
                                                    </p>

                                                </div>

                                                <button
                                                    className="doctor-view-button"
                                                    onClick={() =>
                                                        setActiveSection(
                                                            "appointments"
                                                        )
                                                    }
                                                >
                                                    View All →
                                                </button>

                                            </div>


                                            <div className="doctor-table-container">

                                                <table>

                                                    <thead>

                                                        <tr>
                                                            <th>Patient</th>
                                                            <th>Date</th>
                                                            <th>Time</th>
                                                            <th>Status</th>
                                                            <th>Action</th>
                                                        </tr>

                                                    </thead>


                                                    <tbody>

                                                        {appointments
                                                            .slice(0, 5)
                                                            .map(
                                                                (
                                                                    appointment
                                                                ) => (

                                                                    <tr
                                                                        key={
                                                                            appointment.id
                                                                        }
                                                                    >

                                                                        <td>

                                                                            <div className="patient-cell">

                                                                                <div className="patient-avatar">
                                                                                    {
                                                                                        appointment
                                                                                            .patient
                                                                                            ?.user
                                                                                            ?.fullName
                                                                                            ?.charAt(
                                                                                                0
                                                                                            )
                                                                                            ?.toUpperCase()
                                                                                    }
                                                                                </div>

                                                                                <strong>
                                                                                    {
                                                                                        appointment
                                                                                            .patient
                                                                                            ?.user
                                                                                            ?.fullName ||
                                                                                        "-"
                                                                                    }
                                                                                </strong>

                                                                            </div>

                                                                        </td>

                                                                        <td>
                                                                            {
                                                                                appointment.appointmentDate
                                                                            }
                                                                        </td>

                                                                        <td>
                                                                            {
                                                                                appointment.appointmentTime
                                                                            }
                                                                        </td>

                                                                        <td>

                                                                            <span
                                                                                className={`doctor-status ${getStatusClass(
                                                                                    appointment.status
                                                                                )}`}
                                                                            >
                                                                                {
                                                                                    appointment.status
                                                                                }
                                                                            </span>

                                                                        </td>

                                                                        <td>
                                                                            {getActionButton(
                                                                                appointment
                                                                            )}
                                                                        </td>

                                                                    </tr>

                                                                )
                                                            )}


                                                        {appointments.length === 0 && (

                                                            <tr>

                                                                <td
                                                                    colSpan="5"
                                                                    className="doctor-empty"
                                                                >
                                                                    No appointments
                                                                    found.
                                                                </td>

                                                            </tr>

                                                        )}

                                                    </tbody>

                                                </table>

                                            </div>

                                        </div>


                                        {/* STATUS SUMMARY */}

                                        <div className="doctor-panel">

                                            <div className="doctor-panel-header">

                                                <div>

                                                    <h2>
                                                        Appointment Status
                                                    </h2>

                                                    <p>
                                                        Current overview
                                                    </p>

                                                </div>

                                            </div>


                                            <div className="doctor-status-list">

                                                <div className="doctor-status-row">

                                                    <span className="status-circle booked-circle">
                                                    </span>

                                                    <span>
                                                        Pending
                                                    </span>

                                                    <strong>
                                                        {bookedCount}
                                                    </strong>

                                                </div>


                                                <div className="doctor-status-row">

                                                    <span className="status-circle confirmed-circle">
                                                    </span>

                                                    <span>
                                                        Confirmed
                                                    </span>

                                                    <strong>
                                                        {confirmedCount}
                                                    </strong>

                                                </div>


                                                <div className="doctor-status-row">

                                                    <span className="status-circle progress-circle">
                                                    </span>

                                                    <span>
                                                        In Progress
                                                    </span>

                                                    <strong>
                                                        {inProgressCount}
                                                    </strong>

                                                </div>


                                                <div className="doctor-status-row">

                                                    <span className="status-circle completed-circle">
                                                    </span>

                                                    <span>
                                                        Completed
                                                    </span>

                                                    <strong>
                                                        {completedCount}
                                                    </strong>

                                                </div>


                                                <div className="doctor-status-row">

                                                    <span className="status-circle cancelled-circle">
                                                    </span>

                                                    <span>
                                                        Cancelled
                                                    </span>

                                                    <strong>
                                                        {cancelledCount}
                                                    </strong>

                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                </>

                            )}


                            {/* APPOINTMENTS */}

                            {activeSection === "appointments" && (

                                <div className="doctor-page">

                                    <div className="doctor-page-title">

                                        <div>

                                            <p className="doctor-small-title">
                                                APPOINTMENT MANAGEMENT
                                            </p>

                                            <h1>
                                                My Appointments
                                            </h1>

                                            <p>
                                                Manage your patient appointments
                                                and update their status.
                                            </p>

                                        </div>

                                        <div className="doctor-count">
                                            {appointments.length}
                                            {" "}
                                            Appointments
                                        </div>

                                    </div>


                                    <div className="doctor-panel">

                                        <div className="doctor-table-container">

                                            <table>

                                                <thead>

                                                    <tr>
                                                        <th>ID</th>
                                                        <th>Patient</th>
                                                        <th>Phone</th>
                                                        <th>Date</th>
                                                        <th>Time</th>
                                                        <th>Status</th>
                                                        <th>Action</th>
                                                    </tr>

                                                </thead>


                                                <tbody>

                                                    {appointments.map(
                                                        (
                                                            appointment
                                                        ) => (

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

                                                                    <div className="patient-cell">

                                                                        <div className="patient-avatar">
                                                                            {
                                                                                appointment
                                                                                    .patient
                                                                                    ?.user
                                                                                    ?.fullName
                                                                                    ?.charAt(
                                                                                        0
                                                                                    )
                                                                                    ?.toUpperCase()
                                                                            }
                                                                        </div>

                                                                        <strong>
                                                                            {
                                                                                appointment
                                                                                    .patient
                                                                                    ?.user
                                                                                    ?.fullName ||
                                                                                "-"
                                                                            }
                                                                        </strong>

                                                                    </div>

                                                                </td>

                                                                <td>
                                                                    {
                                                                        appointment
                                                                            .patient
                                                                            ?.phone ||
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
                                                                        className={`doctor-status ${getStatusClass(
                                                                            appointment.status
                                                                        )}`}
                                                                    >
                                                                        {
                                                                            appointment.status
                                                                        }
                                                                    </span>

                                                                </td>

                                                                <td>
                                                                    {getActionButton(
                                                                        appointment
                                                                    )}
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


                            {/* PATIENTS */}

                            {activeSection === "patients" && (

                                <div className="doctor-page">

                                    <div className="doctor-page-title">

                                        <div>

                                            <p className="doctor-small-title">
                                                PATIENT DIRECTORY
                                            </p>

                                            <h1>
                                                My Patients
                                            </h1>

                                            <p>
                                                Patients associated with your
                                                appointments.
                                            </p>

                                        </div>

                                    </div>


                                    <div className="doctor-panel">

                                        <div className="doctor-table-container">

                                            <table>

                                                <thead>

                                                    <tr>
                                                        <th>Patient</th>
                                                        <th>Phone</th>
                                                        <th>Last Appointment</th>
                                                        <th>Status</th>
                                                    </tr>

                                                </thead>


                                                <tbody>

                                                    {appointments.map(
                                                        (
                                                            appointment
                                                        ) => (

                                                            <tr
                                                                key={
                                                                    appointment.id
                                                                }
                                                            >

                                                                <td>

                                                                    <div className="patient-cell">

                                                                        <div className="patient-avatar">
                                                                            {
                                                                                appointment
                                                                                    .patient
                                                                                    ?.user
                                                                                    ?.fullName
                                                                                    ?.charAt(
                                                                                        0
                                                                                    )
                                                                                    ?.toUpperCase()
                                                                            }
                                                                        </div>

                                                                        <strong>
                                                                            {
                                                                                appointment
                                                                                    .patient
                                                                                    ?.user
                                                                                    ?.fullName ||
                                                                                "-"
                                                                            }
                                                                        </strong>

                                                                    </div>

                                                                </td>

                                                                <td>
                                                                    {
                                                                        appointment
                                                                            .patient
                                                                            ?.phone ||
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
                                                                        className={`doctor-status ${getStatusClass(
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

                        </>

                    )}

                </div>

            </main>

        </div>
    );
}

export default DoctorDashboard;


