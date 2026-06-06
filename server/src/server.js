import dotenv from "dotenv";
import app from "./app.js";
import sequelize from "./config/database.js";

import "./models/User.js";
import "./models/UserActivityLog.js";
import "./models/Product.js";
import "./models/Supplier.js";
import "./models/InventoryLog.js";
import "./models/Order.js";
import "./models/OrderItem.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();

    console.log("MySQL Connected");

    await sequelize.sync();

    console.log("Database Synced");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error);
  }
};

startServer();