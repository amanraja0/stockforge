import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Order = sequelize.define(
  "Order",
  {
    customerName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM(
        "CREATED",
        "PACKED",
        "SHIPPED",
        "DELIVERED"
      ),

      defaultValue: "CREATED",
    },

    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

export default Order;