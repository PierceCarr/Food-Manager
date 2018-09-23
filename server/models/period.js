module.exports = (sequelize, DataTypes) => {
	const Period = sequelize.define('period', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
      },
	  month: {
      type: DataTypes.INTEGER,
      validate: {
        max: 12,
        min: 1
      },
      unique: "monthWeekConstraint",
    },
    week: {
      type: DataTypes.INTEGER,
      validate: {
        max: 4,
        min: 1
      },
      unique: "monthWeekConstraint",
    },
    currentWeekday: {
      //0: hasn't started yet, 8: period is over, 1-7: weekdays
      type: DataTypes.INTEGER,
      validate: {
        max: 8,
        min: 0
      },
    },
    createdAt: {
      type: DataTypes.DATE
    },
    updatedAt: {
      type: DataTypes.DATE
    }
	});

  Period.associate = (models) => {
    Period.hasMany(models.PeriodItem, {
      through: 'PeriodPeriodItem',
      as: 'periodItems',
      foreignKey: 'periodId',
    });
  }

  return Period;
};