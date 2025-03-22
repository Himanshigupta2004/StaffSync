const Leave = require("../model/leaveModel.js");
const userModel = require("../model/userModel.js");
const User = require("../model/userModel.js");
const jwt = require('jsonwebtoken');

module.exports.ApplyLeave = async (req, res, next) => {
    try {
        const { startDate, endDate, leaveReason } = req.body;

        if (!startDate || !endDate || !leaveReason) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }

        if (isNaN(new Date(startDate)) || isNaN(new Date(endDate))) {
            return res.status(400).json({ message: "Invalid date format" });
        }

        if (new Date(endDate) <= new Date(startDate)) {
            return res.status(400).json({ message: "End date must be after start date" });
        }

        // console.log(req.user.id);
        const id = req.user.id;
        const employee = await User.findById(id);
        // console.log(user);
        if (!employee) {
            return res.status(404).json({ message: "User not found" });
        }


        const existingLeaveuser=await Leave.findOne({user : id,startDate: { $lte: new Date(endDate) }, 
        endDate: { $gte: new Date(startDate) }});
        

        if(existingLeaveuser){
            return res.status(400).json("you have already apply 1 leave !!!");
        }
        

       
        const leave = await Leave.create({
            user: req.user.id,
            startDate,
            endDate,
            leaveReason,
        });

        
        res.status(201).json({
            message: "Leave application submitted successfully",
            leave,
        });
    } catch (error) {
       
        console.error("Error in ApplyLeave:", error);
        res.status(500).json({ message: "An error occurred while applying for leave" });
        next(error); 
    }
};

module.exports.approveLeave = async (req, res, next) => {
    try {
      
      const leaveId = req.params.leaveId;  

      const leaverequest = await Leave.findById(leaveId);
      

      if (!leaverequest) {
        return res.status(404).json({ message: "Leave request not found" });
      }
  

      const id = req.user.id; 
      const employee = await User.findById(id);
      if (!employee) {
        return res.status(404).json({ message: "User not found" });
      }
  
      
      if (employee.role !== "hr") {
        return res.status(403).json({ message: "You are not authorized to approve leave" });
      }
  
      if (leaverequest.status === "approved") {
        return res.status(400).json({ message: "Leave is already approved" });
      }
  
      if (leaverequest.status === "rejected") {
        return res.status(400).json({ message: "Leave is already rejected" });
      }
  
      
      leaverequest.status = "approved";
      await leaverequest.save(); 
  
      
      return res.status(200).json({
        message: "Leave approved successfully",
        leave: leaverequest
      });
  
    } catch (error) {
     
      console.error("Error in approving leave:", error);
      return res.status(500).json({ message: "An error occurred while approving leave" });
    }
  };



  //rejecting leave
  
module.exports.rejectLeave = async (req, res, next) => {
    try {
      
      const leaveId = req.params.leaveId;  

      const leaverequest = await Leave.findById(leaveId);
      

      if (!leaverequest) {
        return res.status(404).json({ message: "Leave request not found" });
      }
  

      const id = req.user.id; 
      const employee = await User.findById(id);
      if (!employee) {
        return res.status(404).json({ message: "User not found" });
      }
  
      
      if (employee.role !== "hr") {
        return res.status(403).json({ message: "You are not authorized to approve leave" });
      }
  
      if (leaverequest.status === "approved") {
        return res.status(400).json({ message: "Leave is already approved" });
      }
  
      if (leaverequest.status === "rejected") {
        return res.status(400).json({ message: "Leave is already rejected" });
      }
  
      
      leaverequest.status = "rejected";
      await leaverequest.save(); 
  
      
      return res.status(200).json({
        message: "Leave rejected successfully",
        leave: leaverequest
      });
  
    } catch (error) {
     
      console.error("Error in rejecting leave:", error);
      return res.status(500).json({ message: "An error occurred while rejecting leave" });
    }
  };
  


  //get all leaves
  exports.getLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find().populate('user','username');
        return res.status(200).json(leaves);
        }
         catch (error) {
            console.error("Error in getting leaves:", error);
            return res.status(500).json({ message: "An error occurred while getting leaves" });
        }
    };
    
module.exports.getmyleaves = async (req, res) => {
  try {
      const employeeId = req.user.id; 
      const leaves = await Leave.find({ user: employeeId }); 

      if (!leaves || leaves.length === 0) {
          return res.status(404).json({ message: "No leaves found for this employee" });
      }

      return res.status(200).json(leaves);
  } catch (error) {
      console.error("Error fetching leaves:", error);
      return res.status(500).json({ message: "An error occurred while fetching leaves" });
  }
};
