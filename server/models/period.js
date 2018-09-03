module.exports = (sequelize, DataTypes) => {
	return sequelize.define('period', {
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
    dayDates: {
      type: DataTypes.ARRAY(DataTypes.STRING)
    },
    createdAt: {
      type: DataTypes.DATE
    },
    updatedAt: {
      type: DataTypes.DATE
    }
	});
};