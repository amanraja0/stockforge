import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

import Order from "./Order.js";
import Product from "./Product.js";

const OrderItem = sequelize.define(
  "OrderItem",
  {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

Order.hasMany(OrderItem);

OrderItem.belongsTo(Order);

Product.hasMany(OrderItem);

OrderItem.belongsTo(Product);

export default OrderItem;