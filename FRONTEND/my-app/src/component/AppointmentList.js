import { Link, useParams } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import axios from "axios";
import logo from './Logo.svg';

function AppointmentList() {
    const { id } = useParams()
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const filtered = data.filter(appointment =>
            Object.values(appointment).some(value =>
                typeof value === 'string' && value.toLowerCase().includes(searchQuery.toLowerCase()) ||
                typeof value === 'number' && value.toString().includes(searchQuery)
            )
        );
        setFilteredData(filtered);
    }, [searchQuery, data]);

    const fetchData = () => {
        axios.get('http://localhost:3003/appointments')
            .then(res => {
                const formattedData = res.data.map(appointment => ({
                    ...appointment,
                    date: new Date(appointment.date).toLocaleDateString(),
                    startTime: new Date(appointment.startTime).toLocaleTimeString(),
                    endTime: new Date(appointment.endTime).toLocaleTimeString()
                }));
                setData(formattedData);
                setFilteredData(formattedData);
                setLoading(false);
            })
            .catch(err => {
                setError(err);
                setLoading(false);
            });
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this appointment?")) {
            axios.delete(`http://localhost:3003/deleteappointment/${id}`)
                .then(res => {
                    const updatedData = data.filter(appointment => appointment._id !== id);
                    setData(updatedData);
                    setFilteredData(updatedData);
                    showToast("Appointment successfully deleted");
                })
                .catch(err => console.error(err));
        }
    }

    const showToast = (message) => {
        alert(message); // Replace this with a toast notification library of your choice
    };

    const highlightMatch = (text) => {
        if (typeof text !== 'string') return text;
        const index = text.toLowerCase().indexOf(searchQuery.toLowerCase());
        if (index === -1) return text;
        const beforeMatch = text.slice(0, index);
        const match = text.slice(index, index + searchQuery.length);
        const afterMatch = text.slice(index + searchQuery.length);
        return (
            <>
                {beforeMatch}
                <span style={{ backgroundColor: '#b0e6ff' }}>{match}</span>
                {afterMatch}
            </>
        );
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="dashboard-container">
            <div className="side-nav1">
                <div className="logo-container">
                    <img src={logo} alt="Logo" className="logo" style={{ marginBottom: '30px' }} />
                </div>
                <ul>
                    <li><b><Link to="/dashboard">Dashboard</Link></b></li>
                    <li><b><Link to="/appointments">Appointments</Link></b></li>
                    <li><b><Link to={`/login`}>Logout</Link></b></li>
                </ul>
            </div>
            <div className="d-flex flex-column bg-primary justify-content-center align-items-center" style={{ minHeight: '80vh', marginLeft: '290px' }}>
                <div className="w-65 bg-white rounded p-3 mb-3" style={{ margin: '60px 100px', width: '1000px', marginRight: '35px', marginLeft: '30px', marginTop:'45px'}}>
                    <div className="d-flex justify-content-between align-items-center mb-2" style={{ marginBottom: '15px', marginTop: '-22px' }} >
                        <Link to="/createappointment" className="login-btn" style={{ textDecoration: 'none' }}>
                            <b>Add +</b>
                        </Link>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Search..."
                            className="form-control"
                            style={{ width: '300px', height: '20px', borderColor: '#666666', marginLeft: '10px' }}
                        />
                    </div>

                    <table className="table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Service</th>
                                <th>Gender</th>
                                <th>Age</th>
                                <th>Date</th>
                                <th>Start Time</th>
                                <th>End Time</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.length === 0 && (
                                <tr>
                                    <td colSpan="9" style={{ textAlign: 'center' }}>No matching entries found.</td>
                                </tr>
                            )}
                            {filteredData.map((appointment) => (
                                <tr key={appointment._id}>
                                    <td>{highlightMatch(appointment.name)}</td>
                                    <td>{highlightMatch(appointment.service)}</td>
                                    <td>{highlightMatch(appointment.gender)}</td>
                                    <td>{highlightMatch(appointment.age)}</td>
                                    <td>{highlightMatch(appointment.date)}</td>
                                    <td>{highlightMatch(appointment.startTime)}</td>
                                    <td>{highlightMatch(appointment.endTime)}</td>
                                    <td>{highlightMatch(appointment.status)}</td>
                                    <td>
                                        <div className="d-flex">
                                            <Link to={`/updatebook/${appointment._id}`} className="modify-btn"> Update</Link>
                                            <button onClick={() => handleDelete(appointment._id)} className="del-btn">Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AppointmentList;
