import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import "../../styles/auth.css";

function Register() {

    const navigate = useNavigate();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");

    const handleRegister = async (event) => {

        event.preventDefault();

        setMessage("");
        setError("");

        if (
            !fullName ||
            !email ||
            !password ||
            !phone
        ) {
            setError(
                "Please fill in all required fields."
            );

            return;
        }

        try {

            setLoading(true);

            const response =
                await api.post(
                    "/api/auth/register",
                    {
                        fullName: fullName,
                        email: email,
                        password: password,
                        phone: phone
                    }
                );

            console.log(
                "Registration response:",
                response.data
            );

            setMessage(
                "Registration successful! Redirecting to login..."
            );

            setFullName("");
            setEmail("");
            setPassword("");
            setPhone("");

            setTimeout(() => {

                navigate("/login");

            }, 1500);

        } catch (error) {

            console.error(
                "Registration error:",
                error
            );

            setError(
                error.response?.data ||
                "Unable to create account. Please try again."
            );

        } finally {

            setLoading(false);
        }
    };

    return (

        <div className="auth-page">

            {/* =====================================
                LEFT SIDE
            ====================================== */}

            <div className="auth-left">

                <div className="auth-brand">

                    <div className="auth-brand-icon">
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

                <div className="auth-hero">

                    <div className="auth-hero-icon">
                        ♥
                    </div>

                    <h1>
                        Your health,
                        <br />
                        <span>
                            our priority.
                        </span>
                    </h1>

                    <p>
                        Create your CareFlow account
                        and take control of your
                        healthcare appointments.
                    </p>

                    <div className="auth-features">

                        <div className="auth-feature">

                            <div className="feature-icon">
                                ✓
                            </div>

                            <div>

                                <strong>
                                    Find Doctors
                                </strong>

                                <span>
                                    Browse doctors by
                                    department and
                                    specialization.
                                </span>

                            </div>

                        </div>

                        <div className="auth-feature">

                            <div className="feature-icon">
                                ✓
                            </div>

                            <div>

                                <strong>
                                    Book Appointments
                                </strong>

                                <span>
                                    Schedule healthcare
                                    appointments at your
                                    convenience.
                                </span>

                            </div>

                        </div>

                        <div className="auth-feature">

                            <div className="feature-icon">
                                ✓
                            </div>

                            <div>

                                <strong>
                                    Track Your Care
                                </strong>

                                <span>
                                    Manage and monitor
                                    your appointment
                                    status.
                                </span>

                            </div>

                        </div>

                    </div>

                </div>

                <div className="auth-left-footer">
                    © 2026 CareFlow Healthcare
                </div>

            </div>

            {/* =====================================
                RIGHT SIDE
            ====================================== */}

            <div className="auth-right">

                <div className="auth-form-container register-container">

                    <div className="auth-mobile-brand">

                        <div className="auth-brand-icon">
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

                    <div className="auth-form-header">

                        <p className="auth-small-title">
                            GET STARTED
                        </p>

                        <h2>
                            Create your account
                        </h2>

                        <p>
                            Register as a patient to
                            access CareFlow healthcare
                            services.
                        </p>

                    </div>

                    {error && (

                        <div className="auth-error">

                            <span>
                                ⚠
                            </span>

                            <div>
                                {error}
                            </div>

                        </div>

                    )}

                    {message && (

                        <div className="auth-success">

                            <span>
                                ✓
                            </span>

                            <div>
                                {message}
                            </div>

                        </div>

                    )}

                    <form
                        onSubmit={handleRegister}
                        className="auth-form"
                    >

                        <div className="auth-form-group">

                            <label>
                                Full Name
                            </label>

                            <div className="auth-input-wrapper">

                                <span className="auth-input-icon">
                                    ◉
                                </span>

                                <input
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={fullName}
                                    onChange={(event) =>
                                        setFullName(
                                            event.target.value
                                        )
                                    }
                                    autoComplete="name"
                                />

                            </div>

                        </div>

                        <div className="auth-form-group">

                            <label>
                                Email Address
                            </label>

                            <div className="auth-input-wrapper">

                                <span className="auth-input-icon">
                                    @
                                </span>

                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(
                                            event.target.value
                                        )
                                    }
                                    autoComplete="email"
                                />

                            </div>

                        </div>

                        <div className="auth-form-group">

                            <label>
                                Phone Number
                            </label>

                            <div className="auth-input-wrapper">

                                <span className="auth-input-icon">
                                    ☎
                                </span>

                                <input
                                    type="tel"
                                    placeholder="Enter your phone number"
                                    value={phone}
                                    onChange={(event) =>
                                        setPhone(
                                            event.target.value
                                        )
                                    }
                                    autoComplete="tel"
                                />

                            </div>

                        </div>

                        <div className="auth-form-group">

                            <label>
                                Password
                            </label>

                            <div className="auth-input-wrapper">

                                <span className="auth-input-icon">
                                    •
                                </span>

                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Create a password"
                                    value={password}
                                    onChange={(event) =>
                                        setPassword(
                                            event.target.value
                                        )
                                    }
                                    autoComplete="new-password"
                                />

                                <button
                                    type="button"
                                    className="auth-password-toggle"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                >
                                    {showPassword
                                        ? "Hide"
                                        : "Show"}
                                </button>

                            </div>

                        </div>

                        <div className="auth-terms">

                            <span>
                                🔒
                            </span>

                            <p>
                                Your account information
                                will be securely stored
                                and protected.
                            </p>

                        </div>

                        <button
                            type="submit"
                            className="auth-submit"
                            disabled={loading}
                        >

                            {loading ? (

                                <>
                                    <span className="auth-button-loader"></span>

                                    Creating Account...
                                </>

                            ) : (

                                <>
                                    Create Account

                                    <span className="auth-arrow">
                                        →
                                    </span>
                                </>

                            )}

                        </button>

                    </form>

                    <div className="auth-divider">
                        <span>
                            Already have an account?
                        </span>
                    </div>

                    <Link
                        to="/login"
                        className="auth-register-button"
                    >
                        Sign In
                    </Link>

                </div>

            </div>

        </div>
    );
}

export default Register;


