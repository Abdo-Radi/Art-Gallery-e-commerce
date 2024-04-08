
const express = require('express');
const customerRouter = express.Router();
const {register, login, getCustomer,getCustomerById,searchCustomer, updateCustomer,deleteCustomer } = require('../controllers/customerController')

customerRouter.post('/login',login)
customerRouter.post('/',register)
customerRouter.get('/', getCustomer)
customerRouter.get('/:id', getCustomerById)
customerRouter.get('/search', searchCustomer)
customerRouter.put('/:id', updateCustomer)
customerRouter.delete('/:id', deleteCustomer)


module.exports= customerRouter;