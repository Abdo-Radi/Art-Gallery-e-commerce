const router = require('express').Router();
const artworkController = require('../controllers/artworkContoller');
const { isAuthorized } = require('../middleware/authorization');

router.post('/', isAuthorized('artist'), artworkController.createArtwork);
router.get('/', artworkController.getArtworks);
router.get('/:id', artworkController.getArtworkById);
router.get('/search', artworkController.searchArtworks);
router.put('/:id', isAuthorized('artist'), artworkController.updateArtwork);
router.delete('/:id', isAuthorized('artist', 'admin'), artworkController.deleteArtworkById);

module.exports = router;