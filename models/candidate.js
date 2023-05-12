"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Candidate extends Model {
    static associate(models) {
      Candidate.belongsTo(models.User);
      models.User.hasOne(Candidate);
      Candidate.belongsTo(models.Post);
      models.Post.hasOne(Candidate);
    }
  }
  Candidate.init(
    {
      userId: DataTypes.INTEGER,
      postId: DataTypes.STRING,
      plans: DataTypes.STRING,
      electionYear: DataTypes.STRING,
      image: DataTypes.STRING,
      isApproved: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Candidate",
    }
  );
  return Candidate;
};
