const Customer = require("../models/Customer");
const { hash } = require("../utils/passwordUtils");

const addCustomer = async (req, res, next) => {
  const { firstName, lastName, email, username, password } = req.body;

  try {
    const hashedPassword = await hash(password);

    const newCustomer = await Customer.create({
      firstName,
      lastName,
      email,
      username,
      password: hashedPassword,
    });

    res.status(201).json(newCustomer);
  } catch (error) {
    next(error);
  }
};

const getCustomers = async (req, res) => {
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

    const totalDocs = await Customer.countDocuments();

    res.status(200).json({
      ...customers,
      totalDocs,
    });
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
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const searchCustomer = async (req, res) => {
  res.status(501).json({ message: "Search functionality not implemented yet" });
};

const updateCustomer = async (req, res) => {
  try {
    const customerId = req.params.id;
    const newData = req.body;
    const updatedCustomer = await Customer.findByIdAndUpdate(
      customerId,
      newData,
      { new: true }
    );
    if (!updatedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json(updatedCustomer);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const customerId = req.params.id;
    const deletedCustomer = await Customer.findByIdAndDelete(customerId);
    if (!deletedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

module.exports = {
  addCustomer,
  getCustomers,
  getCustomerById,
  searchCustomer,
  updateCustomer,
  deleteCustomer,
};
