const Customer = require("../models/Customer");
const { hash } = require("../utils/passwordUtils");

const addCustomer = async (req, res, next) => {
  try {
    const { password } = req.body;
    const hashedPassword = await hash(password);

    const newCustomer = await Customer.create({
      ...req.body,
      password: hashedPassword,
    });

    res.status(201).json(newCustomer);
  } catch (error) {
    next(error);
  }
};

const getCustomers = async (req, res, next) => {
  try {
    const { search, page } = req.query;
    const options = { lean: true, page };

    const searchQuery = {
      $or: [
        { firstName: { $regex: new RegExp(search, "i") } },
        { lastName: { $regex: new RegExp(search, "i") } },
      ],
    };

    const customers = await Customer.paginate(searchQuery, options);

    if (customers.length === 0) {
      return res.status(204).json({ message: "No customers found" });
    }

    res.status(200).json(customers);
  } catch (error) {
    next(error);
  }
};

const getCustomerById = async (req, res) => {
  try {
    const customerId = req.params.id;
    const customer = await Customer.findById(customerId);
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
    const updatedCustomer = await Customer.findByIdAndUpdate(
      customerId,
      req.body,
      { new: true }
    );

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
