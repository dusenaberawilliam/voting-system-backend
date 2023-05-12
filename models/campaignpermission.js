"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CampaignPermission extends Model {
    static associate(models) {
      // define association here
    }
  }
  CampaignPermission.init(
    {
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "CampaignPermission",
    }
  );
  return CampaignPermission;
};
