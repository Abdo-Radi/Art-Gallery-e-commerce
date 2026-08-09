const Customer = require("../models/Customer");
const { hash } = require("../utils/passwordUtils");
const { escapeRegex } = require("../utils/regexUtils");

const addCustomer = async (req, res, next) => {
  try {
    const { password } = req.body;
    const hashedPassword = await hash(password);

    const newCustomer = await Customer.create({
      ...req.body,
      password: hashedPassword,
    });

    const customerToSend = newCustomer.toObject();
    delete customerToSend.password;

    res.status(201).json(customerToSend);
  } catch (error) {
    next(error);
  }
};

const getCustomers = async (req, res, next) => {
  try {
    const { search, page } = req.query;
    const options = { lean: true, page, select: "-password" };

    const searchQuery = search
      ? {
          $or: [
            { firstName: { $regex: new RegExp(escapeRegex(search), "i") } },
            { lastName: { $regex: new RegExp(escapeRegex(search), "i") } },
          ],
        }
      : {};

    const customers = await Customer.paginate(searchQuery, options);

    res.status(200).json(customers);
  } catch (error) {
    next(error);
  }
};

const getCustomerById = async (req, res, next) => {
  try {
    const customerId = req.params.id;
    const customer = await Customer.findById(customerId).select("-password");
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json(customer);
  } catch (error) {
    next(error);
  }
};

const updateCustomer = async (req, res, next) => {
  try {
    const customerId = req.params.id;
    const updateFields = { ...req.body };

    // Hash a new password if one was provided; ignore empty values so an
    // edit form leaving the field blank doesn't wipe the password.
    if (updateFields.password) {
      updateFields.password = await hash(updateFields.password);
    } else {
      delete updateFields.password;
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(
      customerId,
      { ...updateFields, lastUpdate: new Date() },
      { new: true }
    ).select("-password");

    if (!updatedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json(updatedCustomer);
  } catch (error) {
    next(error);
  }
};

const deleteCustomer = async (req, res, next) => {
  try {
    const customerId = req.params.id;
    const deletedCustomer = await Customer.findByIdAndDelete(customerId);

    if (!deletedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};
