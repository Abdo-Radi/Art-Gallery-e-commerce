
const express = require('express');
const Router = express.Router();
const { getCustomers,getCustomerById,searchCustomer, updateCustomer,deleteCustomer } = require('../controllers/customerController')


Router.get('/', getCustomers)
Router.get('/:id', getCustomerById)
Router.get('/search', searchCustomer)
Router.put('/:id', updateCustomer)
Router.delete('/:id', deleteCustomer)


module.exports= Router;