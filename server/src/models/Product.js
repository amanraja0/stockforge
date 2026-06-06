import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Supplier from "./Supplier.js";

const Product = sequelize.define(
  "Product",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    sku: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    description: {
      type: DataTypes.TEXT,
    },

    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    lowStockThreshold: {
      type: DataTypes.INTEGER,
      defaultValue: 5,
    },
  },
  {
    timestamps: true,
  }
);
Supplier.hasMany(Product);

Product.belongsTo(Supplier);

export default Product;