"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ApprovedLeaders extends Model {
    static associate(models) {
      ApprovedLeaders.belongsTo(models.Candidate);
      models.Candidate.hasOne(ApprovedLeaders);
    }
  }
  ApprovedLeaders.init(
    {
      candidateId: DataTypes.INTEGER,
      leadershipStartDate: DataTypes.DATE,
      leadershipEndDate: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "ApprovedLeaders",
    }
  );
  return ApprovedLeaders;
};
