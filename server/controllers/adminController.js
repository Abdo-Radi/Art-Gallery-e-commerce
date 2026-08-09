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

    const adminToSend = newAdmin.toObject();
    delete adminToSend.password;

    res.status(201).json(adminToSend);
  } catch (error) {
    next(error);
  }
};

const getAdmins = async (req, res, next) => {
  try {
    const admins = await Admin.find().select("-password");

    return res.status(200).json(admins);
  } catch (error) {
    next(error);
  }
};

const getAdminById = async (req, res, next) => {
  try {
    const adminId = req.params.id;
    const admin = await Admin.findById(adminId).select("-password");

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
    const updateFields = { ...req.body };

    // Hash a new password if one was provided; ignore empty values so an
    // edit form leaving the field blank doesn't wipe the password.
    if (updateFields.password) {
      updateFields.password = await hash(updateFields.password);
    } else {
      delete updateFields.password;
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(adminId, updateFields, {
      new: true,
    }).select("-password");

    if (!updatedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json(updatedAdmin);
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
