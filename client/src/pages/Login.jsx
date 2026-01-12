import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Login({setCurrentUser}) {

    const navigate = useNavigate();

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
            const res = await axios.get(`http://localhost:3000/users?username=${username}`);

            if (res.data.length > 0) {
                if (res.data[0].website === password) {
                    setMessage("Login successful");
                    localStorage.setItem("currentUser", JSON.stringify(res.data[0]));
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
        <div className="login">
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <input
                    name="username"
                    type="text"
                    placeholder="Username"
                    onChange={handleChange}
                    value={formData.username}
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    onChange={handleChange}
                    value={formData.password}
                />
                <button type="submit" disabled={isLoading}>
                    {isLoading ? "loging in..." : "login"}
                </button>
            </form>
            <div>
                {message && <p className="status-message">{message}</p>}
            </div>
            <p>Don't have an account? <Link to="/register">Sign up</Link></p>
        </div>
    )

}
