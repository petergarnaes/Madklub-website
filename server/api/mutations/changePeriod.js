/**
 * Created by peter on 25-04-17.
 */
import {
    GraphQLID as ID,
    GraphQLString as StringType,
    GraphQLNonNull as NonNull,
} from 'graphql';
import {attributeFields} from 'graphql-sequelize';
import PeriodType from '../types/PeriodType';
import {sequelize,Period,DinnerClub} from '../db';
import {csrf_check,csrf_error_message} from '../csrf_check';
import moment from 'moment';
import {verifyKitchenAdmin} from './utils';

const changePeriod = {
    type: PeriodType,
    args: Object.assign(attributeFields(Period,{exclude: ['id','periodKitchenId','createdAt','updatedAt']}),{
        id: {
            type: new NonNull(ID),
            description: 'ID of the period that will be changed'
        }
    }),
    // TODO ensure kitchen admin is the one performing this action
    resolve: (root,args,context,info) => {
        // This is how we must do csrf checks for now...
        if(csrf_check(root)){
            return Promise.reject(csrf_error_message);
        }
        // Start/end date overlap queries
        var queries = [];
        // Check valid start date if provided
        if(args.started_at){
            var start = moment(args.started_at);
            if(!start.isValid()) return Promise.reject('Start date provided was invalid!');
            // Add query to check for start overlap
            queries.push({
                started_at: {
                    $lt: start.toISOString()
                },
                ended_at: {
                    $gt: start.toISOString()
                }
            });
        }
        // Check valid start date if provided
        if(args.ended_at){
            var end = moment(args.ended_at);
            if(!end.isValid()) return Promise.reject('End date provided was invalid!');
            // Add query to check for start overlap
            queries.push({
                started_at: {
                    $lt: end.toISOString()
                },
                ended_at: {
                    $gt: end.toISOString()
                }
            });
        }
        // If both start and end date is being modified, ensure start is before end
        if(args.started_at && args.ended_at && !moment(args.started_at).isBefore(moment(args.ended_at)))
            return Promise.reject('Start date is not before end date!');
        // Ensures we only try and archive, ie. set it to true
        if(!args.archived)
            return Promise.reject('Cannot un-archive a period');
        return sequelize.transaction((t)=>
            verifyKitchenAdmin(root,t)
                // Verify no overlapping dates
                .then((_)=> {
                    if(queries.length > 0)
                       return Period.findAll({
                            transaction: t,
                            where: {
                                // Either start or end overlaps with another period
                                $or: queries,
                            }
                        }).then((p)=>(p.length > 0) ? Promise.reject('Period overlaps!') : null);
                    return null;
                })
                .then((_) =>
                    Period.findById(args.id,{
                        transaction: t
                    })
                )
                .then((p) => {
                    // Check the period is not already archived
                    if (p.archived) Promise.reject('Period archived, cannot be mutated');
                    // If archiving, then archive dinnerclubs and their participations
                    if (args.archived) {
                        // TODO update participations? We do not use it as of yet, only dinnerclub archive...
                        return DinnerClub.update({archived: true}, {
                            transaction: t,
                            where: {
                                at: {
                                    $gt: p.started_at,
                                    $lt: p.ended_at
                                },
                                KitchenId: p.periodKitchenId
                            }
                        })
                    }
                })
                .then((_)=>
                    Period.update(args, {
                        transaction: t,
                        where: {
                            id: args.id
                        }
                    })
                )
        );
    },
    description: 'Changes a period by ID. Cannot un-archive period, and start/end can still not overlap' +
    'with other periods'
};

export default changePeriod;
