/**
 * Created by peter on 24-04-17.
 *
 * This represents a period of time where dinnerclubs are held, and is
 * primarily used for determining the date range that accounting is calculated on.
 * 
 * Periods does not own or belong to dinnerclubs, but the associated dinnerclubs
 * can be found by querying between start and end date.
 * 
 * When archived, periods are set in stone, and cannot be changed. Archiving is 
 * supposed to indicate that the period is completed, or otherwise locked because
 * accounting is done for the period.
 *
 * This approach allows great flexibility and seems to support our mental model,
 * since periods are kinda exists alongside dinnerclubs. This allows:
 *  - Changing the period length of kitchen, changes all active (not archived) periods,
 * where the active period with the earliest start date gets the end date corresponding to
 * the new period, the next period gets the start date of that end date, and an end date
 * corresponding to the new start date and new period, etc. This way, dinnerclubs can now
 * easily be associated with new periods, and accounting can be done.
 *  - Potentially making periods optional, so groups accounting every once in a while or
 *  never can safely ignore this part
 *
 * The only mutation available is to archive the period. Start and end can only be changed
 * by changing the period length in kitchen. This way we ensure periods do not overlap, but
 * covers all dates.
 * All the interesting stuff happens in the PeriodType, which calculates the associated dinnerclubs
 * and calculates accounting information (who owes what) etc.
 *
 * TODO: 
 *  - How do create periods? Is it an admin job?
 *  - Could store information about mandatory number of dinnerclubs people are supposed to have?
 *  Although it is probably a kitchen thing
 */

module.exports = function(sequelize, DataTypes) {
    var Period = sequelize.define("Period", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        started_at: { // start of period
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                isDate: true
            }
        },
        ended_at: { // end of period, could be null, if period is ongoing
            type: DataTypes.DATE,
            validate: {
                isDate: true
            }
        },
        // This property indicates whether or not a period is completed from
        // in the eyes of the admin. When archived, it is not possible to change
        // its properties, like start and end date.
        archived: {
            type: DataTypes.BOOLEAN,
            defaultValue: false // Should it be false?
        }
    }, {
        classMethods: {
            associate: function(models) {
                Period.belongsTo(models.Kitchen,{
                    foreignKey: {
                        name: 'periodKitchenId'
                    }
                });
            }
        }
    });

    return Period;
};

