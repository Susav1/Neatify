const jwt = require("jsonwebtoken");

const authenticateAdmin = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid token.",
    });
  }
};

const logout = (req, res) => {
  res.cookie("jwt_cookie", "", { expires: new Date(0) });
  res.status(200).json({ message: "Logout successful" });
};

module.exports = authenticateAdmin;
