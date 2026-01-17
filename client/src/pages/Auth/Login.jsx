import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import "./Auth.css";


export default function Login() {
    const baseUrl = "http://localhost:3000/users"

    const navigate = useNavigate();
    const { setCurrentUser } = useUser();

    const [formData, setFormData] = useState({
        username: "",
        password: ""
    })
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const username = formData.username;
        const password = formData.password;

        try {
            const res = await axios.get(`${baseUrl}?username=${username}`);

            if (res.data.length > 0) {
                if (res.data[0].website === password) {
                    setMessage("Login successful");

                    setCurrentUser(res.data[0]);

                    navigate(`/home`);
                }
                else {
                    setMessage("The username or password is incorrect, please try again.");
                }
            }
            else {
                setMessage("The username or password is incorrect, please try again.");
            }

        }
        catch (err) {
            setMessage("Error logging in");
        }
        finally {
            setIsLoading(false);
            setFormData({
                username: "",
                password: "",
            });
            setTimeout(() => {
                setMessage("");
            }, 3000);
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-side">
                <div className="auth-side-content">
                    <h2>Welcome Back</h2>
                    <p>Enter your credentials to access your account</p>
                </div>
            </div>
            <div className="auth-main">
                <div className="auth-card">
                    <h1>Login</h1>
                    <p className="auth-subtitle">Sign in to continue</p>
                    <form className="auth-form" onSubmit={handleSubmit}>
                        <input
                            className="auth-input"
                            name="username"
                            type="text"
                            placeholder="Username"
                            onChange={handleChange}
                            value={formData.username}
                        />
                        <input
                            className="auth-input"
                            name="password"
                            type="password"
                            placeholder="Password"
                            onChange={handleChange}
                            value={formData.password}
                        />
                        <button className="auth-button" type="submit" disabled={isLoading}>
                            {isLoading ? "Logging in..." : "Login"}
                        </button>
                    </form>
                    <div>
                        {message && <p className="status-message">{message}</p>}
                    </div>
                    <p className="auth-footer">Don't have an account? <Link to="/register">Sign up</Link></p>
                </div>
            </div>
        </div>
    )
}