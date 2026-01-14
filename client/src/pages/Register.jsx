import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
        <div className="login">
            <h1>Signup</h1>
            <form onSubmit={handleSubmit}>
                <input name="username" type="text" placeholder="Username" onChange={handleChange} value={formData.username} required />

                <input name="password" type="password" placeholder="Password" onChange={handleChange} value={formData.password} required />
                {passwordError && <p style={{ color: 'red', fontSize: '12px' }}>{passwordError}</p>}

                <input name="verify_password" type="password" placeholder="verify password" onChange={handleChange} value={formData.verify_password} required />

                <button type="submit" disabled={isLoading || passwordError}>
                    {isLoading ? "Signing up..." : "Signup"}
                </button>
            </form>
            <div>
                {message && <p className="status-message">{message}</p>}
            </div>
        </div>
    );
}
