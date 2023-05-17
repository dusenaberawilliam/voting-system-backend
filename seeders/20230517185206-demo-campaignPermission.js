'use strict';

const { CampaignPermission } = require("../models");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    // Check if table is empty
    const existingData = await CampaignPermission.findAll();
    if (existingData.length > 0) {
      console.log('Data already seeded. skipped...');
      return;
    }

    return queryInterface.bulkInsert('CampaignPermissions', [{
      status: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('CampaignPermissions', null, {});
  }
};
