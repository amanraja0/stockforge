import Product from "../models/Product.js";
import InventoryLog from "../models/InventoryLog.js";

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      sku,
      description,
      price,
      quantity,
      lowStockThreshold,
    } = req.body;

    // validation
    if (!name || !sku || !price) {
      return res.status(400).json({
        message: "Name, SKU and price are required",
      });
    }

    // check existing SKU
    const existingProduct = await Product.findOne({
      where: { sku },
    });

    if (existingProduct) {
      return res.status(400).json({
        message: "SKU already exists",
      });
    }

    const product = await Product.create({
      name,
      sku,
      description,
      price,
      quantity,
      lowStockThreshold,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

import { Op } from "sequelize";

export const getProducts = async (req, res) => {
  try {
    // pagination
    const page = parseInt(req.query.page) || 1;

    const limit =
      parseInt(req.query.limit) || 10;

    const offset = (page - 1) * limit;

    // search
    const search = req.query.search || "";

    // sorting
    const sort = req.query.sort || "createdAt";

    // low stock filter
    const lowStock =
      req.query.lowStock === "true";

    // where conditions
    const whereClause = {};

    // search by product name
    if (search) {
      whereClause.name = {
        [Op.like]: `%${search}%`,
      };
    }

    // low stock filter
    if (lowStock) {
      whereClause.quantity = {
        [Op.lte]: 5,
      };
    }

    // get products
    const products = await Product.findAndCountAll(
      {
        where: whereClause,

        limit,

        offset,

        order: [[sort, "DESC"]],
      }
    );

    res.status(200).json({
      totalProducts: products.count,

      totalPages: Math.ceil(
        products.count / limit
      ),

      currentPage: page,

      products: products.rows,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    await product.update(req.body);

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const restockProduct = async (req, res) => {
  try {
    const { sku, quantity } = req.body;

    if (!sku || !quantity) {
      return res.status(400).json({
        message: "SKU and quantity required",
      });
    }

    const product = await Product.findOne({
      where: { sku },
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const previousQuantity = product.quantity;

    product.quantity =
      Number(product.quantity) +
      Number(quantity);

    await product.save();

    // SAFE LOG (only if model exists)
    if (InventoryLog) {
      await InventoryLog.create({
        ProductId: product.id,
        action: "ADD",
        quantityChanged: Number(quantity),
        previousQuantity,
        newQuantity: product.quantity,
        note: "Restock",
      });
    }

    return res.json({
      message: "Stock updated successfully",
      product,
    });
  } catch (error) {
    console.log("RESTOCK ERROR:", error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    await product.destroy();

    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};