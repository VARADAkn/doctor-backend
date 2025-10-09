const db = require("../models");
const Doctor = db.Doctor;
const { Op } = db.Sequelize;   // ✅ Destructure Op correctly
const generateDoctorId = require('../utils/generateDoctorId');

exports.signup = async (req, res, next) => {
  try {
    const { name, email, phone, password, specialization } = req.body;

    const doctorData = {
      id: generateDoctorId(),
      name,
      email,
      phone,
      password,
      specialization: specialization || null
    };

   const existingDoctor = await Doctor.findOne({
  where: {
    [Op.or]: [{ phone }, { email }]
  }
});


    if (existingDoctor) {
      const error = new Error("Doctor with this phone or email already exists");
      error.statusCode = 400;
      throw error;  // 👈 throw error instead of res.status
    }

    const doctor = await Doctor.create(doctorData);

    return res.status(201).json({
      message: "Doctor registered successfully",
      doctor: {
        id: doctor.id,
        name: doctor.name,
        email: doctor.email,
        phone: doctor.phone,
        specialization: doctor.specialization,
        role: doctor.role,
        isActive: doctor.isActive
      }
    });

  } catch (err) {
    next(err);  // 👈 Pass error to global handler
  }
};


exports.login = async (req, res) => {
  const { phone, password } = req.body;

  try {
    // Only check Doctor table
    const doctor = await Doctor.findOne({ where: { phone } });

    if (!doctor) {
      return res.status(401).json({ message: 'Phone number not found' });
    }

    if (!doctor.isActive) {
      return res.status(403).json({ message: 'Account is disabled' });
    }

    if (doctor.password !== password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    
    req.session.user = {
      id: doctor.id,
      role: doctor.role,
      phone: doctor.phone,
      name: doctor.name
    };

    res.json({ 
      message: 'Login successful', 
      user: req.session.user 
    });
  } catch (err) {
    next(err);
  }
};

exports.disableUser = async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    doctor.isActive = false;
    await doctor.save();

    res.json({ message: 'Doctor disabled successfully', doctor });
  } catch (err) {
    next(err);
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: 'Logout failed' });
    res.clearCookie('connect.sid');
    res.json({ message: 'Logout successful' });
  });
};