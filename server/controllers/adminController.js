const Admin = require("../models/Admin");
const { hash } = require("../utils/passwordUtils");

const addAdmin = async (req, res, next) => {
  try {
    const { password } = req.body;
    const hashedPassword = await hash(password);

    const newAdmin = await Admin.create({
      ...req.body,
      password: hashedPassword,
    });

    res.status(201).json(newAdmin);
  } catch (error) {
    next(error);
  }
};

const getAdmins = async (req, res, next) => {
  try {
    const admins = await Admin.find();

    if (admins.length === 0) {
      return res.status(404).json({ message: "No admins found" });
    }

    return res.status(200).json(admins);
  } catch (error) {
    next(error);
  }
};

const getAdminById = async (req, res, next) => {
  try {
    const adminId = req.params.id;
    const admin = await Admin.findById(adminId);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json(admin);
  } catch (error) {
    next(error);
  }
};

const updateAdmin = async (req, res, next) => {
  try {
    const adminId = req.params.id;
    const updatedAdmin = await Admin.findByIdAndUpdate(adminId, req.body, {
      new: true,
    });

    if (!updatedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({ message: "Admin updated successfully" });
  } catch (error) {
    next(error);
  }
};

const deleteAdmin = async (req, res, next) => {
  try {
    const adminId = req.params.id;
    const deletedAdmin = await Admin.findByIdAndDelete(adminId);

    if (!deletedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addAdmin,
  getAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
};
