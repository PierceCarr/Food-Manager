module.exports = (sequelize, DataTypes) => {
	const Category = sequelize.define('category', {
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

  Category.associate = (models) => {
    Category.belongsToMany(models.Item, {
      through: 'CategoryItem',
      as: 'items',
      foreignKey: 'category'
    });
  }
  
  return Category;
};