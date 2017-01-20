/**
 * Created by peter on 1/20/17.
 */

module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define("User", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        display_name: DataTypes.STRING,
        picture: {
            type: DataTypes.STRING,
            validate: { // Could be better, maybe validate through regex it begins with 'http://${host}' ??
                isUrl: true,
                //contains: host
            }
        },
        room_number: DataTypes.STRING,
        active: {type: DataTypes.BOOLEAN, defaultValue: true},
        // We use relation instead, maybe this is unneccsary?
        kitchen_admin: {type: DataTypes.BOOLEAN, defaultValue: false}
    }, {
        classMethods: {
            associate: function(models) {
                User.Kitchen = User.belongsTo(models.Kitchen,{
                    foreignKey: {
                        name: 'memberId'
                    }
                });
                User.UserAccount = User.hasOne(models.UserAccount, {
                    foreignKey: 'userId',
                    as: 'account',
                    onUpdate: 'cascade',
                    onDelete: 'cascade',
                });
                User.UserClaims = User.hasMany(models.UserClaim, {
                    foreignKey: 'userId',
                    as: 'claims',
                    onUpdate: 'cascade',
                    onDelete: 'cascade',
                }); // For third party authentication
                User.UserLogins = User.hasMany(models.UserLogin, {
                    foreignKey: 'userId',
                    as: 'logins',
                    onUpdate: 'cascade',
                    onDelete: 'cascade',
                }); // For third party profile ids and such
                User.Participating = User.hasMany(models.Participation,{
                    as: 'participating',
                    // up = user-participation key
                    foreignKey: 'up_key',
                    //through: 'UserParticipation',
                    //through: models.Participation,
                    // VERY IMPORTANT to join on certain table
                    //unique: false
                });
            }
        }
    });

    return User;
};