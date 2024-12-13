const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users', 
            required: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
            validate: {
                validator: function (value) {
                    return value > this.startDate; 
                },
                message: "End date must be after the start date",
            },
        },
        leaveReason: {
            type: String,
            enum: {
                values: ["personal reason", "emergency", "sick"],
                message: '{VALUE} is not a valid leave reason',
            },
        },
        status:{
            type: String,
            enum:["pending","approved","rejected"],
            default:"pending",
            
        },
        numberOfDays: {
            type: Number,
        },
    },
    {
        timestamps: true,
    }
);

leaveSchema.pre('save', function (next) {
    const oneDay = 24 * 60 * 60 * 1000; 
    this.numberOfDays = Math.round(
        Math.abs((this.endDate - this.startDate) / oneDay)
    );
    next();
});

module.exports = mongoose.model("leaves", leaveSchema);
