const db = require("../models");
// Destructure all necessary models and sequelize for transactions
const { User, Doctor, Patient, sequelize } = db;
const { Op } = db.Sequelize;
const bcrypt = require('bcrypt');

/**
 * Handles signup for DIFFERENT roles (patient, doctor, admin).
 * Creates a central User record and a corresponding profile record.
 */
exports.signup = async (req, res, next) => {
  // Destructure all possible fields from the request body
  const { role, name, email, phone, password, ...profileData } = req.body;

  console.log('Signup request received:', { role, name, email, phone });

  // 1. Validate the role - ADDED 'admin' TO THE VALID ROLES
  if (!role || !['patient', 'doctor', 'admin'].includes(role)) {
    return res.status(400).json({ message: "A valid role ('patient', 'doctor', or 'admin') is required." });
  }

  // Validate required fields
  if (!name || !email || !phone || !password) {
    return res.status(400).json({ message: "All fields (name, email, phone, password) are required." });
  }

  // Use a transaction to ensure both user and profile are created, or neither are.
  const t = await sequelize.transaction();

  try {
    // 2. Check if a user already exists in the central User table
    const existingUser = await User.findOne({
      where: { 
        [Op.or]: [{ phone }, { email }] 
      }
    });

    if (existingUser) {
      await t.rollback();
      return res.status(409).json({ message: "User with this phone or email already exists" });
    }

    // 3. Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 12);

    // 4. Create the main User record for authentication
    const user = await User.create({
      email,
      phone,
      password: hashedPassword,
      role,
    }, { transaction: t });

    console.log('User created:', user.id);

    // 5. Create the role-specific profile and link it to the User
    if (role === 'doctor' || role === 'admin') {
      await Doctor.create({
        name,
        specialization: profileData.specialization || (role === 'admin' ? 'Administration' : null),
        userId: user.id, // This links the doctor profile to the user
      }, { transaction: t });
      console.log(`${role} profile created`);
    } else if (role === 'patient') {
      await Patient.create({
        name,
        dob: profileData.dob || null,
        userId: user.id, // This links the patient profile to the user
      }, { transaction: t });
      console.log('Patient profile created');
    }

    // 6. If everything is successful, commit the transaction
    await t.commit();

    res.status(201).json({ 
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} registered successfully!`,
      userId: user.id
    });

  } catch (err) {
    // If any step fails, roll back all database changes
    await t.rollback();
    console.error('Signup error:', err);
    
    // Handle specific Sequelize errors
    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: 'Validation error: ' + err.errors.map(e => e.message).join(', ') });
    }
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'User with this email or phone already exists' });
    }
    
    next(err); // Pass the error to the global error handler
  }
};

/**
 * Handles login for ALL roles by checking the central User table.
 */
exports.login = async (req, res, next) => {
  const { phone, password } = req.body;

  console.log('Login attempt for phone:', phone);

  try {
    // 1. Find the user by phone number in the central User table
    const user = await User.findOne({ where: { phone } });

    if (!user) {
      return res.status(401).json({ message: 'Authentication failed: User not found.' });
    }
    if (!user.isActive) {
      return res.status(403).json({ message: 'Your account has been disabled.' });
    }

    // 2. Compare the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Authentication failed: Invalid credentials.' });
    }

    // 3. Fetch the user's name from their specific profile
    let profileName = 'User';
    let profileData = {};
    
    if (user.role === 'doctor' || user.role === 'admin') {
      const doctorProfile = await Doctor.findOne({ where: { userId: user.id } });
      profileName = doctorProfile?.name || (user.role === 'admin' ? 'Admin' : 'Doctor');
      profileData = doctorProfile || {};
    } else if (user.role === 'patient') {
      const patientProfile = await Patient.findOne({ where: { userId: user.id } });
      profileName = patientProfile?.name || 'Patient';
      profileData = patientProfile || {};
    }

    // 4. Store essential, non-sensitive info in the session
    req.session.user = {
      id: user.id,
      role: user.role,
      phone: user.phone,
      name: profileName,
      email: user.email,
      profileId: profileData.id // Store profile ID for easy access
    };

    console.log('Login successful for user:', profileName, 'Role:', user.role);

    res.json({
      message: 'Login successful',
      user: req.session.user,
    });
  } catch (err) {
    console.error('Login error:', err);
    next(err);
  }
};

/**
 * Disables a user in the central User table.
 */
exports.disableUser = async (req, res, next) => {
 try {
   const user = await User.findByPk(req.params.id);
   if (!user) {
     return res.status(404).json({ message: 'User not found' });
   }

   user.isActive = false;
   await user.save();

   res.json({ message: `User ${user.email} disabled successfully.` });
 } catch (err) {
   next(err);
 }
};

/**
 * Destroys the user's session.
 */
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Could not log out. Please try again.' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logout successful' });
  });
};