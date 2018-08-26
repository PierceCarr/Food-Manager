const CURRENCY_PRECISION = 8; //Significant digits on either side of .
const CURRENCY_SCALE = 2; //Allowable digits to the right of .
module.exports = (sequelize, DataTypes) => {
	const Item = sequelize.define('item', {
	  id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
	  name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: "nameUnitConstraint",
        primaryKey: true
      },
      unitOfMeasurement: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: "nameUnitConstraint",
        primaryKey: true
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {model: 'category', key: 'name'}
      },
      tag: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
      },
      quantity: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        validate: {
        	min: 0
        }
      },
      price: {
        type: DataTypes.DECIMAL(CURRENCY_PRECISION, CURRENCY_SCALE),
        defaultValue: 0,
        validate: {
        	min: 0
        }
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
	});
	
	return Item;
};