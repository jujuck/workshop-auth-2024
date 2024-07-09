const argon2 = require("argon2");

const hashingOptions = {
  type: argon2.argon2id,
  memoryCost: 19 * 2 ** 10 /* 19 Mio en kio (19 * 1024 kio) */,
  timeCost: 2,
  parallelism: 1,
};

const hashPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    const hashedPassword = await argon2.hash(password, hashingOptions);

    req.body.hashedPassword = hashedPassword;
    delete req.body.password;

    next();
  } catch (err) {
    next(err);
  }
};

const verifyPassword = async (hash, password) => argon2.verify(hash, password);

module.exports = { hashPassword, verifyPassword };
