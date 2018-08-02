module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    queryInterface.addColumn('Users', 'isverified', Sequelize.BOOLEAN);
  },

  down: queryInterface => queryInterface.removeColumn('Users', 'isverified')
};
