module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn(
      'Users',
      'isAdmin',
      Sequelize.BOOLEAN
    );
  },

  down: (queryInterface) => {
    queryInterface.removeColumn(
      'Users',
      'isAdmin'
    );
  }
};
