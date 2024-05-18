import React, { useState, useEffect } from "react";
import axios from "axios";

function AppointmentWidget() {
    const [appointmentCount, setAppointmentCount] = useState(0);

    useEffect(() => {
        // Fetch the number of appointments from the database
        axios.get("http://localhost:3003/appointments/count")
            .then(response => {
                setAppointmentCount(response.data.count);
            })
            .catch(error => {
                console.error("Error fetching appointment count:", error);
            });
    }, []);

    return (
        <div className="appointment-widget">
            <div className="card">
            <div className="card-body">
                    <div className="card-content">
                        <h5 className="card-title">Total Appointments</h5>
                        <p className="card-text"><b>{appointmentCount}</b></p>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default AppointmentWidget;
