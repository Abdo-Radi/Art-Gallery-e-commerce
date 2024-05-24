const Artwork = require("../models/Artwork");
const Artist = require("../models/Artist");
const Order = require("../models/Order");

const getStats = async (req, res, next) => {
  try {
    const totalArtists = await Artist.countDocuments();
    const totalArtworks = await Artwork.countDocuments();

    const orderStats = await Order.aggregate([
      {
        $match: {
          status: "Paid",
        },
      },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalSales: { $sum: "$totalAmount" },
        },
      },
    ]);

    const artworkStats = await Artwork.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "categories", // Assuming the collection name for categories is "categories"
          localField: "_id",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $project: {
          _id: 0,
          category: { $arrayElemAt: ["$category", 0] },
          count: 1,
        },
      },
    ]);

    res.json({
      totalArtists,
      totalArtworks,
      artworkStats,
      orderStats:
        orderStats.length > 0
          ? orderStats[0]
          : { totalOrders: 0, totalSales: 0 },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getStats };
