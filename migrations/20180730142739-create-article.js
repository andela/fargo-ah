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
    favorited: {
      type: Sequelize.BOOLEAN
    },
    favoritesCount: {
      type: Sequelize.INTEGER
    },
    imageUrl: {
      type: Sequelize.STRING
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
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
    }
  }),
  down: (queryInterface/* , Sequelize */) => {
    queryInterface.dropTable('Articles');
  }
};
