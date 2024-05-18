import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';

function CreateAppointment() {
    const [name, setName] = useState("");
    const [service, setService] = useState("");
    const [gender, setGender] = useState("");
    const [age, setAge] = useState("");
    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [status, setStatus] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            // Format start time and end time as valid Date objects
            const formattedStartTime = new Date(`${date}T${startTime}`+ ':00');
            const formattedEndTime = new Date(`${date}T${endTime}`+ ':00');
    
            // Ensure status is not empty and is a valid enum value
            const validStatusValues = ["Pending", "Complete", "Cancelled"];
            const formattedStatus = validStatusValues.includes(status) ? status : "Pending";
    
            // Send a POST request to the backend API endpoint to create a new appointment
            const response = await axios.post('http://localhost:3003/createappointment', {
                name,
                service,
                gender,
                age,
                date,
                startTime: formattedStartTime,
                endTime: formattedEndTime,
                status: formattedStatus
            });
    
            // If the appointment is successfully created, navigate back to the homepage
            if (response.status === 201) {
                navigate('/appointments');
            }
        } catch (error) {
            console.error("Error creating appointment:", error);
            // Handle any errors that occur during the creation of the appointment
        }
    };
    
    return (
        <div className="d-flex vh-100 bg-primary justify-content-center align-items-center">
            <ToastContainer />
            <div className="login-box" style={{ width: '400px', margin: 'auto', marginTop: '50px', marginBottom: '50px', paddingRight:'53px'}}>
            <div className="logo-container">
                <form onSubmit={handleSubmit}>
                    <h2 className= "header-text" style={{ textAlign: 'center', marginLeft: '20px'}}>Create Appointment</h2>
                    <div className="mb-2">
                        <label htmlFor="">Name</label>
                        <input
                            type="text"
                            placeholder="Enter Name"
                            className="form-control"
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="mb-2">
                        <label htmlFor="">Service</label>
                        <input
                            type="text"
                            placeholder="Enter Service"
                            className="form-control"
                            onChange={(e) => setService(e.target.value)}
                        />
                    </div>
                    
                    <div className="mb-2">
                        <label htmlFor="">Gender</label>
                        <input
                            type="text"
                            placeholder="Enter Gender"
                            className="form-control"
                            onChange={(e) => setGender(e.target.value)}
                        />
                    </div>

                    <div className="mb-2">
                        <label htmlFor="">Age</label>
                        <input
                            type="text"
                            placeholder="Enter Age"
                            className="form-control"
                            onChange={(e) => setAge(e.target.value)}
                        />
                    </div>

                    <div className="mb-2">
                        <label htmlFor="">Date</label>
                        <input
                            type="date" 
                            placeholder="Enter Date"
                            className="form-control"
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>

                    <div className="mb-2">
                        <label htmlFor="">Start Time</label>
                        <input
                            type="time" 
                            placeholder="Enter Start Time"
                            className="form-control"
                            onChange={(e) => setStartTime(e.target.value)}
                        />
                    </div>

                    <div className="mb-2">
                        <label htmlFor="">End Time</label>
                        <input
                            type="time" 
                            placeholder="Enter End Time"
                            className="form-control"
                            onChange={(e) => setEndTime(e.target.value)}
                        />
                    </div>

                    <div className="mb-2">
                        <label htmlFor="">Status</label>
                        <select
                            className="form-control"
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="Pending">Pending</option>
                            <option value="Complete">Complete</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>

                    <button type="submit" className="login-btn" style={{marginLeft: "100px", marginTop: "10px"}}>Add</button>
                </form>
            </div>
        </div>
        </div>
    );
}

export default CreateAppointment;