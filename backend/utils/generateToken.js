const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign(
    { id: id },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE || "7d",
    }
  );
};

module.exports = generateToken;