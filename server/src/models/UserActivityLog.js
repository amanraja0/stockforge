import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const UserActivityLog = sequelize.define(
  "UserActivityLog",
  {
    action: {
      type: DataTypes.ENUM("CREATE", "DELETE"),
      allowNull: false,
    },

    method: {
      type: DataTypes.ENUM("SELF", "ADMIN"),
      allowNull: false,
    },

    targetUserName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    targetUserEmail: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    targetUserRole: {
      type: DataTypes.ENUM("ADMIN", "STAFF"),
      allowNull: false,
    },

    actorUserName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    actorUserRole: {
      type: DataTypes.ENUM("ADMIN", "STAFF"),
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

export default UserActivityLog;