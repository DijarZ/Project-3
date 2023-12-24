// authMiddleware.js
const isAdmin = (req, res, next) => {
  if (req.user.role === "admin") {
    next(); // Lejo qasjen për adminët
  } else {
    res.status(403).json({ message: "Nuk keni leje për këtë veprim." });
  }
};

const isSelfOrAdmin = (req, res, next) => {
  if (req.user.role === "admin" || req.params.userId === req.user.userId) {
    next(); // Lejo qasjen për veten ose për adminët
  } else {
    res.status(403).json({ message: "Nuk keni leje për këtë veprim." });
  }
};

module.exports = {
  isAdmin,
  isSelfOrAdmin,
};
