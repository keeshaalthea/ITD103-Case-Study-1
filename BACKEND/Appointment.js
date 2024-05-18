    const mongoose = require('mongoose');

    const AppointmentSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        service: {
            type: String,
            required: true
        },
        gender: {
            type: String,
            required: true
        },
        age: { 
            type: Number,
            required: true
        },
        date: {
            type: Date,
            required: true
        },
        startTime: {
            type: Date,
            required: true
        },
        endTime: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            enum: ['Pending', 'Complete', 'Cancelled'],
            default: 'Pending'
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    });

    const AppointmentModel = mongoose.model("appointment", AppointmentSchema);

    module.exports = AppointmentModel;
