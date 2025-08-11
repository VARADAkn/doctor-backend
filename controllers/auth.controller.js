const db = require('../models');
const User = db.User;

exports.signup = async (req, res) => {
  const { username, email, phone, password, role } = req.body;

  try {
    const user = await User.create({
      username,
      email,
      phone,
      password,
      role, // optional: if not provided, defaults to 'user'
    });

    res.status(201).json({ message: 'User registered', user });
  } catch (err) {
    res.status(400).json({ message: 'Signup failed', error: err.message });
  }
};

exports.login = async (req, res) => {
  const { phone, password } = req.body;

  try {
    const user = await User.findOne({ where: { phone } });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid phone number or password' });
    }

    res.json({ message: 'Login successful', user });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};
