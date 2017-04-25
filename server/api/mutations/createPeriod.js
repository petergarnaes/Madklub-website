/**
 * Created by peter on 25-04-17.
 */
import {
    GraphQLString as StringType,
    GraphQLNonNull as NonNull,
} from 'graphql';
import {attributeFields} from 'graphql-sequelize';
import PeriodType from '../types/PeriodType';
import {sequelize,Period,User,Kitchen} from '../db';
import {csrf_check,csrf_error_message} from '../csrf_check';
import moment from 'moment';
import {verifyKitchenAdmin} from './utils';

const createPeriod = {
    type: PeriodType,
    args: Object.assign(attributeFields(Period,{exclude: ['id','archived','periodKitchenId','createdAt','updatedAt']}),{
        started_at: {
            type: new NonNull(StringType),
            description: 'Start date of period, must not be within another period.'
        },
        ended_at: {
            type: new NonNull(StringType),
            description: 'End date of period, must not be within another period.'
        }
    }),
    resolve: (root,args,context,info) => {
        // This is how we must do csrf checks for now...
        if(csrf_check(root)){
            return Promise.reject(csrf_error_message);
        }
        var start = moment(args.started_at);
        var end = moment(args.ended_at);
        // Dates must be valid
        if (start.isValid() && end.isValid() && start.isBefore(end)) {
            return sequelize.transaction((t) =>
                verifyKitchenAdmin(root,t).then((_)=>{
                    // Check for overlapping periods
                    return Period.findAll({
                        transaction: t,
                        where: {
                            // Either start or end overlaps with another period
                            $or: [
                                // start date overlaps with another period
                                {
                                    started_at: {
                                        $lt: start.toISOString()
                                    },
                                    ended_at: {
                                        $gt: start.toISOString()
                                    }
                                },
                                // End date overlaps with another period
                                {
                                    started_at: {
                                        $lt: end.toISOString()
                                    },
                                    ended_at: {
                                        $gt: end.toISOString()
                                    }
                                }
                            ],
                        }
                    }).then((p)=>{
                        if(p.length > 0) return Promise.reject('Period overlaps!');
                        return Period.create(args,{transaction: t});
                    });
                })
            );
        } else {
            // date is not valid
            return Promise.reject('Dates invalid! Make sure dates follow ISO 8601 date format and make sure ' +
                'start is before end...');
        }
        
    },
    description: 'Create a period of which to do accounting on. Period can not overlap with others'
};

export default createPeriod;