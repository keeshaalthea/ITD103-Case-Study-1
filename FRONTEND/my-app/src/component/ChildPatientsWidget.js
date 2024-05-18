import React, { useState, useEffect } from "react";
import axios from "axios";

function ChildPatientsWidget() {
    const [childPatientsCount, setChildPatientsCount] = useState(0);

    useEffect(() => {
        // Fetch the number of child patients from the database
        axios.get("http://localhost:3003/childpatients/count")
            .then(response => {
                setChildPatientsCount(response.data.count);
            })
            .catch(error => {
                console.error("Error fetching child patients count:", error);
            });
    }, []);

    return (
        <div className="patient-widget">
            <div className="card">
                <div className="card-body">
                    <div className="card-content">
                        <h5 className="card-title">Child Patients</h5>
                        <p className="card-text"><b>{childPatientsCount}</b></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChildPatientsWidget;
