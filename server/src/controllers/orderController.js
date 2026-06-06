import Order from "../models/Order.js";
import OrderItem from "../models/OrderItem.js";
import Product from "../models/Product.js";
import InventoryLog from "../models/InventoryLog.js";
import sequelize from "../config/database.js";

export const createOrder = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { customerName, items } = req.body;

    if (!customerName || !items || items.length === 0) {
      await transaction.rollback();

      return res.status(400).json({
        message: "Invalid order data",
      });
    }

    let totalAmount = 0;

    // validate products & stock
    for (const item of items) {
      const product = await Product.findByPk(
        item.productId,
        { transaction }
      );

      if (!product) {
        await transaction.rollback();

        return res.status(404).json({
          message: `Product ID ${item.productId} not found`,
        });
      }

      if (product.quantity < item.quantity) {
        await transaction.rollback();

        return res.status(400).json({
          message: `Insufficient stock for ${product.name}`,
        });
      }

      totalAmount += product.price * item.quantity;
    }

    // create order
    const order = await Order.create(
      {
        customerName,
        totalAmount,
      },
      { transaction }
    );

    // process items
    for (const item of items) {
      const product = await Product.findByPk(
        item.productId,
        { transaction }
      );

      const previousQuantity = product.quantity;

      const newQuantity =
        previousQuantity - item.quantity;

      // deduct stock
      product.quantity = newQuantity;

      await product.save({ transaction });

      // create order item
      await OrderItem.create(
        {
          quantity: item.quantity,
          price: product.price,
          OrderId: order.id,
          ProductId: product.id,
        },
        { transaction }
      );

      // inventory log
      await InventoryLog.create(
        {
          action: "REMOVE",
          quantityChanged: item.quantity,
          previousQuantity,
          newQuantity,
          note: `Order #${order.id} created`,
          ProductId: product.id,
        },
        { transaction }
      );
    }

    // commit transaction
    await transaction.commit();

    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    // rollback transaction
    await transaction.rollback();

    res.status(500).json({
      message: error.message,
    });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: {
        model: OrderItem,
        include: Product,
      },

      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateOrderStatus = async (
  req,
  res
) => {
  try {
    const { status } = req.body;

    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const validTransitions = {
      CREATED: ["PACKED"],
      PACKED: ["SHIPPED"],
      SHIPPED: ["DELIVERED"],
      DELIVERED: [],
    };

    const allowedStatuses =
      validTransitions[order.status];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: `Cannot change status from ${order.status} to ${status}`,
      });
    }

    order.status = status;

    await order.save();

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};