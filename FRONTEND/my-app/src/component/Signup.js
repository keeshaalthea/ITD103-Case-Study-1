import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from './Logo.svg';

function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3003/signup', { name, email, password })
            .then(res => {
                console.log(res);
                toast.success("Signup successful!"); // Display success toast
                navigate(`/login`);
            })
            .catch(err => {
                console.log(err);
                toast.error("Error occurred during signup!"); // Display error toast
            });
    };

    return (
        <div className="login-container">
            <ToastContainer />
            <div className="login-box">
            <div className="logo-container">
                <img src= {logo} alt="Logo" className="logo"/>
            </div>
                <form onSubmit={handleSubmit} className="login-form">
                    <h2 className="login-heading" style={{marginTop:'-15px'}} >Sign up</h2> 
                    <div className="form-group fonak fonsiltit">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            placeholder="Enter Name"
                            className="form-control"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group fonak fonsiltit">
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
                    <div className="form-group fonak fonsiltit">
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
                    <p className="signup-link">Already have an account? <Link to={`/login`} className="signup-link">Log in</Link></p>
                    <button type="submit" className="login-btn">Submit</button>
                </form>
            </div>
        </div>
    );
}

export default Signup;
