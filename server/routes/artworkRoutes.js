const router = require('express').Router();
const artworkController = require('../controllers/artworkContoller');
const { isAuthorized } = require('../middleware/authorization');
const upload = require('../utils/multerUtils');

router.post('/', isAuthorized('admin'), upload.single('image'), artworkController.createArtwork);
router.get('/', artworkController.getArtworks);
router.get('/:id', artworkController.getArtworkById);
router.get('/search', artworkController.searchArtworks);
router.put('/:id', upload.single('image'), artworkController.updateArtwork);
router.delete('/:id', isAuthorized('artist', 'admin'), artworkController.deleteArtworkById);
router.post("/add/to/cart/:id", artworkController.addToCart);

module.exports = router;