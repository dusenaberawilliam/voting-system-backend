"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Vote extends Model {
    static associate(models) {
      Vote.belongsTo(models.Candidate);
      models.Candidate.hasMany(Vote);
      Vote.belongsTo(models.User);
      models.User.hasMany(Vote);
    }
  }
  Vote.init(
    {
      userId: DataTypes.INTEGER,
      candidateId: DataTypes.INTEGER,
      voteYear: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Vote",
    }
  );
  return Vote;
};
