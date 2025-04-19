const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const leaveRoute = require ("./routes/leaveRoutes");
const attendanceRoute = require('./routes/attendanceRoutes');
const salaryRoute = require('./routes/salaryRoutes');
const meetingRoute = require('./routes/meetingRoutes');
const taskRoute=require('./routes/taskRoutes');
const reportRoutes = require('./routes/reportRoutes')
const app = express();
require("dotenv").config();
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE' ,'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'], 
    credentials: true, 
}));
app.use(express.json());

app.get("/", (req,res)=>{
    res.send("Server is running");
})
app.use("/api/auth", userRoutes);
app.use("/api/leave", leaveRoute);
app.use("/api/att", attendanceRoute);
app.use("/api/salary", salaryRoute);
app.use("/api/meeting", meetingRoute);
app.use("/api/task",taskRoute);
app.use("/api/report",reportRoutes);


mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log("DB connection successful");
    })
    .catch((err) => {
        console.error("MongoDB Connection Error:", err.message);
    });


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
