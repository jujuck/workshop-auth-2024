// Import access to database tables
const jwt = require("jsonwebtoken");
const { verifyPassword } = require("../services/auth");
const tables = require("../../database/tables");

const { APP_SECRET } = process.env;

const login = async (req, res, next) => {
  try {
    // Fetch a specific user from the database based on the provided email
    const user = await tables.user.readByEmail(req.body.email);

    const verified = user
      ? await verifyPassword(user.password, req.body.password)
      : false;
    if (verified) {
      delete user.password;

      const token = jwt.sign(user, APP_SECRET);
      res
        .cookie("token", token, {
          httpOnly: true,
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
        })
        .json(token);
    } else {
      // Respond with the user in JSON format (but without the hashed password)

      res.sendStatus(422);
    }
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

module.exports = {
  login,
};
