//Max $100,000.00 per ingredient price
const CURRENCY_PRECISION = 8; //Significant digits on either side of .
const CURRENCY_SCALE = 2; //Allowable digits to the right of .

module.exports = (sequelize, DataTypes) => {
	const PeriodItem = sequelize.define('periodItems', {
	  id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },

    itemId: {
      type: DataTypes.INTEGER,
      references: {model: 'items', key: 'id'}
    },
    isSubmitted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    periodId: {
      type: DataTypes.INTEGER,
      references: {model: 'periods', key: 'id'}
    },
    price: {
      type: DataTypes.DECIMAL(CURRENCY_PRECISION, CURRENCY_SCALE),
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    quantity: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
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

  PeriodItem.associate = (models) => {
    PeriodItem.hasOne(models.Item, {as: 'item'});
    PeriodItem.hasOne(models.Period, {as: 'period'});
  }

  return PeriodItem;
}