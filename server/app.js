const express = require("express");
const app = express();
const artistRouter = require("./routes/artistRoutes");
const adminRouter = require("./routes/adminRoutes");
const categoryRouter = require("./routes/categoryRoutes");
const exihibitionRouter = require("./routes/exhibitionRoutes");
const artworkRouter = require("./routes/artworkRoutes");
const orderRouter = require("./routes/orderRoutes");
const ticketRouter = require("./routes/ticketRoutes");
const payementRouter = require("./routes/paymentRoutes");
require("dotenv").config();

const port = process.env.PORT;
// Database connection
require("./config/database");

app.use(express.json());
app.use("/artists", artistRouter);
app.use("/admins", adminRouter);
app.use("/artworks", artworkRouter);
app.use("/categorys", categoryRouter);
app.use("/exhibitions", exihibitionRouter);
app.use("/tickets", ticketRouter);
app.use("/orders", orderRouter);
app.use("/payments", payementRouter);

app.listen(port, () => {
  console.log("Server is running on port " + port);
});

module.exports = app;
