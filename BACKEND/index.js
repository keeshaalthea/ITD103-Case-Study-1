const express = require('express');
const mongoose = require('mongoose');
const UserModel = require('./User');
const AppointmentModel = require('./Appointment');
const cors = require('cors');


const app = express();
const port = 3003;
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/cstudy1',{
    useNewUrlParser: true,
    useUnifiedTopology:true
})
.then(db=>console.log('DB is connected'))
.catch(err=> console.log(err));

app.get('/', (req, res)=>{
    AppointmentModel.find()
        .then(appointments=> res.json(appointments))
        .catch(err=> console.json(err))
});

app.get('/user/:id', (req, res)=>{
    const id = req.params.id;
    UserModel.findOne({_id: id})
        .then(user=> res.json(user))
        .catch(err=> res.json(err))
});

app.post('/login', async (req, res) => {
    const {email, password } = req.body;

    try {
        // Find user by name and email
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        // Check if the user's password matches the provided password
        if (user.password !== password) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // If all checks pass, login is successful
        res.status(200).json({ message: "Login successful", userId: user._id });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "An error occurred during login" });
    }
});


app.post('/signup', (req, res) => {
    UserModel.create(req.body)
        .then(user => {
            console.log("User created successfully:", user);
            res.json(user);
        })
        .catch(err => {
            console.error("Error creating user:", err);
            res.status(500).json({ error: "Failed to create user" });
        });
});

// update user
app.put('/updateuser/:id', (req, res) => {
    const id = req.params.id;
    const updateFields = {};

    // Check if each field is present in the request body and add it to the update object if so
    if (req.body.name) updateFields.name = req.body.name;
    if (req.body.email) updateFields.email = req.body.email;
    if (req.body.password) updateFields.password = req.body.password;

    // Update the user with the provided fields
    UserModel.findByIdAndUpdate({ _id: id }, updateFields, { new: true })
        .then(updatedUser => {
            if (!updatedUser) {
                return res.status(404).json({ message: "User not found" });
            }
            res.json(updatedUser);
        })
        .catch(err => {
            console.error("Error updating user:", err);
            res.status(500).json({ error: "Failed to update user" });
        });
});

// delete user 
app.delete('/deleteuser/:id', (req, res) => {
    const id = req.params.id;
    UserModel.findByIdAndDelete({ _id: id })
        .then(response => res.json(response))
        .catch(err => res.json(err));
});

// get name using id
app.get('/getname/:id', (req, res) => {
    const id = req.params.id;
    UserModel.findById({ _id: id })
        .then(user => {
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            const name = user.name; // Assuming the field containing the name is 'name'
            res.json({ name });
        })
        .catch(err => console.log(err));
});


//appointments****************************************

app.get('/appointments', async (req, res) => {
    try {
        // Fetch all appointments from the database
        const appointments = await AppointmentModel.find();
        res.json(appointments); // Send the fetched appointments as JSON response
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ error: "An error occurred while fetching appointments" });
    }
});

// get appointment by name
app.get('/getappointment/name/:name', (req, res) => {
    const name = req.params.name;
    AppointmentModel.find({ name: name })
        .then(appointments => res.json(appointments))
        .catch(err => console.log(err));
});

app.get('/getappointment/id/:id', (req, res) => {
    const id = req.params.id;
    AppointmentModel.findById(id)
        .then(appointment => {
            if (!appointment) {
                return res.status(404).json({ message: "Appointment not found" });
            }
            res.json(appointment);
        })
        .catch(err => res.status(500).json({ error: err.message }));
});


app.delete('/deleteappointment/:id', (req, res) => {
    const id = req.params.id;
    AppointmentModel.findByIdAndDelete(id) // Corrected parameter passed to findByIdAndDelete
        .then(response => res.json(response))
        .catch(err => res.json(err));
});



app.post('/createappointment', async (req, res) => {
    const { name, service, gender, age, date, startTime, endTime, status } = req.body;

    // Convert start time and end time to Date objects
    const newStartTime = new Date(startTime);
    const newEndTime = new Date(endTime);

    // Validate end time is not earlier than start time
    if (newEndTime <= newStartTime) {
        return res.status(400).json({ message: "End time cannot be earlier than or equal to start time." });
    }

    try {
        // Check for time conflicts
        const existingAppointments = await AppointmentModel.find({ date });
        const conflict = existingAppointments.some(appointment => {
            const appointmentStartTime = new Date(appointment.startTime);
            const appointmentEndTime = new Date(appointment.endTime);

            return (
                (newStartTime >= appointmentStartTime && newStartTime < appointmentEndTime) ||
                (newEndTime > appointmentStartTime && newEndTime <= appointmentEndTime) ||
                (newStartTime <= appointmentStartTime && newEndTime >= appointmentEndTime)
            );
        });

        if (conflict) {
            return res.status(400).json({ message: "Time conflict detected. Please choose different time slots." });
        }

        // Create the new appointment
        const appointment = await AppointmentModel.create({ name, service, gender, age, date, startTime: newStartTime, endTime: newEndTime, status });
        res.status(201).json(appointment);
    } catch (error) {
        console.error("Error creating appointment:", error);
        res.status(500).json({ error: "Failed to create appointment" });
    }
});



// Update appointment
// Update appointment
// Update appointment
app.put('/updatebook/:id', async (req, res) => {
    const id = req.params.id;

    try {
        // Find the existing appointment
        const existingAppointment = await AppointmentModel.findById(id);

        // If the appointment doesn't exist, return a 404 error
        if (!existingAppointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        // Check for time conflicts
        const { startTime, endTime } = req.body;

        if (startTime && endTime) {
            // Validate end time is not earlier than start time
            if (new Date(endTime) <= new Date(startTime)) {
                return res.status(400).json({ message: "End time cannot be earlier than or equal to start time." });
            }

            // Find appointments for the same date and check for conflicts
            const conflictingAppointments = await AppointmentModel.find({
                date: existingAppointment.date,
                _id: { $ne: id }, // Exclude the current appointment from the search
                $or: [
                    { $and: [{ startTime: { $lt: endTime } }, { endTime: { $gt: startTime } }] },
                    { $and: [{ startTime: { $gte: startTime, $lt: endTime } }] },
                    { $and: [{ endTime: { $gt: startTime, $lte: endTime } }] }
                ]
            });

            if (conflictingAppointments.length > 0) {
                return res.status(400).json({ message: "Time conflict detected. Please choose different time slots." });
            }
        }

        // Update the appointment
        const updatedAppointment = await AppointmentModel.findByIdAndUpdate(id, req.body, { new: true });

        // If the appointment is updated successfully, return the updated appointment
        res.json(updatedAppointment);
    } catch (err) {
        console.error("Error updating appointment:", err);
        res.status(500).json({ error: "Failed to update appointment" });
    }
});

// Backend route to get the count of appointments
app.get('/appointments/count', async (req, res) => {
    try {
        // Count the appointments and send the count as a response
        const count = await AppointmentModel.countDocuments({});
        res.json({ count });
    } catch (err) {
        console.error("Error counting appointments:", err);
        res.status(500).json({ error: "An error occurred while counting appointments" });
    }
});

// Backend route to get the count of child patients (ages 17 and below)
app.get('/childpatients/count', (req, res) => {
    // Count appointments with ages 17 and below
    AppointmentModel.countDocuments({ age: { $lte: 17 } })
        .then(count => {
            res.json({ count });
        })
        .catch(err => {
            console.error("Error counting child patients:", err);
            res.status(500).json({ error: "An error occurred while counting child patients" });
        });
});

// Backend route to get the count of adult patients (ages 18 and above)
app.get('/adultpatients/count', (req, res) => {
    // Count appointments with ages 18 and above
    AppointmentModel.countDocuments({ age: { $gte: 18 } })
        .then(count => {
            res.json({ count });
        })
        .catch(err => {
            console.error("Error counting adult patients:", err);
            res.status(500).json({ error: "An error occurred while counting adult patients" });
        });
});


// Backend route to get the count of appointments for each service
app.get('/services', async (req, res) => {
    try {
        // Aggregate appointments by service and count the appointments for each service
        const serviceCounts = await AppointmentModel.aggregate([
            { $group: { _id: '$service', count: { $sum: 1 } } },
        ]);

        // Format the data to send as response
        const serviceData = {};
        serviceCounts.forEach(service => {
            serviceData[service._id] = service.count;
        });

        // Set Content-Type header to application/json
        res.setHeader('Content-Type', 'application/json');

        // Send JSON response
        res.json(serviceData);
    } catch (error) {
        console.error("Error fetching service data:", error);
        res.status(500).json({ error: "An error occurred while fetching service data" });
    }
});

// Add the new endpoint to get the count of appointments by gender
app.get('/gendercount', async (req, res) => {
    try {
        const genderCounts = await AppointmentModel.aggregate([
            { $group: { _id: '$gender', count: { $sum: 1 } } },
        ]);

        const genderData = {};
        genderCounts.forEach(gender => {
            genderData[gender._id] = gender.count;
        });

        res.json(genderData);
    } catch (error) {
        console.error("Error fetching gender count:", error);
        res.status(500).json({ error: "An error occurred while fetching gender count" });
    }
});

app.get('/appointment-dates', async (req, res) => {
    try {
        // Fetch all appointments from the database
        const appointments = await AppointmentModel.find({}, 'date');

        // Extract date values from appointments
        const appointmentDates = appointments.map(appointment => appointment.date);

        // Send the array of appointment dates as the response
        res.json(appointmentDates);
    } catch (error) {
        // Handle errors
        console.error("Error fetching appointment dates:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port,()=>{
    console.log(`Example app listening on port ${port}`);
});
