/**
 * Created by peter on 4/24/16.
 */

module.exports = function(sequelize, DataTypes) {
  var DinnerClub = sequelize.define("DinnerClub", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    at: { // Date AND time of the dinner
      type: DataTypes.DATE,
      allowNull: false,
      //unique: 'comp', // Composite index so (at,KitchenId) can be unique
      validate: {
        isDate: true
      }
    },
    KitchenId: { // Foreign key of kitchen which our association will default to, so we can use unique
      type: DataTypes.INTEGER,
      //allowNull: false,
      //unique: 'comp' // Composite index so (at,KitchenId) can be unique
    },
    cancelled: { // Whether the dinner will be held
      type: DataTypes.BOOLEAN,
      defaultValue: false // True because by default no cook is assigned
    },
    shopping_complete: { // Indicates whether or not the cook has shopped
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    total_cost: { // Entire cost of the meal, which can then be split
      type: DataTypes.FLOAT,
      defaultValue: 0.0
    },
    meal: { // Description/title of meal
      type: DataTypes.STRING,
      defaultValue: ""
    }
  }, {
    classMethods: {
      associate: function(models) {
        DinnerClub.belongsTo(models.Kitchen,{
          foreignKey: {
            name: 'associatedKitchenId'
          }
        });
        DinnerClub.Cook = DinnerClub.belongsTo(models.User,{
          as: 'cook'
        });
        DinnerClub.Participants = DinnerClub.hasMany(models.Participation,{
          as: 'participant',
          // dp = dinnerclub-participation key
          foreignKey: 'dp_key',
          //constraints: false,
          //through: 'DinnerClubParticipation',
          //through: models.Participation,
          // VERY IMPORTANT to join on certain table
          //unique: false
        });
      }
    }
  });

  return DinnerClub;
};
