"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ApprovedLeaders", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      candidateId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "candidates",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      LeadershipStartDate: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      LeadershipEndDate: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("ApprovedLeaders");
  },
};
