exports.isAuthenticated = (req, res, next) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (!req.session?.user || req.session.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access only' });
  }
  next();
};

exports.isDoctor = (req, res, next) => {
  if (!req.session?.user || req.session.user.role !== 'doctor') {
    return res.status(403).json({ error: 'Doctor access only' });
  }
  next();
};
