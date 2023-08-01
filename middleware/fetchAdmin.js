const jwt = require("jsonwebtoken");

const JWT = "success";

const fetchAdmin = (req, res, next) => {
  const token = req.header("authtoken");

  if (!token) {
    return res.status(401).send({ error: "Invalid token." });
  }

  try {
    const data = jwt.verify(token, JWT);
    req.admin = data.admin;
    next();
  } catch (error) {
    res.status(500).send("Internal server error.");
  }
};

module.exports = fetchAdmin;
