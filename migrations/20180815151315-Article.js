module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn(
      'Articles',
      'readTime',
      Sequelize.STRING
    );
  },

  down: (queryInterface) => {
    queryInterface.removeColumn(
      'Articles',
      'readTime'
    );
  }
};
