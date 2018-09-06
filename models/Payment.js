module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    stripeToken: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stripeTokenType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stripeEmail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {});

  Payment.associate = (models) => {
    Payment.belongsTo(
      models.Article,
      {
        foreignKey: 'articleId',
        onDelete: 'CASCADE',
      }
    );
    Payment.belongsTo(
      models.User,
      {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
      }
    );
  };
  return Payment;
};
