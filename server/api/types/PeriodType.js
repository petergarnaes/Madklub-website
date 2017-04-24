/**
 * Created by peter on 4/24/17.
 */

import {
    GraphQLObjectType as ObjectType,
    GraphQLList as ListType,
} from 'graphql';
import {resolver} from 'graphql-sequelize';
import {sequelize,Period,DinnerClub} from '../db';
import {attributeFields} from 'graphql-sequelize';
//import DinnerClubParticipationType from './DinnerClubParticipationType';
import DinnerClubType from './DinnerClubType';
import DateType from './DateType';
import {createdAtDoc,updatedAtDoc} from '../docs/created_updated';

const PeriodType = new ObjectType({
    name: 'Period',
    fields: Object.assign(attributeFields(Period,{
        exclude: [
            'periodKitchenId',
            'started_at',
            'ended_at',
            'archived',
            'createdAt',
            'updatedAt'
        ]
    }),{ // Extra fields
        createdAt: {
            type: DateType,
            description: createdAtDoc
        },
        updatedAt: {
            type: DateType,
            description: updatedAtDoc
        },
        started_at: {
            type: DateType,
            description: 'Start of period date'
        },
        ended_at: {
            type: DateType,
            description: 'End of period date'
        },
        dinnerclubs: {
            type: new ListType(DinnerClubType),
            description: 'The dinnerclubs in this period of this kitchen',
            resolve: (root, args, context, info) => {
                console.log('Period root:');
                console.log(root);
                //return null;
                return DinnerClub.findAll({
                    where: {
                        // Finds appropriate dinnerclubs
                        at: {
                            $gt: root.started_at,
                            $lt: root.ended_at
                        },
                        // So we only look at dinnerclubs for this periods kitchen
                        associatedKitchenId: root.periodKitchenId
                    }
                });
            },
        },
        // TODO create some Type and resolver that can calculate accounting information
        // for this period. This type should maybe be per user?
    }),
    description: 'A dinnerclub represents one dinner that the kitchen community have together'
});

export default PeriodType;

