'use strict';

const { VotesPermission } = require("../models");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    // Check if table is empty
    const existingData = await VotesPermission.findAll();
    if (existingData.length > 0) {
      console.log('Data already seeded. skipped...');
      return;
    }

    return queryInterface.bulkInsert('VotesPermissions', [{
      status: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('VotesPermissions', null, {});
  }
};
