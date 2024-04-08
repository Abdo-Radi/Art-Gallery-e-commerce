const Customer = require('../models/Customer');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const register = async (req, res) => {
    try {
        const data = req.body;
        const newCustomer = await Customer.create(data);
        console.log('Customer created successfully', newCustomer);
        res.status(201).json(newCustomer);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Error creating customer', error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Customer.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.password !== password) {
            return res.status(401).json({ message: 'Incorrect password' });
        }
        const TOKEN = jwt.sign({ name: user.name, id: user._id }, process.env.SECRET_KEY);
        console.log(TOKEN);
        return res.status(200).json({ message: 'Login successful!' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

const getCustomer = async (req, res) => {
    try {
        const customers = await Customer.find();
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
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

module.exports = { register, login, getCustomer, getCustomerById, searchCustomer, updateCustomer, deleteCustomer };
