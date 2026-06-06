import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

import Product from "./Product.js";

const InventoryLog = sequelize.define(
  "InventoryLog",
  {
    action: {
      type: DataTypes.ENUM(
        "ADD",
        "REMOVE",
        "UPDATE"
      ),
      allowNull: false,
    },

    quantityChanged: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    previousQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    newQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    note: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true,
  }
);

Product.hasMany(InventoryLog);

InventoryLog.belongsTo(Product);

export default InventoryLog;