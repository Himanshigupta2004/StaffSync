const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const JWT_SECRET = "himanshi";
const generateToken = (userId, role) => {
    return jwt.sign({ id: userId, role }, JWT_SECRET, { expiresIn: "7d" });
};

const registerSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    role: Joi.string().valid("hr", "employee").default("employee"),
});

module.exports.register = async (req, res, next) => {
    try {
        const { username, email, password, role } = req.body;
        const { error } = registerSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ status: false, msg: error.details[0].message });
        }
        const usernameCheck = await User.findOne({ username });
        if (usernameCheck) {
            return res.status(400).json({ status: false, msg: "Username already taken" });
        }

        const emailCheck = await User.findOne({ email });
        if (emailCheck) {
            return res.status(400).json({ status: false, msg: "Email already taken" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            email,
            username,
            password: hashedPassword,
            role: role || "employee",
        });

        const token = generateToken(user._id, user.role);
        const userResponse = user.toObject();
        delete userResponse.password;

        return res.status(201).json({ status: true, user: userResponse, token });
    } catch (ex) {
        next(ex);
    }
};

module.exports.login = async (req, res, next) => {
    try {
        const { username, password ,role} = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ status: false, msg: "Incorrect username or password" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ status: false, msg: "Incorrect username or password" });
        }
        if (role && role !== user.role) {
            return res.status(403).json({ status: false, msg: `Access denied for role: ${role}` });
        }

        const token = generateToken(user._id, user.role);
        const userResponse = user.toObject();
        delete userResponse.password;

        return res.status(200).json({ status: true, user: userResponse, token });

        return res.status(200).json({ status: true, user: userResponse, token });
    } catch (ex) {
        next(ex);
    }
};


module.exports.HandleToGetUsers = async (req, res, next) => {
    try {
        const employees = await User.find({ role: 'employee' });
    
        if (!employees.length) {
          return res.status(404).json({ message: "No employees found" });
        }
    
        return res.status(200).json(employees);
      } catch (error) {
        console.error("Error fetching employees:", error);
        res.status(500).json({ message: "Error fetching employees" });
      }
};

module.exports.logout = async (req, res, next) => {
    try {
        res.status(200).json({ status: true, msg: 'Logged out successfully' });
    } catch (ex) {
        next(ex);
    }
};
