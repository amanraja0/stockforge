import Product from "../models/Product.js";
import InventoryLog from "../models/InventoryLog.js";

export const updateInventory = async (req, res) => {
  try {
    const { quantity, action, note } = req.body;

    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const previousQuantity = product.quantity;

    let newQuantity = previousQuantity;

    // ADD stock
    if (action === "ADD") {
      newQuantity += quantity;
    }

    // REMOVE stock
    if (action === "REMOVE") {
      newQuantity -= quantity;

      if (newQuantity < 0) {
        return res.status(400).json({
          message: "Insufficient stock",
        });
      }
    }

    // UPDATE stock
    if (action === "UPDATE") {
      newQuantity = quantity;
    }

    // update product quantity
    product.quantity = newQuantity;

    await product.save();

    // create inventory log
    await InventoryLog.create({
      action,
      quantityChanged: quantity,
      previousQuantity,
      newQuantity,
      note,
      ProductId: product.id,
    });

    res.status(200).json({
      message: "Inventory updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getInventoryLogs = async (req, res) => {
  try {
    const logs = await InventoryLog.findAll({
      include: {
        model: Product,
        attributes: ["id", "name", "sku"],
      },

      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
