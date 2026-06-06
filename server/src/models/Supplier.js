import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Supplier = sequelize.define(
  "Supplier",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      unique: true,
    },

    phone: {
      type: DataTypes.STRING,
    },

    address: {
      type: DataTypes.TEXT,
    },
  },
  {
    timestamps: true,
  }
);

export default Supplier;