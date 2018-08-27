//Max $100,000.00 per ingredient price
const CURRENCY_PRECISION = 8; //Significant digits on either side of .
const CURRENCY_SCALE = 2; //Allowable digits to the right of .

module.exports = (sequelize, DataTypes) => {
	return sequelize.define('periodItems', {
	  id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
      },
	  periodId: {
        type: DataTypes.INTEGER,
        references: {model: 'periods', key: 'id'}
      },
      itemId: {
        type: DataTypes.INTEGER,
        references: {model: 'items', key: 'id'}
      },
      day: {
        type: DataTypes.INTEGER,
        validate: {
          min: 1,
          max: 7
        }
      },
      isAM: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      quantity: {
        type: DataTypes.FLOAT,
        defaultValue: 0.0,
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
      createdAt: {
        type: DataTypes.DATE
      },
      updatedAt: {
        type: DataTypes.DATE
      }
	});
}