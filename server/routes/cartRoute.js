const express = require('express') ;
const cartController = require('../controllers/cartController');
// const customerVerification = require('../middlewares/customerVerification');
const cartRouter = express.Router();
// cartRouter.use(customerVerification)


cartRouter.get('/' , cartController.showCart) ;

cartRouter.delete('/:id' , cartController.deleteProductFromCart) ;

cartRouter.post('/increase/:id' ,  cartController.increaseQuantity) ;

cartRouter.post('/decrease/:id' ,  cartController.decreaseQuantity) ;

module.exports = cartRouter ;
