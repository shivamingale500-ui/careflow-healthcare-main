import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import "../../styles/auth.css";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const handleLogin = async (event) => {

        event.preventDefault();

        setError("");

        if (!email || !password) {

            setError(
                "Please enter your email and password."
            );

            return;
        }

        try {

            setLoading(true);

            const response =
                await api.post(
                    "/api/auth/login",
                    {
                        email: email,
                        password: password
                    }
                );

            console.log(
                "Login response:",
                response.data
            );

            const token =
                response.data.token;

            const role =
                response.data.role;

            const responseEmail =
                response.data.email ||
                email;

            const fullName =
                response.data.fullName ||
                "";

            localStorage.setItem(
                "token",
                token
            );

            localStorage.setItem(
                "role",
                role
            );

            localStorage.setItem(
                "email",
                responseEmail
            );

            localStorage.setItem(
                "fullName",
                fullName
            );

            if (role === "PATIENT") {

                navigate(
                    "/patient/dashboard"
                );

            } else if (role === "DOCTOR") {

                navigate(
                    "/doctor/dashboard"
                );

            } else if (role === "ADMIN") {

                navigate(
                    "/admin/dashboard"
                );

            } else {

                setError(
                    "Invalid user role."
                );
            }

        } catch (error) {

            console.error(
                "Login error:",
                error
            );

            if (error.response?.status === 401) {

                setError(
                    "Invalid email or password."
                );

            } else {

                setError(
                    error.response?.data ||
                    "Unable to login. Please try again."
                );
            }

        } finally {

            setLoading(false);
        }
    };

    return (

        <div className="auth-page">

            {/* LEFT SIDE */}

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
                        Healthcare made
                        <br />
                        <span>
                            simple and connected.
                        </span>
                    </h1>

                    <p>
                        CareFlow helps patients,
                        doctors and healthcare
                        administrators manage
                        appointments and care
                        efficiently.
                    </p>

                    <div className="auth-features">

                        <div className="auth-feature">

                            <div className="feature-icon">
                                ✓
                            </div>

                            <div>
                                <strong>
                                    Easy Appointment
                                    Management
                                </strong>

                                <span>
                                    Book and manage
                                    your appointments
                                    easily.
                                </span>
                            </div>

                        </div>

                        <div className="auth-feature">

                            <div className="feature-icon">
                                ✓
                            </div>

                            <div>
                                <strong>
                                    Connected Care
                                </strong>

                                <span>
                                    Stay connected with
                                    your healthcare team.
                                </span>
                            </div>

                        </div>

                        <div className="auth-feature">

                            <div className="feature-icon">
                                ✓
                            </div>

                            <div>
                                <strong>
                                    Secure Access
                                </strong>

                                <span>
                                    Your account is
                                    protected with secure
                                    authentication.
                                </span>
                            </div>

                        </div>

                    </div>

                </div>

                <div className="auth-left-footer">
                    © 2026 CareFlow Healthcare
                </div>

            </div>

            {/* RIGHT SIDE */}

            <div className="auth-right">

                <div className="auth-form-container">

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
                            WELCOME BACK
                        </p>

                        <h2>
                            Sign in to your account
                        </h2>

                        <p>
                            Enter your credentials to
                            access your CareFlow dashboard.
                        </p>

                    </div>

                    {error && (

                        <div className="auth-error">
                            <span>⚠</span>

                            <div>
                                {error}
                            </div>
                        </div>

                    )}

                    <form
                        onSubmit={handleLogin}
                        className="auth-form"
                    >

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

                            <div className="auth-label-row">

                                <label>
                                    Password
                                </label>

                            </div>

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
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(event) =>
                                        setPassword(
                                            event.target.value
                                        )
                                    }
                                    autoComplete="current-password"
                                />

                                <button
                                    type="button"
                                    className="auth-password-toggle"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showPassword
                                        ? "Hide"
                                        : "Show"}
                                </button>

                            </div>

                        </div>

                        <button
                            type="submit"
                            className="auth-submit"
                            disabled={loading}
                        >

                            {loading ? (
                                <>
                                    <span className="auth-button-loader"></span>
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <span className="auth-arrow">
                                        →
                                    </span>
                                </>
                            )}

                        </button>

                    </form>

                    <div className="auth-divider">
                        <span>
                            New to CareFlow?
                        </span>
                    </div>

                    <Link
                        to="/register"
                        className="auth-register-button"
                    >
                        Create a Patient Account
                    </Link>

                    <div className="auth-security-note">

                        <span>
                            🔒
                        </span>

                        <p>
                            Your information is protected
                            with secure authentication.
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Login;

