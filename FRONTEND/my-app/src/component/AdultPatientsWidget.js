import React, { useState, useEffect } from "react";
import axios from "axios";

function AdultPatientsWidget() {
    const [adultPatientsCount, setAdultPatientsCount] = useState(0);

    useEffect(() => {
        // Fetch the number of adult patients from the database
        axios.get("http://localhost:3003/adultpatients/count")
            .then(response => {
                setAdultPatientsCount(response.data.count);
            })
            .catch(error => {
                console.error("Error fetching adult patients count:", error);
            });
    }, []);

    return (
        <div className="patient-widget">
            <div className="card">
                <div className="card-body">
                    <div className="card-content">
                        <h5 className="card-title">Adult Patients</h5>
                        <p className="card-text"><b>{adultPatientsCount}</b></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdultPatientsWidget;
