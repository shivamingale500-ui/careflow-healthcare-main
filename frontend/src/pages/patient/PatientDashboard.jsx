import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "../../styles/patient-dashboard.css";

function PatientDashboard() {

    const navigate = useNavigate();

    const patientName =
        localStorage.getItem("fullName") || "Patient";

    const patientEmail =
        localStorage.getItem("email") || "";

    const [activePage, setActivePage] = useState("dashboard");

    const [departments, setDepartments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);

    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [selectedDoctor, setSelectedDoctor] = useState("");

    const [appointmentDate, setAppointmentDate] = useState("");
    const [appointmentTime, setAppointmentTime] = useState("");

    const [loading, setLoading] = useState(false);
    const [booking, setBooking] = useState(false);
    const [cancellingAppointment, setCancellingAppointment] =
        useState(null);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        fetchDepartments();
        fetchDoctors();
        fetchAppointments();
    }, []);

    const fetchDepartments = async () => {
        try {

            const response =
                await api.get("/api/departments");

            setDepartments(response.data);

        } catch (error) {

            console.error(
                "Department loading error:",
                error
            );

            setError("Unable to load departments");
        }
    };

    const fetchDoctors = async () => {
        try {

            const response =
                await api.get("/api/doctors");

            setDoctors(response.data);

        } catch (error) {

            console.error(
                "Doctor loading error:",
                error
            );

            setError("Unable to load doctors");
        }
    };

    const fetchAppointments = async () => {
        try {

            setLoading(true);

            const response =
                await api.get(
                    "/api/patient/appointments"
                );

            setAppointments(response.data);

        } catch (error) {

            console.error(
                "Appointment loading error:",
                error
            );

            setError("Unable to load appointments");

        } finally {

            setLoading(false);
        }
    };

    const handleDepartmentChange = async (event) => {

        const departmentId =
            event.target.value;

        setSelectedDepartment(departmentId);
        setSelectedDoctor("");

        if (!departmentId) {

            fetchDoctors();

            return;
        }

        try {

            const response =
                await api.get(
                    `/api/doctors/department/${departmentId}`
                );

            setDoctors(response.data);

        } catch (error) {

            console.error(
                "Doctor filtering error:",
                error
            );

            setError(
                "Unable to load doctors for this department"
            );
        }
    };

    const handleBookAppointment = async (event) => {

        event.preventDefault();

        setMessage("");
        setError("");

        if (
            !selectedDoctor ||
            !appointmentDate ||
            !appointmentTime
        ) {

            setError(
                "Please select doctor, date and time"
            );

            return;
        }

        try {

            setBooking(true);

            const appointmentData = {

                doctorId: Number(selectedDoctor),

                appointmentDate:
                    appointmentDate,

                appointmentTime:
                    appointmentTime

            };

            const response =
                await api.post(
                    "/api/patient/appointments",
                    appointmentData
                );

            console.log(
                "Appointment booking response:",
                response.data
            );

            setMessage(
                "Appointment booked successfully!"
            );

            setSelectedDoctor("");
            setAppointmentDate("");
            setAppointmentTime("");

            await fetchAppointments();

            setActivePage("appointments");

        } catch (error) {

            console.error(
                "Appointment booking error:",
                error
            );

            setError(
                error.response?.data ||
                "Unable to book appointment"
            );

        } finally {

            setBooking(false);
        }
    };

    const handleCancelAppointment = async (
        appointmentId
    ) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to cancel this appointment?"
            );

        if (!confirmed) {
            return;
        }

        try {

            setCancellingAppointment(
                appointmentId
            );

            setMessage("");
            setError("");

            const response =
                await api.put(
                    `/api/patient/appointments/${appointmentId}/cancel`
                );

            console.log(
                "Cancel response:",
                response.data
            );

            setMessage(
                "Appointment cancelled successfully!"
            );

            await fetchAppointments();

        } catch (error) {

            console.error(
                "Cancel appointment error:",
                error
            );

            setError(
                error.response?.data ||
                "Unable to cancel appointment"
            );

        } finally {

            setCancellingAppointment(null);
        }
    };

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("email");
        localStorage.removeItem("fullName");

        navigate("/login");
    };

    const getDoctorName = (appointment) => {

        return (
            appointment?.doctor?.user?.fullName ||
            "Doctor"
        );
    };

    const getDoctorSpecialization = (appointment) => {

        return (
            appointment?.doctor?.specialization ||
            "Medical Specialist"
        );
    };

    const getStatusClass = (status) => {

        switch (status) {

            case "BOOKED":
                return "patient-status booked";

            case "CONFIRMED":
                return "patient-status confirmed";

            case "IN_PROGRESS":
                return "patient-status progress";

            case "COMPLETED":
                return "patient-status completed";

            case "CANCELLED":
                return "patient-status cancelled";

            default:
                return "patient-status";
        }
    };

    const formatStatus = (status) => {

        if (!status) {
            return "-";
        }

        return status
            .replace("_", " ")
            .toLowerCase()
            .replace(/\b\w/g, char =>
                char.toUpperCase()
            );
    };

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        const dateObject =
            new Date(`${date}T00:00:00`);

        return dateObject.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    };

    const formatTime = (time) => {

        if (!time) {
            return "-";
        }

        const [hours, minutes] =
            time.split(":");

        const date =
            new Date();

        date.setHours(
            Number(hours),
            Number(minutes)
        );

        return date.toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
            }
        );
    };

    const upcomingAppointments = useMemo(() => {

        return appointments
            .filter(
                appointment =>
                    appointment.status !== "CANCELLED" &&
                    appointment.status !== "COMPLETED"
            )
            .sort((a, b) => {

                const dateA =
                    new Date(
                        `${a.appointmentDate}T${a.appointmentTime}`
                    );

                const dateB =
                    new Date(
                        `${b.appointmentDate}T${b.appointmentTime}`
                    );

                return dateA - dateB;
            });

    }, [appointments]);

    const totalAppointments =
        appointments.length;

    const bookedCount =
        appointments.filter(
            appointment =>
                appointment.status === "BOOKED"
        ).length;

    const confirmedCount =
        appointments.filter(
            appointment =>
                appointment.status === "CONFIRMED"
        ).length;

    const completedCount =
        appointments.filter(
            appointment =>
                appointment.status === "COMPLETED"
        ).length;

    const cancelledCount =
        appointments.filter(
            appointment =>
                appointment.status === "CANCELLED"
        ).length;

    const renderDashboard = () => {

        return (
            <>
                <div className="patient-welcome">

                    <div>
                        <p className="patient-small-title">
                            PATIENT PORTAL
                        </p>

                        <h1>
                            Welcome back, {patientName}
                        </h1>

                        <p>
                            Manage your appointments
                            and healthcare easily.
                        </p>
                    </div>

                    <div className="patient-profile-card">

                        <div className="patient-avatar large">
                            {patientName
                                .charAt(0)
                                .toUpperCase()}
                        </div>

                        <div>
                            <strong>
                                {patientName}
                            </strong>

                            <span>
                                {patientEmail}
                            </span>
                        </div>

                    </div>

                </div>

                <div className="patient-stats">

                    <div className="patient-stat-card">

                        <div className="patient-stat-icon blue">
                            📅
                        </div>

                        <div>
                            <span>
                                Total Appointments
                            </span>

                            <strong>
                                {totalAppointments}
                            </strong>
                        </div>

                    </div>

                    <div className="patient-stat-card">

                        <div className="patient-stat-icon orange">
                            ⏳
                        </div>

                        <div>
                            <span>
                                Booked
                            </span>

                            <strong>
                                {bookedCount}
                            </strong>
                        </div>

                    </div>

                    <div className="patient-stat-card">

                        <div className="patient-stat-icon green">
                            ✓
                        </div>

                        <div>
                            <span>
                                Confirmed
                            </span>

                            <strong>
                                {confirmedCount}
                            </strong>
                        </div>

                    </div>

                    <div className="patient-stat-card">

                        <div className="patient-stat-icon purple">
                            ✓
                        </div>

                        <div>
                            <span>
                                Completed
                            </span>

                            <strong>
                                {completedCount}
                            </strong>
                        </div>

                    </div>

                </div>

                <div className="patient-dashboard-grid">

                    <div className="patient-panel">

                        <div className="patient-panel-header">

                            <div>
                                <h2>
                                    Upcoming Appointments
                                </h2>

                                <p>
                                    Your next scheduled visits
                                </p>
                            </div>

                            <button
                                className="patient-link-button"
                                onClick={() =>
                                    setActivePage(
                                        "appointments"
                                    )
                                }
                            >
                                View All
                            </button>

                        </div>

                        {loading ? (

                            <div className="patient-loading">
                                <div className="patient-loader"></div>
                                <p>
                                    Loading appointments...
                                </p>
                            </div>

                        ) : upcomingAppointments.length === 0 ? (

                            <div className="patient-empty">

                                <div className="empty-icon">
                                    📅
                                </div>

                                <h3>
                                    No upcoming appointments
                                </h3>

                                <p>
                                    Book an appointment
                                    with a doctor.
                                </p>

                                <button
                                    className="patient-primary-button"
                                    onClick={() =>
                                        setActivePage(
                                            "book"
                                        )
                                    }
                                >
                                    Book Appointment
                                </button>

                            </div>

                        ) : (

                            <div className="patient-appointment-list">

                                {upcomingAppointments
                                    .slice(0, 4)
                                    .map(
                                        appointment => (

                                            <div
                                                className="patient-appointment-item"
                                                key={
                                                    appointment.id
                                                }
                                            >

                                                <div className="patient-doctor-avatar">
                                                    {getDoctorName(
                                                        appointment
                                                    )
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>

                                                <div className="patient-appointment-info">

                                                    <strong>
                                                        {getDoctorName(
                                                            appointment
                                                        )}
                                                    </strong>

                                                    <span>
                                                        {getDoctorSpecialization(
                                                            appointment
                                                        )}
                                                    </span>

                                                </div>

                                                <div className="patient-date-info">

                                                    <strong>
                                                        {formatDate(
                                                            appointment.appointmentDate
                                                        )}
                                                    </strong>

                                                    <span>
                                                        {formatTime(
                                                            appointment.appointmentTime
                                                        )}
                                                    </span>

                                                </div>

                                                <span
                                                    className={getStatusClass(
                                                        appointment.status
                                                    )}
                                                >
                                                    {formatStatus(
                                                        appointment.status
                                                    )}
                                                </span>

                                            </div>

                                        )
                                    )}

                            </div>

                        )}

                    </div>

                    <div className="patient-panel">

                        <div className="patient-panel-header">

                            <div>
                                <h2>
                                    Appointment Summary
                                </h2>

                                <p>
                                    Your appointment status
                                </p>
                            </div>

                        </div>

                        <div className="patient-summary">

                            <div className="patient-summary-row">

                                <div>
                                    <span className="summary-dot booked"></span>
                                    Booked
                                </div>

                                <strong>
                                    {bookedCount}
                                </strong>

                            </div>

                            <div className="patient-summary-row">

                                <div>
                                    <span className="summary-dot confirmed"></span>
                                    Confirmed
                                </div>

                                <strong>
                                    {confirmedCount}
                                </strong>

                            </div>

                            <div className="patient-summary-row">

                                <div>
                                    <span className="summary-dot completed"></span>
                                    Completed
                                </div>

                                <strong>
                                    {completedCount}
                                </strong>

                            </div>

                            <div className="patient-summary-row">

                                <div>
                                    <span className="summary-dot cancelled"></span>
                                    Cancelled
                                </div>

                                <strong>
                                    {cancelledCount}
                                </strong>

                            </div>

                        </div>

                        <button
                            className="patient-book-large"
                            onClick={() =>
                                setActivePage("book")
                            }
                        >
                            + Book New Appointment
                        </button>

                    </div>

                </div>
            </>
        );
    };

    const renderBookAppointment = () => {

        return (
            <div className="patient-page-section">

                <div className="patient-page-title">

                    <div>
                        <p className="patient-small-title">
                            APPOINTMENTS
                        </p>

                        <h1>
                            Book an Appointment
                        </h1>

                        <p>
                            Select a department, doctor,
                            date and time.
                        </p>
                    </div>

                </div>

                <div className="patient-book-layout">

                    <div className="patient-panel booking-panel">

                        <div className="patient-panel-header">

                            <div>
                                <h2>
                                    Appointment Details
                                </h2>

                                <p>
                                    Choose your preferred
                                    doctor and schedule.
                                </p>
                            </div>

                        </div>

                        <form
                            onSubmit={
                                handleBookAppointment
                            }
                            className="patient-book-form"
                        >

                            <div className="patient-form-group">

                                <label>
                                    Department
                                </label>

                                <select
                                    value={
                                        selectedDepartment
                                    }
                                    onChange={
                                        handleDepartmentChange
                                    }
                                >

                                    <option value="">
                                        Select Department
                                    </option>

                                    {departments.map(
                                        department => (

                                            <option
                                                key={
                                                    department.id
                                                }
                                                value={
                                                    department.id
                                                }
                                            >
                                                {department.name}
                                            </option>

                                        )
                                    )}

                                </select>

                            </div>

                            <div className="patient-form-group">

                                <label>
                                    Doctor
                                </label>

                                <select
                                    value={
                                        selectedDoctor
                                    }
                                    onChange={event =>
                                        setSelectedDoctor(
                                            event.target.value
                                        )
                                    }
                                >

                                    <option value="">
                                        Select Doctor
                                    </option>

                                    {doctors.map(
                                        doctor => (

                                            <option
                                                key={
                                                    doctor.id
                                                }
                                                value={
                                                    doctor.id
                                                }
                                            >
                                                {doctor.user?.fullName ||
                                                    "Doctor"}
                                                {" - "}
                                                {doctor.specialization}
                                            </option>

                                        )
                                    )}

                                </select>

                            </div>

                            <div className="patient-form-row">

                                <div className="patient-form-group">

                                    <label>
                                        Appointment Date
                                    </label>

                                    <input
                                        type="date"
                                        value={
                                            appointmentDate
                                        }
                                        onChange={event =>
                                            setAppointmentDate(
                                                event.target.value
                                            )
                                        }
                                    />

                                </div>

                                <div className="patient-form-group">

                                    <label>
                                        Appointment Time
                                    </label>

                                    <input
                                        type="time"
                                        value={
                                            appointmentTime
                                        }
                                        onChange={event =>
                                            setAppointmentTime(
                                                event.target.value
                                            )
                                        }
                                    />

                                </div>

                            </div>

                            <button
                                type="submit"
                                className="patient-primary-button full"
                                disabled={booking}
                            >
                                {booking
                                    ? "Booking Appointment..."
                                    : "Book Appointment"}
                            </button>

                        </form>

                    </div>

                    <div className="patient-book-info">

                        <div className="patient-info-card">

                            <div className="info-card-icon">
                                🩺
                            </div>

                            <h3>
                                Choose Your Doctor
                            </h3>

                            <p>
                                Select a department to
                                find doctors specializing
                                in that area.
                            </p>

                        </div>

                        <div className="patient-info-card">

                            <div className="info-card-icon">
                                📆
                            </div>

                            <h3>
                                Select Date & Time
                            </h3>

                            <p>
                                Choose a convenient date
                                and appointment time.
                            </p>

                        </div>

                        <div className="patient-info-card">

                            <div className="info-card-icon">
                                ✓
                            </div>

                            <h3>
                                Confirm Booking
                            </h3>

                            <p>
                                Submit your appointment
                                and track its status.
                            </p>

                        </div>

                    </div>

                </div>

            </div>
        );
    };

    const renderAppointments = () => {

        return (
            <div className="patient-page-section">

                <div className="patient-page-title">

                    <div>
                        <p className="patient-small-title">
                            APPOINTMENTS
                        </p>

                        <h1>
                            My Appointments
                        </h1>

                        <p>
                            View and manage your
                            appointments.
                        </p>
                    </div>

                    <button
                        className="patient-primary-button"
                        onClick={() =>
                            setActivePage("book")
                        }
                    >
                        + Book Appointment
                    </button>

                </div>

                <div className="patient-panel">

                    <div className="patient-panel-header">

                        <div>
                            <h2>
                                Appointment History
                            </h2>

                            <p>
                                {appointments.length}
                                {" "}
                                appointment(s)
                            </p>
                        </div>

                    </div>

                    {loading ? (

                        <div className="patient-loading">
                            <div className="patient-loader"></div>
                            <p>
                                Loading appointments...
                            </p>
                        </div>

                    ) : appointments.length === 0 ? (

                        <div className="patient-empty">

                            <div className="empty-icon">
                                📋
                            </div>

                            <h3>
                                No appointments found
                            </h3>

                            <p>
                                You have not booked any
                                appointments yet.
                            </p>

                        </div>

                    ) : (

                        <div className="patient-table-container">

                            <table className="patient-table">

                                <thead>

                                    <tr>
                                        <th>ID</th>
                                        <th>Doctor</th>
                                        <th>Specialization</th>
                                        <th>Date</th>
                                        <th>Time</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>

                                </thead>

                                <tbody>

                                    {appointments.map(
                                        appointment => (

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

                                                    <div className="patient-table-doctor">

                                                        <div className="patient-doctor-avatar small">
                                                            {getDoctorName(
                                                                appointment
                                                            )
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                        </div>

                                                        <strong>
                                                            {getDoctorName(
                                                                appointment
                                                            )}
                                                        </strong>

                                                    </div>

                                                </td>

                                                <td>
                                                    {getDoctorSpecialization(
                                                        appointment
                                                    )}
                                                </td>

                                                <td>
                                                    {formatDate(
                                                        appointment.appointmentDate
                                                    )}
                                                </td>

                                                <td>
                                                    {formatTime(
                                                        appointment.appointmentTime
                                                    )}
                                                </td>

                                                <td>

                                                    <span
                                                        className={getStatusClass(
                                                            appointment.status
                                                        )}
                                                    >
                                                        {formatStatus(
                                                            appointment.status
                                                        )}
                                                    </span>

                                                </td>

                                                <td>

                                                    {appointment.status !==
                                                        "CANCELLED" &&
                                                        appointment.status !==
                                                        "COMPLETED" ? (

                                                        <button
                                                            className="patient-cancel-button"
                                                            onClick={() =>
                                                                handleCancelAppointment(
                                                                    appointment.id
                                                                )
                                                            }
                                                            disabled={
                                                                cancellingAppointment ===
                                                                appointment.id
                                                            }
                                                        >
                                                            {cancellingAppointment ===
                                                            appointment.id
                                                                ? "Cancelling..."
                                                                : "Cancel"}
                                                        </button>

                                                    ) : (

                                                        <span className="patient-no-action">
                                                            No action
                                                        </span>

                                                    )}

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </div>
        );
    };

    const renderProfile = () => {

        return (
            <div className="patient-page-section">

                <div className="patient-page-title">

                    <div>
                        <p className="patient-small-title">
                            ACCOUNT
                        </p>

                        <h1>
                            My Profile
                        </h1>

                        <p>
                            View your CareFlow account
                            information.
                        </p>
                    </div>

                </div>

                <div className="patient-profile-page">

                    <div className="patient-profile-main">

                        <div className="profile-avatar">
                            {patientName
                                .charAt(0)
                                .toUpperCase()}
                        </div>

                        <h2>
                            {patientName}
                        </h2>

                        <span className="profile-role">
                            PATIENT
                        </span>

                    </div>

                    <div className="patient-profile-details">

                        <div className="profile-detail">

                            <span>
                                Full Name
                            </span>

                            <strong>
                                {patientName}
                            </strong>

                        </div>

                        <div className="profile-detail">

                            <span>
                                Email Address
                            </span>

                            <strong>
                                {patientEmail}
                            </strong>

                        </div>

                        <div className="profile-detail">

                            <span>
                                Account Role
                            </span>

                            <strong>
                                Patient
                            </strong>

                        </div>

                    </div>

                </div>

            </div>
        );
    };

    return (

        <div className="patient-layout">

            <aside className="patient-sidebar">

                <div className="patient-brand">

                    <div className="patient-brand-icon">
                        +
                    </div>

                    <div>
                        <strong>
                            CareFlow
                        </strong>

                        <span>
                            Healthcare
                        </span>
                    </div>

                </div>

                <div className="patient-menu">

                    <p className="patient-menu-label">
                        MAIN MENU
                    </p>

                    <button
                        className={`patient-menu-item ${
                            activePage === "dashboard"
                                ? "active"
                                : ""
                        }`}
                        onClick={() =>
                            setActivePage("dashboard")
                        }
                    >
                        <span>▦</span>
                        Dashboard
                    </button>

                    <button
                        className={`patient-menu-item ${
                            activePage === "book"
                                ? "active"
                                : ""
                        }`}
                        onClick={() =>
                            setActivePage("book")
                        }
                    >
                        <span>+</span>
                        Book Appointment
                    </button>

                    <button
                        className={`patient-menu-item ${
                            activePage === "appointments"
                                ? "active"
                                : ""
                        }`}
                        onClick={() =>
                            setActivePage("appointments")
                        }
                    >
                        <span>▤</span>
                        My Appointments
                    </button>

                    <p className="patient-menu-label">
                        ACCOUNT
                    </p>

                    <button
                        className={`patient-menu-item ${
                            activePage === "profile"
                                ? "active"
                                : ""
                        }`}
                        onClick={() =>
                            setActivePage("profile")
                        }
                    >
                        <span>◉</span>
                        My Profile
                    </button>

                    <button
                        className="patient-menu-item logout"
                        onClick={handleLogout}
                    >
                        <span>↪</span>
                        Logout
                    </button>

                </div>

                <div className="patient-sidebar-footer">

                    <div className="footer-health-icon">
                        ♥
                    </div>

                    <div>
                        <strong>
                            Your Health Matters
                        </strong>

                        <span>
                            CareFlow Healthcare
                        </span>
                    </div>

                </div>

            </aside>

            <main className="patient-main">

                <header className="patient-header">

                    <div className="mobile-brand">
                        <strong>
                            CareFlow
                        </strong>
                    </div>

                    <div className="patient-header-right">

                        <div className="patient-notification">
                            🔔
                        </div>

                        <div className="patient-header-profile">

                            <div className="patient-avatar">
                                {patientName
                                    .charAt(0)
                                    .toUpperCase()}
                            </div>

                            <div>

                                <strong>
                                    {patientName}
                                </strong>

                                <span>
                                    Patient
                                </span>

                            </div>

                        </div>

                    </div>

                </header>

                <section className="patient-content">

                    {message && (
                        <div className="patient-success">
                            ✓ {message}
                        </div>
                    )}

                    {error && (
                        <div className="patient-error">
                            ⚠ {error}
                        </div>
                    )}

                    {activePage === "dashboard" &&
                        renderDashboard()}

                    {activePage === "book" &&
                        renderBookAppointment()}

                    {activePage === "appointments" &&
                        renderAppointments()}

                    {activePage === "profile" &&
                        renderProfile()}

                </section>

            </main>

        </div>
    );
}

export default PatientDashboard;

