import Product from "../models/Product.js";
import Supplier from "../models/Supplier.js";
import Order from "../models/Order.js";

import { Op } from "sequelize";

export const getDashboardStats = async (
  req,
  res
) => {
  try {
    // total products
    const totalProducts =
      await Product.count();

    // total suppliers
    const totalSuppliers =
      await Supplier.count();

    // total orders
    const totalOrders = await Order.count();

    // low stock products
    const lowStockProducts =
      await Product.count({
        where: {
          quantity: {
            [Op.lte]: 5,
          },
        },
      });

    // pending deliveries
    const pendingDeliveries =
      await Order.count({
        where: {
          status: {
            [Op.ne]: "DELIVERED",
          },
        },
      });

    // revenue
    const orders = await Order.findAll();

    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );

    // recent orders
    const recentOrders =
      await Order.findAll({
        limit: 5,

        order: [["createdAt", "DESC"]],
      });

    res.status(200).json({
      totalProducts,
      totalSuppliers,
      totalOrders,
      lowStockProducts,
      pendingDeliveries,
      totalRevenue,
      recentOrders,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};