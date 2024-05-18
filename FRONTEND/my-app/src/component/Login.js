import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from './Logo.svg';

function Login() {
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
    
        try {
            const response = await axios.post('http://localhost:3003/login', { email, password });
            // eslint-disable-next-line
            const userId = response.data.userId;
            navigate(`/dashboard`);
        } catch (error) {
            console.error('Error during login:', error);
            toast.error("Invalid email or password", {
                position: "top-center",
                autoClose: 5000, // milliseconds
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };
    
    return (
        <div className="login-container">
            <ToastContainer />
            <div className="login-box">
            <div className="logo-container">
                <img src= {logo} alt="Logo" className="logo" />
            </div>
                <h2 className="login-heading">Log in</h2>
                {error && <div className="error">{error}</div>}
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter Email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter Password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <p className="signup-link">Don't have an account? <Link to="/signup" className="signup">Sign Up</Link></p>
                    <button type="submit" className="login-btn">Login</button>
                </form>
            </div>
        </div>
    );
}

export default Login;
