const Artwork = require("../models/Artwork");
const Order = require("../models/Order");

const getStats = async (req, res, next) => {
  try {
    const ordersStats = await Order.aggregate([
      {
        $match: {
          status: { $ne: "Canceled" },
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

    const result = {
      orders:
        ordersStats.length > 0
          ? ordersStats[0]
          : { totalOrders: 0, totalSales: 0 },
      artworks: artworkStats,
    };

    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = { getStats };
