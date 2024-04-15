const router = require("express").Router();

const authRoutes = require("./authRoutes");
const adminRouter = require("./adminRoutes");
const artistRouter = require("./artistRoutes");
const categoryRouter = require("./categoryRoutes");
const exihibitionRouter = require("./exhibitionRoutes");
const artworkRouter = require("./artworkRoutes");
const orderRouter = require("./orderRoutes");
const ticketRouter = require("./ticketRoutes");
const payementRouter = require("./paymentRoutes");

router.use(authRoutes);
router.use("/admins", adminRouter);
app.use("/artists", artistRouter);
app.use("/artworks", artworkRouter);
app.use("/categorys", categoryRouter);
app.use("/exhibitions", exihibitionRouter);
app.use("/tickets", ticketRouter);
app.use("/orders", orderRouter);
app.use("/payments", payementRouter);

module.exports = router;
