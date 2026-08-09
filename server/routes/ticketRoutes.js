const router = require('express').Router();
const ticketController = require('../controllers/ticketController');
const { isAuthorized } = require('../middleware/authorization');
const { verifyToken } = require('../middleware/jwt');

router.get('/', ticketController.getTickets);
router.get('/:id', ticketController.getTicketById);

router.use(verifyToken);
router.use(isAuthorized('admin'));

router.post('/', ticketController.createTicket);
router.put('/:id', ticketController.updateTicket);
router.delete('/:id', ticketController.deleteTicketById);

module.exports = router;