const db = require("../models");
const { User, Doctor, Patient, sequelize } = db;
const { Op } = db.Sequelize;
const bcrypt = require("bcrypt");

/**
 * SIGNUP
 * Creates a User + role-specific profile
 */
exports.signup = async (req, res, next) => {
  const { role, name, email, phone, password, ...profileData } = req.body;

  // Validate role
  if (!role || !["patient", "doctor", "admin"].includes(role)) {
    return res.status(400).json({
      message: "Role must be 'patient', 'doctor', or 'admin'",
    });
  }

  // Validate required fields
  if (!name || !email || !phone || !password) {
    return res.status(400).json({
      message: "Name, email, phone, and password are required",
    });
  }

  const t = await sequelize.transaction();

  try {
    // Check existing user
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { phone }],
      },
    });

    if (existingUser) {
      await t.rollback();
      return res.status(409).json({
        message: "User with this email or phone already exists",
      });
    }

    // Create User
    const user = await User.create(
      {
        email,
        phone,
        password, // hashed via Sequelize hook
        role,
      },
      { transaction: t }
    );

    // Create profile
    if (role === "doctor" || role === "admin") {
      await Doctor.create(
        {
          name,
          specialization:
            profileData.specialization ||
            (role === "doctor" ? "General Medicine" : null),
          userId: user.id,
        },
        { transaction: t }
      );
    }

    if (role === "patient") {
      await Patient.create(
        {
          name,
          dob: profileData.dob || null,
          userId: user.id,
        },
        { transaction: t }
      );
    }

    await t.commit();

    res.status(201).json({
      message: `${role.toUpperCase()} registered successfully`,
      userId: user.id,
    });
  } catch (err) {
    await t.rollback();
    console.error("Signup error:", err);
    next(err);
  }
};

/**
 * LOGIN
 * Session-based authentication
 */
exports.login = async (req, res, next) => {
  const { phone, password } = req.body;

  try {
    const user = await User.findOne({ where: { phone } });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Account disabled" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Fetch profile name + id
    let profileName = "User";
    let profileId = null;

    if (user.role === "doctor" || user.role === "admin") {
      const doctor = await Doctor.findOne({ where: { userId: user.id } });
      profileName = doctor?.name || "Doctor";
      profileId = doctor?.id || null;
    }

    if (user.role === "patient") {
      const patient = await Patient.findOne({ where: { userId: user.id } });
      profileName = patient?.name || "Patient";
      profileId = patient?.id || null;
    }

    // Store session
    req.session.userId = user.id;
    req.session.user = {
      id: user.id,
      role: user.role,
      phone: user.phone,
      email: user.email,
      name: profileName,
      profileId,
    };

    res.json({
      message: "Login successful",
      user: req.session.user,
    });
  } catch (err) {
    console.error("Login error:", err);
    next(err);
  }
};

/**
 * LOGOUT
 * Destroys session
 */
exports.logout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Logout failed. Try again." });
    }
    res.clearCookie("connect.sid");
    res.json({ message: "Logout successful" });
  });
};

/**
 * DISABLE USER (Admin)
 */
exports.disableUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isActive = false;
    await user.save();

    res.json({
      message: `User ${user.email} disabled successfully`,
    });
  } catch (err) {
    next(err);
  }
};
