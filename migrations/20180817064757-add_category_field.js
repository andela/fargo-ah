module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    queryInterface.addColumn('Articles', 'categorylist', Sequelize.ARRAY(Sequelize.STRING));
  },

  down: queryInterface => queryInterface.removeColumn('Articles', 'categorylist')
};
