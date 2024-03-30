const bcrypt = require("bcrypt");
const Admin = require("../models/Admin");


const addAdmin = async (req, res) => {
  const { firstName, lastName, email, username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await Admin.create({
      firstName,
      lastName,
      email,
      username,
      password: hashedPassword,
      creationDate: new Date(),
    });

    res.status(201).json(newAdmin);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
const updateAdmin = async (req, res) => {
    const id = req.params.id;
    const { firstName, lastName, email, password } = req.body;
    hashedPassword = await bcrypt.hash(password, 10);
  try {
    const updatedAdmin = await Admin.findByIdAndUpdate(
      id,
      {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        lastUpdate: new Date(),
      },
      { new: true }
    );
      console.log(updatedAdmin)
    if (!updatedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({ message: "Admin updated successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteAdmin = async (req, res) => {
  const id = req.params.id;

  try {
    const deletedAdmin = await Admin.findByIdAndDelete(id);

    if (!deletedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  addAdmin,  
  updateAdmin,
  deleteAdmin,
};
