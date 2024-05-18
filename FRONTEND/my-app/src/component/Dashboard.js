import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from './Logo.svg';
import { Pie } from 'react-chartjs-2';
import AppointmentWidget from "./AppointmentWidget";
import AdultPatientsWidget from "./AdultPatientsWidget";
import ChildPatientsWidget from "./ChildPatientsWidget";
import AppointmentList from "./AppointmentList";
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
Chart.register(ArcElement, Tooltip, Legend);

function Dashboard() {
    const [showAppointments] = useState(false);
    const [serviceData, setServiceData] = useState(null);
    const [genderData, setGenderData] = useState(null);
    const [filteredData, setFilteredData] = useState([]);
    const [data, setData] = useState([]);
    const [appointmentDates, setAppointmentDates] = useState([]);
    const timezoneOffset = -new Date().getTimezoneOffset() * 60000; // Offset in milliseconds

    const isSameDay = (date1, date2) => {
        return (
            date1.getDate() === date2.getDate() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getFullYear() === date2.getFullYear()
        );
    };

    const tileContent = ({ date }) => {
        // Check if the current date has an appointment
        const hasAppointment = appointmentDates.some(appointmentDate => isSameDay(date, new Date(appointmentDate)));
        // Render a red dot if the date has an appointment
        return hasAppointment ? <div className="appointment-dot"></div> : null;
    };

    useEffect(() => {
        // Fetch data from backend APIs
        fetchData();
        fetchAppointmentDates();
    }, []);

    const fetchAppointmentDates = () => {
        // Fetch appointment dates from backend API
        axios.get('http://localhost:3003/appointment-dates')
            .then(response => {
                const dates = response.data.map(dateStr => new Date(new Date(dateStr).getTime() + timezoneOffset));
                setAppointmentDates(dates);
            })
            .catch(error => {
                console.error("Error fetching appointment dates:", error);
            });
    };

    const [date, setDate] = useState(new Date());
    const handleDateChange = (date) => {
        setDate(date);
    };

    const fetchData = () => {
        axios.get('http://localhost:3003/dashboard')
            .then(res => {
                console.log(res.data);
                setData(res.data);
                const dates = res.data.map(appointment => new Date(new Date(appointment.appointment_date).getTime() + timezoneOffset));


                setAppointmentDates(dates);
            })
            .catch(err => console.log(err));
    };

    useEffect(() => {
        // Fetch service data from backend API
        axios.get('http://localhost:3003/services')
            .then(response => {
                setServiceData(response.data);
            })
            .catch(error => {
                console.error("Error fetching service data:", error);
            });
    }, []);

    useEffect(() => {
        // Fetch gender data from backend API
        axios.get('http://localhost:3003/gendercount')
            .then(response => {
                setGenderData(response.data);
            })
            .catch(error => {
                console.error("Error fetching gender data:", error);
            });
    }, []);

    const pieChartGenderData = {
        labels: genderData ? Object.keys(genderData) : [],
        datasets: [
            {
                data: genderData ? Object.values(genderData) : [],
                backgroundColor: [
                    '#223B6E',
                    '#7AC4E7'
                ]
            }
        ]
    };

    const pieChartData = {
        labels: serviceData ? Object.keys(serviceData) : [],
        datasets: [
            {
                data: serviceData ? Object.values(serviceData) : [],
                backgroundColor: [
                    '#223B6E',
                    '#3c5a9a',
                    '#6d86b0',
                    '#b9bed0',
                    '#9AA9E6',
                    '#7182BD',
                    '#d4e2f7',
                    '#0C4767',
                    '#7182BD'
                ]
            }
        ]
    };

    const pieChartOptions = {
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    boxWidth: 15,
                    usePointStyle: true,
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        let label = context.label || '';
                        if (label) {
                            label += ': ';
                        }
                        label += context.raw;
                        return label;
                    }
                }
            }
        },
        layout: {
            padding: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }
        }
    };

    return (
        <div className="dashboard-container">
            <div className="side-nav">
                <div className="logo-container">
                    <img src={logo} alt="Logo" className="logo" style={{ marginBottom: '30px' }} />
                </div>
                <ul>
                    <li><b><Link to="/dashboard">Dashboard</Link></b></li>
                    <li><b><Link to="/appointments">Appointments</Link></b></li>
                    <li><b><Link to={`/login`}>Logout</Link></b></li>
                </ul>
            </div>

            <div className="main-content">
                <div className="typingeffect">
                    <h1>
                        <span style={{ color: '#223B6E' }}>Welcome, </span>
                        <span style={{ color: '#7AC4E7' }}>Dentista!</span>
                        <span className="blinking-cursor">│</span>
                    </h1>
                </div>

                {!showAppointments ? (
                    <div className="widgets-container">
                        <AppointmentWidget />
                        <AdultPatientsWidget />
                        <ChildPatientsWidget />
                    </div>
                ) : (
                    <AppointmentList />
                )}

                <div className="charts-calendar-container">
                <div className="charts-container" style={{ width: '40%', height: '300px', marginLeft: '-30px' }}>
    <h4 style={{ marginTop: '-5px', textAlign: 'center' }}>Services</h4>
    <Pie data={pieChartData} options={pieChartOptions} />
</div>
<div className="charts-container" style={{ width: '38.5%', height: '300px', marginLeft: '-30px' }}>
    <h4 style={{ marginTop: '-5px', textAlign: 'center' }}>Gender</h4>
    <Pie data={pieChartGenderData} options={pieChartOptions} />
</div>
    <div className="calendar-container" style={{ width: '60%', maxWidth: '320px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
        <h4 style={{ marginTop: '-5px', textAlign: 'center' }}>Calendar</h4>
        <Calendar
            onChange={handleDateChange}
            value={date}
            className="custom-calendar"
            tileClassName="custom-tile"
            tileContent={tileContent}
        />
    </div>
</div>
            </div>
        </div>
    );
}

export default Dashboard;