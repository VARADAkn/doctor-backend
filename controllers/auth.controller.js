// controllers/auth.controller.js
const db = require("../models");   // load models/index.js
const Doctor = db.Doctor;          // get the Doctor model


const generateDoctorId = require('../utils/generateDoctorId'); // your function

exports.signup = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    if (role === "doctor") {
      const doctor = await db.Doctor.create({
        id: generateDoctorId(),   // 👈 custom 13-digit ID here
        name,
        email,
        phone,
        password,
        role
      });

      return res.json({
        message: "Doctor registered successfully",
        doctor
      });
    }

    // if not doctor → handle other roles
  } catch (err) {
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
};




exports.login = async (req, res) => {
  const { phone, password } = req.body;

  try {
    const user = await User.findOne({ where: { phone } });

    if (!user) {
      return res.status(401).json({ message: 'Phone number not found' });
    }

    if (!user.isActive) {   // check if account is disabled
      return res.status(403).json({ message: 'Account is disabled. Please contact support.' });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    res.json({ message: 'Login successful', user });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

// 👇 NEW CONTROLLER FUNCTION

exports.disableUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isActive = false;
    await user.save();

    res.json({ message: 'User disabled successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Failed to disable user', error: err.message });
  }
};
