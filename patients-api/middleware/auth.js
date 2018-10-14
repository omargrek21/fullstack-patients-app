const jwt = require("jsonwebtoken");

exports.loginRequired = function(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, function(err, decoded) {
      if (decoded) {
        next(); 
      } else {
        return next({ status: 401, message: "Usuario no autenticado" });
      }
    });
  } catch (e) {
    return next({ status: 401, message: "Usuario no autenticado" });
  }
};

exports.ensureCorrectUser = function(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, function(err, decoded) {
      if (decoded && decoded.role === 'admin') {
        return next();
      } else {
        return next({ status: 401, message: "Usuario no autorizado" });
      }
    });
  } catch (e) {
    return next({ status: 401, message: "Usuario no autorizado" });
  }
};