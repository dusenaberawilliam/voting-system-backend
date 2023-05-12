"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class VotesPermission extends Model {
    static associate(models) {
      // define association here
    }
  }
  VotesPermission.init(
    {
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "VotesPermission",
    }
  );
  return VotesPermission;
};
