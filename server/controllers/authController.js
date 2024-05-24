const jwt = require("jsonwebtoken");
const { hash, validatePassword } = require("../utils/passwordUtils");
const Admin = require("../models/Admin");
const Artist = require("../models/Artist");
const Customer = require("../models/Customer");

const getModel = (type) => {
  switch (type) {
    case "admin":
      return Admin;
    case "artist":
      return Artist;
    case "customer":
      return Customer;
  }
};

const registerHandler = async (req, res, next) => {
  const { accountType, password } = req.body;

  try {
    const hashedPassword = await hash(password);
    const Model = getModel(accountType);

    await Model.create({
      ...req.body,
      password: hashedPassword,
    });

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "User already exists" });
    }
    next(error);
  }
};

const loginHandler = async (req, res, next) => {
  const { accountType, identifier, password } = req.body;

  try {
    const Model = getModel(accountType);
    const user = await Model.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });
    if (user && (await validatePassword(password, user.password))) {
      const token = jwt.sign(
        { userId: user._id, accountType: accountType },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
      return res.status(200).json({
        message: "Login successful",
        user: ({ _id, username, email, firstName, lastName } = user),
        token: token,
      });
    } else {
      return res
        .status(401)
        .json({ message: "Invalid identifier or password" });
    }
  } catch (error) {
    next(error);
  }
};

const logoutHandler = (req, res, next) => {
  try {
    res.cookie("token", "", { maxAge: 1 });
    res.cookie("loggedIn", "", { maxAge: 1 });

    return res.status(200).json({ message: "You logged out successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = { registerHandler, loginHandler, logoutHandler };
