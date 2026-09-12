const Artwork = require("../models/Artwork");
const Artist = require("../models/Artist");
const Order = require("../models/Order");

const getStats = async (req, res, next) => {
  try {
    // These four queries are independent — run them concurrently rather than
    // paying for four sequential round trips to Atlas.
    const [totalArtists, totalArtworks, orderStats, artworkStats] =
      await Promise.all([
        Artist.countDocuments(),
        Artwork.countDocuments(),
        Order.aggregate([
          {
            // Closed orders were paid too; open and canceled ones aren't sales.
            $match: {
              status: { $in: ["Paid", "Closed"] },
            },
          },
          {
            $group: {
              _id: null,
              totalOrders: { $sum: 1 },
              totalSales: { $sum: "$totalAmount" },
            },
          },
        ]),
        Artwork.aggregate([
          {
            $group: {
              _id: "$category",
              count: { $sum: 1 },
            },
          },
          {
            $lookup: {
              from: "categories",
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
        ]),
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
