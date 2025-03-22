const mongoose=require("mongoose");
const attendanceSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    timestamp:{
        type:Date,
        default:Date.now
    },
    location: {
        latitude: { type: Number, required: function () { return this.status === 'present'; } },
        longitude: { type: Number, required: function () { return this.status === 'present'; } },
      },
    
    status: { type: String, enum: ["present", "absent"], default: "absent" }

})
const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;
