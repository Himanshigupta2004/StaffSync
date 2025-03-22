const { register, login , HandleToGetUsers,logout} = require("../controllers/userControllers");
const authMiddleware = require('../middleware/authMiddleware');
const router = require("express").Router();
router.get('/protected-route', authMiddleware, (req, res) => {
    res.status(200).json({ msg: "You have accessed a protected route!", user: req.user });
});
router.post("/register", register);
router.post("/login", login);
router.get('/allusers',authMiddleware(['hr']),HandleToGetUsers);
router.get('/logout',logout);
module.exports = router;