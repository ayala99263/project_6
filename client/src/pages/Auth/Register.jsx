import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Auth.css";

export default function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        verify_password: ""
    });
    const [message, setMessage] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        if (formData.password === "") {
            setPasswordError("");
            return;
        }

        if (formData.password.length < 6) {
            setPasswordError("Password must be at least 6 characters long");
        } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(formData.password)) {
            setPasswordError("Password must contain at least one letter and one number");
        } else {
            setPasswordError("");
        }
    }, [formData.password]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (passwordError) {
            setMessage(passwordError);
            return;
        }
        if (formData.password !== formData.verify_password) {
            setMessage("Passwords do not match");
            return;
        }
        setIsLoading(true);
        try {
            const res = await axios.get(`http://localhost:3000/users?username=${formData.username}`);
            if (res.data.length > 0) {
                setMessage("User already exists, please login");
            } else {
                setMessage("Registration successful");
                navigate('/register/details', { state: { username: formData.username, password: formData.password } });
            }
        } catch (err) {
            setMessage("Registration error");
        } finally {
            setIsLoading(false);
            setTimeout(() => {
                setFormData({ username: "", password: "", verify_password: "" });
                setMessage("");
            }, 3000);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-side">
                <div className="auth-side-content">
                    <h2>Join Us Today</h2>
                    <p>Create an account to get started with our platform</p>
                </div>
            </div>
            <div className="auth-main">
                <div className="auth-card">
                    <h1>Sign Up</h1>
                    <p className="auth-subtitle">Create your account</p>
                    <form className="auth-form" onSubmit={handleSubmit}>
                        <input 
                            className="auth-input"
                            name="username" 
                            type="text" 
                            placeholder="Username" 
                            onChange={handleChange} 
                            value={formData.username} 
                            required 
                        />

                        <input 
                            className="auth-input"
                            name="password" 
                            type="password" 
                            placeholder="Password" 
                            onChange={handleChange} 
                            value={formData.password} 
                            required 
                        />
                        {passwordError && <p className="error-text">{passwordError}</p>}

                        <input 
                            className="auth-input"
                            name="verify_password" 
                            type="password" 
                            placeholder="Verify password" 
                            onChange={handleChange} 
                            value={formData.verify_password} 
                            required 
                        />

                        <button className="auth-button" type="submit" disabled={isLoading || passwordError}>
                            {isLoading ? "Signing up..." : "Sign Up"}
                        </button>
                    </form>
                    <div>
                        {message && <p className="status-message">{message}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
