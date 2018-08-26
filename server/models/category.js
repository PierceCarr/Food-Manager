module.exports = (sequelize, DataTypes) => {
	return sequelize.define('category', {
		name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true
      },
      tags: {
        type: DataTypes.ARRAY({
          type: DataTypes.STRING,
          unique: true
        }),
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        default: true
      }
  });
};