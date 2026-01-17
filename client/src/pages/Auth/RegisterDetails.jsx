import axios from 'axios';
import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";

import "./Auth.css";

export default function RegisterDetails() {
    const baseUrl = "http://localhost:3000/users"

    const location = useLocation();
    const navigate = useNavigate();
    const { setCurrentUser } = useUser();


    const userData = location.state;
    useEffect(() => {
        if (!userData) {
            setTimeout(() => {
                navigate("/register");
            }, 1000);
        }
    }, [userData, navigate]);

    if (!userData) {
        return <p>Redirecting to registration...</p>;
    }

    const { username, password } = userData;
    const [formData, setFormData] = useState({
        name: "",
        username: username,
        email: "",
        address: {
            street: "",
            number: "",
            city: ""
        },
        phone: "",
        website: password,
        company: {
            name: "",
            catchPhrase: "",
            bs: ""
        }
    })

    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("")

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.includes(".")) {
            const [parent, child] = name.split(".");
            setFormData((prev) => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        if (!formData.address.street.trim()) newErrors['address.street'] = "Street is required";
        if (!formData.address.number.trim()) newErrors['address.number'] = "Number is required";
        if (!formData.address.city.trim()) newErrors['address.city'] = "City is required";
        if (!formData.phone.trim()) newErrors.phone = "Phone is required";
        if (!formData.company.name.trim()) newErrors['company.name'] = "Company name is required";

        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Invalid email format";
        }

        if (formData.phone && !/^[\d\-\+\(\)\s]+$/.test(formData.phone)) {
            newErrors.phone = "Invalid phone format";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            try {
                const res = await axios.post(baseUrl, formData);
                setCurrentUser(res.data);
                navigate(`/home`);
            }
            catch (err) {
                setServerError(err);
            }

        }
    }

    return (
        <div className="auth-container">
            <div className="auth-side">
                <div className="auth-side-content">
                    <h2>Almost There</h2>
                    <p>Complete your profile to finish registration</p>
                </div>
            </div>
            <div className="auth-main">
                <div className="auth-card" style={{ maxWidth: '520px' }}>
                    <h1>Complete Registration</h1>
                    <p className="auth-subtitle">Fill in your details</p>
                    <form className="auth-form" onSubmit={handleSubmit}>
                        <input
                            className="auth-input"
                            name="name"
                            type="text"
                            placeholder="Full Name"
                            onChange={handleChange}
                            value={formData.name}
                            style={{ borderColor: errors.name ? '#ef4444' : '' }}
                        />
                        {errors.name && <span className="error-text">{errors.name}</span>}

                        <input
                            className="auth-input"
                            name="email"
                            type="email"
                            placeholder="Email"
                            onChange={handleChange}
                            value={formData.email}
                            style={{ borderColor: errors.email ? '#ef4444' : '' }}
                        />
                        {errors.email && <span className="error-text">{errors.email}</span>}

                        <input
                            className="auth-input"
                            name="phone"
                            type="tel"
                            placeholder="Phone"
                            onChange={handleChange}
                            value={formData.phone}
                            style={{ borderColor: errors.phone ? '#ef4444' : '' }}
                        />
                        {errors.phone && <span className="error-text">{errors.phone}</span>}

                        <p className="form-section-title">Address</p>
                        <input
                            className="auth-input"
                            name="address.street"
                            type="text"
                            placeholder="Street"
                            onChange={handleChange}
                            value={formData.address.street}
                            style={{ borderColor: errors['address.street'] ? '#ef4444' : '' }}
                        />
                        {errors['address.street'] && <span className="error-text">{errors['address.street']}</span>}

                        <div className="form-row">
                            <div>
                                <input
                                    className="auth-input"
                                    name="address.number"
                                    type="text"
                                    placeholder="Number"
                                    onChange={handleChange}
                                    value={formData.address.number}
                                    style={{ borderColor: errors['address.number'] ? '#ef4444' : '' }}
                                />
                                {errors['address.number'] && <span className="error-text">{errors['address.number']}</span>}
                            </div>
                            <div>
                                <input
                                    className="auth-input"
                                    name="address.city"
                                    type="text"
                                    placeholder="City"
                                    onChange={handleChange}
                                    value={formData.address.city}
                                    style={{ borderColor: errors['address.city'] ? '#ef4444' : '' }}
                                />
                                {errors['address.city'] && <span className="error-text">{errors['address.city']}</span>}
                            </div>
                        </div>

                        <p className="form-section-title">Company (Optional)</p>
                        <input
                            className="auth-input"
                            name="company.name"
                            type="text"
                            placeholder="Company Name"
                            onChange={handleChange}
                            value={formData.company.name}
                            style={{ borderColor: errors['company.name'] ? '#ef4444' : '' }}
                        />
                        {errors['company.name'] && <span className="error-text">{errors['company.name']}</span>}

                        <input
                            className="auth-input"
                            name="company.catchPhrase"
                            type="text"
                            placeholder="Company Catch Phrase"
                            onChange={handleChange}
                            value={formData.company.catchPhrase}
                        />

                        <input
                            className="auth-input"
                            name="company.bs"
                            type="text"
                            placeholder="Company BS"
                            onChange={handleChange}
                            value={formData.company.bs}
                        />

                        <button className="auth-button" type='submit'>Complete Registration</button>
                    </form>
                    {serverError && <p className="error-text" style={{ textAlign: 'center', marginTop: '16px' }}>{serverError}</p>}
                </div>
            </div>
        </div>
    )
}