module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    lastname: {
      type: Sequelize.STRING,
    },
    firstname: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    hashedPassword: {
      type: Sequelize.STRING,
    },
    bio: {
      type: Sequelize.STRING,
    },
    image: {
      type: Sequelize.STRING,
    },
    following: {
      type: Sequelize.STRING,
    },
    favorites: {
      type: Sequelize.STRING,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }),
  down: (queryInterface) => {
    queryInterface.dropTable('Users');
  }
};
