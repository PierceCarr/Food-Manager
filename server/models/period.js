module.exports = (sequelize, DataTypes) => {
	const Period = sequelize.define('period', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true
    },

    day: {
      type: DataTypes.INTEGER,
      validate: {
        min: 1,
        max: 7
      }
    },
    endDay: {
      type: DataTypes.INTEGER,
      validate: {
        max: 31,
        min: 1
      }
    },
    isAM: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
	  month: {
      type: DataTypes.INTEGER,
      validate: {
        max: 12,
        min: 1
      },
    },
    primaryPeriod: {
      type: DataTypes.INTEGER,
      unique: "yearPrimaryQuarterConstraint",
    },
    quarterPeriod: {
      type: DataTypes.INTEGER,
      validate: {
        max: 4,
        min: 1
      },
      unique: "yearPrimaryQuarterConstraint",
    },
    startDay: {
      type: DataTypes.INTEGER,
      validate: {
        max: 31,
        min: 1
      }
    },
    year: {
      type:DataTypes.INTEGER,
      unique: "yearPrimaryQuarterConstraint",
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