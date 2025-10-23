const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "secretkey_changeme";

const USER = {
  username: "usuario",
  password: "1234"
};

exports.login = (req, res) => {
  const { username, password } = req.body;

  if (username === USER.username && password === USER.password) {
    const token = jwt.sign({ username }, SECRET, { expiresIn: "2h" });
    res.json({ message: "Login exitoso", token });
  } else {
    res.status(401).json({ message: "Credenciales inválidas" });
  }
};
