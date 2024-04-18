const Customer = require('../models/Customer');

const getCustomers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const totalCustomers = await Customer.countDocuments();
        const totalPages = Math.ceil(totalCustomers / limit);

        const customers = await Customer.find()
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            data: customers,
            totalPages: totalPages,
            currentPage: page
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
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

const searchCustomer = async (req, res) => {
    res.status(501).json({ message: 'Search functionality not implemented yet' });
};

const updateCustomer = async (req, res) => {
    try {
        const customerId = req.params.id;
        const newData = req.body;
        const updatedCustomer = await Customer.findByIdAndUpdate(customerId, newData, { new: true });
        if (!updatedCustomer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.status(200).json(updatedCustomer);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

const deleteCustomer = async (req, res) => {
    try {
        const customerId = req.params.id;
        const deletedCustomer = await Customer.findByIdAndDelete(customerId);
        if (!deletedCustomer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.status(200).json({ message: 'Customer deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

module.exports = { getCustomers, getCustomerById, searchCustomer, updateCustomer, deleteCustomer };
