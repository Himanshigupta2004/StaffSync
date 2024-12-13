const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  month: {
    type: Number,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  presentDays: {
    type: Number,
    default: 0
  },
  absentDays: {
    type: Number,
    default: 0
  },
  baseSalary: {
    type: Number,
    required: true
  },
  bonus: {
    type: Number,
    default: 0
  },
  extraHours: {
    type: Number,
    default: 0
  },
  extraHoursRate: {
    type: Number,
    default: 200  
  },
  totalSalary: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'paid'],
    default: 'pending'
  }
}, { timestamps: true });


salarySchema.methods.calculateSalary = function(presentCount, absentCount, extraHoursWorked,bonus,baseSalary) {
  const dailyRate = baseSalary / 30; 

  const extraHoursPay = extraHoursWorked * this.extraHoursRate;

  this.presentDays = presentCount;
  this.absentDays = absentCount;
  this.bonus = bonus;
  this.extraHours = extraHoursWorked;
  this.totalSalary = (presentCount * dailyRate) + bonus + extraHoursPay;

  return this.save();
};

module.exports = mongoose.model('Salary', salarySchema);
