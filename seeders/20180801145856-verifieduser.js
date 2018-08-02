'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    return queryInterface.bulkInsert('Users', [{
      email: 'newuser@register.com',
      isverified: true,
      hashedPassword: '$2b$10$xsRq.X1mYDTjYYSeqEIhauC6BuXDRxZKbcLaZT5OV4lrApcealQkS',
      username: 'regnewuser',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'newusertwo@register.com',
      isverified: false,
      hashedPassword: '$2b$10$xsRq.X1mYDTjYYSeqEIhauC6BuXDRxZKbcLaZT5OV4lrApcealQkS',
      username: 'regnewusertwo',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
    return queryInterface.bulkDelete('Users', null, {});
  }
};
