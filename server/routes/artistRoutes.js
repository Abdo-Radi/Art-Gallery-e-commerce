const express = require('express');
const router = express.Router();
const artistController = require('../controllers/artistController');
const { isAuthorized } = require('../middleware/authorization');

router.use(isAuthorized('admin'));

router.get('/', artistController.getArtists);
router.post('/', artistController.addArtist);
router.get('/search', artistController.searchArtists);
router.get('/:id', artistController.getArtistById);
router.put('/:id', artistController.updateArtist);
router.delete('/:id', artistController.deleteArtist);

module.exports = router;
