const router = require("express").Router();

const authRoutes = require("./authRoutes");
const adminRoutes = require("./adminRoutes");
const artistRoutes = require("./artistRoutes");
const customerRoutes = require("./customerRoutes");
const categoryRoutes = require("./categoryRoutes");
const exihibitionRoutes = require("./exhibitionRoutes");
const artworkRoutes = require("./artworkRoutes");
const orderRoutes = require("./orderRoutes");
const ticketRoutes = require("./ticketRoutes");
const payementRoutes = require("./paymentRoutes");
const statsRoutes = require("./statsRoutes");
const shoppingCartRoutes = require("./shoppingCartRoutes");
const cardRoutes = require("./cardRoutes");

router.use(authRoutes);

router.use("/admins", adminRoutes);
router.use("/artists", artistRoutes);
router.use("/customers", customerRoutes);
router.use("/artworks", artworkRoutes);
router.use("/exhibitions", exihibitionRoutes);
router.use("/categories", categoryRoutes);
router.use("/tickets", ticketRoutes);
router.use("/orders", orderRoutes);
router.use("/cards", cardRoutes);
router.use("/payments", payementRoutes);
router.use("/stats", statsRoutes);
router.use("/cart", shoppingCartRoutes);
module.exports = router;
