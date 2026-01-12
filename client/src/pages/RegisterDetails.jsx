import axios from 'axios';
import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from "react-router-dom";

export default function RegisterDetails({setCurrentUser}) {
    const location = useLocation();
    const navigate = useNavigate();

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
                const res = await axios.post("http://localhost:3000/users", formData);
                localStorage.setItem("currentUser", JSON.stringify(res.data));
                setCurrentUser(res.data)
                navigate(`/home`);
            }
            catch (err) {
                setServerError(err);
            }

        }
    }

    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <input name="name"
                    type="text"
                    placeholder="name"
                    onChange={handleChange}
                    value={formData.name}
                    style={{ borderColor: errors.name ? 'red' : '' }} />
                {errors.name && <span style={{ color: 'red', fontSize: '12px' }}>{errors.name}</span>}

                <input name="email"
                    type="email"
                    placeholder="email"
                    onChange={handleChange}
                    value={formData.email}
                    style={{ borderColor: errors.email ? 'red' : '' }} />
                {errors.email && <span style={{ color: 'red', fontSize: '12px' }}>{errors.email}</span>}
                <p>address</p>
                <input name="address.street"
                    type="text"
                    placeholder="street"
                    onChange={handleChange}
                    value={formData.address.street}
                    style={{ borderColor: errors['address.street'] ? 'red' : '' }} />
                {errors['address.street'] && <span style={{ color: 'red', fontSize: '12px' }}>{errors['address.street']}</span>}

                <input name="address.number"
                    type="text"
                    placeholder="number"
                    onChange={handleChange}
                    value={formData.address.number}
                    style={{ borderColor: errors['address.number'] ? 'red' : '' }} />
                {errors['address.number'] && <span style={{ color: 'red', fontSize: '12px' }}>{errors['address.number']}</span>}

                <input name="address.city"
                    type="text"
                    placeholder="city"
                    onChange={handleChange}
                    value={formData.address.city}
                    style={{ borderColor: errors['address.city'] ? 'red' : '' }} />
                {errors['address.city'] && <span style={{ color: 'red', fontSize: '12px' }}>{errors['address.city']}</span>}
                <input name="phone"
                    type="tel"
                    placeholder="phone"
                    onChange={handleChange}
                    value={formData.phone}
                    style={{ borderColor: errors.phone ? 'red' : '' }} />
                {errors.phone && <span style={{ color: 'red', fontSize: '12px' }}>{errors.phone}</span>}
                <p>company</p>
                <input name="company.name"
                    type="text"
                    placeholder="company name"
                    onChange={handleChange}
                    value={formData.company.name}
                    style={{ borderColor: errors['company.name'] ? 'red' : '' }}
                />
                {errors['company.name'] && <span style={{ color: 'red', fontSize: '12px' }}>{errors['company.name']}</span>}
                <input name="company.catchPhrase"
                    type="text"
                    placeholder="company catchPhrase"
                    onChange={handleChange}
                    value={formData.company.catchPhrase}
                />
                <input name="company.bs"
                    type="text"
                    placeholder="company bs"
                    onChange={handleChange}
                    value={formData.company.bs}
                />
                <button type='submit'>submit</button>



            </form>
            {serverError && <p style={{ color: 'red', fontSize: '12px' }}>{serverError}</p>}


        </div>
    )

}