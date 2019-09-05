module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Articles', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    slug: {
      type: Sequelize.STRING
    },
    title: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.STRING
    },
    body: {
      type: Sequelize.TEXT
    },
    updatedCount: {
      type: Sequelize.INTEGER,
      defaultValue: '0'
    },
    tagList: {
      type: Sequelize.ARRAY(Sequelize.STRING)
    },
    imageUrl: {
      type: Sequelize.STRING
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    userId: {
      type: Sequelize.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: 'Users',
        key: 'id',
        as: 'userId',
      },
    },
    isPaidFor: {
      type: Sequelize.BOOLEAN
    },
    price: {
      type: Sequelize.DECIMAL
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }),
  down: (queryInterface/* , Sequelize */) => {
    queryInterface.dropTable('Articles');
  }
};
