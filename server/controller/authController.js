const { default: mongoose } = require('mongoose');
const UserModel = require('../Modals/userModal')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const registerUser = async (req, res) => {
    // console.log(req.body); 
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPass;
    const newUser = new UserModel(req.body);
    const { email } = req.body;
    try {
        const oldUser = await UserModel.findOne({ email });
        if (oldUser) {
            return res.status(400).json({ message: "User Already Exists" });
        }
        const user = await newUser.save();
        const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWTKEY, { expiresIn: '24h' });
        res.status(200).json({ user, token });
    } catch (e) {
        res.status(500).json({ message: e.message });
        console.log(e);
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({ email });
        if (user) {
            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) {
                return res.status(400).json({ message: "Invalid Password" });
            } else {
                const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWTKEY, { expiresIn: '24h' });
                res.status(200).json({ user, token });
            }
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

const findUser = async (req, res) => {
    const { email } = req.query;
    console.log('Received request for email:', email);  // Add this for debugging
    try {
        const emailFound = await UserModel.findOne({ email });
        console.log('email found:', email);  // Add this for debugging
        if (emailFound) {
            res.status(200).json({ email });
        } else {
            console.log('email not found:', email);  // Add this for debugging
            res.status(404).json({ error: "User not found", email:email });
        }
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};



module.exports = { registerUser, loginUser, findUser };
