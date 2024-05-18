import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { format } from 'date-fns';
import { toast, ToastContainer } from 'react-toastify';

function UpdateAppointment() {
    const { id } = useParams();

    const [name, setName] = useState("");
    const [service, setService] = useState("");
    const [gender, setGender] = useState("");
    const [age, setAge] = useState("");
    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [status, setStatus] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:3003/getappointment/id/" + id);
                console.log(response);
                const appointmentData = response.data;
                setName(appointmentData.name);
                setService(appointmentData.service);
                setGender(appointmentData.gender);
                setAge(appointmentData.age);
                setDate(format(new Date(appointmentData.date), 'yyyy-MM-dd'));
                setStartTime(format(new Date(appointmentData.startTime), 'HH:mm'));
                setEndTime(format(new Date(appointmentData.endTime), 'HH:mm'));
                setStatus(appointmentData.status);
            } catch (err) {
                console.log(err);
            }
        };
        fetchData();
    }, [id]);

    const navigate = useNavigate();

    const handleUpdate = (e) => {
        e.preventDefault();
    
        // Parse startTime and endTime strings into Date objects
        const startTimeDate = new Date(date + 'T' + startTime + ':00');
        const endTimeDate = new Date(date + 'T' + endTime + ':00');
    
        axios.put('http://localhost:3003/updatebook/' + id, { name, service, gender, age, date, startTime: startTimeDate, endTime: endTimeDate, status })
            .then(res => {
                console.log(res);
                navigate('/appointments'); // Redirect to the appointments route
            })
            .catch(err => console.log(err));
    };
    

    return (
        <div className="d-flex vh-100 bg-primary justify-content-center align-items-center">
            <ToastContainer />
<div className="login-box" style={{ width: '400px', margin: 'auto', marginTop: '50px', marginBottom: '50px', paddingRight:'53px'}}>
            <div className="logo-container">
                <form onSubmit={handleUpdate}>
                    <h2 className= "header-text" style={{ textAlign: 'center', marginLeft: '20px'}}>Update Appointment</h2>
                    <div className="mb-2">
                        <label htmlFor="">Name</label>
                        <input
                            type="text"
                            placeholder="Enter Name"
                            className="form-control"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="mb-2">
                        <label htmlFor="">Service</label>
                        <input
                            type="text"
                            placeholder="Enter Service"
                            className="form-control"
                            value={service}
                            onChange={(e) => setService(e.target.value)}
                        />
                    </div>

                    <div className="mb-2">
                        <label htmlFor="">Gender</label>
                        <input
                            type="text"
                            placeholder="Enter Gender"
                            className="form-control"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                        />
                    </div>

                    <div className="mb-2">
                        <label htmlFor="">Age</label>
                        <input
                            type="text"
                            placeholder="Enter Age"
                            className="form-control"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                        />
                    </div>

                    <div className="mb-2">
                        <label htmlFor="">Date</label>
                        <input
                            type="date"
                            placeholder="Enter Date"
                            className="form-control"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>

                    <div className="mb-2">
                        <label htmlFor="">Start Time</label>
                        <input
                            type="time"
                            placeholder="Enter Start Time"
                            className="form-control"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                        />
                    </div>

                    <div className="mb-2">
                        <label htmlFor="">End Time</label>
                        <input
                            type="time"
                            placeholder="Enter End Time"
                            className="form-control"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                        />
                    </div>

                    <div className="mb-2">
                        <label htmlFor="">Status</label>
                        <select
                            className="form-control"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="Pending">Pending</option>
                            <option value="Complete">Complete</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>

                    <button type="submit" className="login-btn" style={{marginLeft: "100px", marginTop: "10px"}}>Update</button>
                </form>
            </div>
        </div>
</div>
    );
}

export default UpdateAppointment;
