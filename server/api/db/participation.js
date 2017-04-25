/**
 * Created by peter on 5/17/16.
 */

module.exports = function(sequelize, DataTypes) {
    var Participation = sequelize.define("Participation", {
        archived: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        // Number of guests the user will be bringing
        guest_count: {
            type: DataTypes.INTEGER,
            // We cannot have a negative amount of guests
            validate: {
                min: 0
            }
        },
        // Another use for this table, we will not be having this feature just yet
        will_be_late: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        // If participant cancelled their participation
        cancelled: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
        // doing dishes?
    },{
        classMethods: {
            associate: function(models) {
                Participation.User = Participation.belongsTo(models.User,{
                    foreignKey: 'up_key'
                });
                Participation.DinnerClub = Participation.belongsTo(models.DinnerClub,{
                    foreignKey: 'dp_key'
                });
            }
        }
    });
    return Participation;
};
