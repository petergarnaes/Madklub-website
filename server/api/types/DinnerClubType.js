/**
 * Created by peter on 4/24/16.
 */
import {
  GraphQLObjectType as ObjectType,
  GraphQLList as ListType,
} from 'graphql';
import {resolver} from 'graphql-sequelize';
import {DinnerClub} from '../db';
import {attributeFields} from 'graphql-sequelize';
import DinnerClubParticipationType from './DinnerClubParticipationType';
import {SimpleUserType} from './SimpleUserType';
import DateType from './DateType';
import {createdAtDoc,updatedAtDoc} from '../docs/created_updated';

const DinnerClubType = new ObjectType({
    name: 'DinnerClub',
    fields: Object.assign(attributeFields(DinnerClub,{
        exclude: [
            'KitchenId',
            'cookId',
            'at',
            'createdAt',
            'updatedAt'
        ]
    }),{ // Extra fields
        at: {
            type: DateType,
            description: 'The date and time the DinnerClub is held at'
        },
        createdAt: {
            type: DateType,
            description: createdAtDoc
        },
        updatedAt: {
            type: DateType,
            description: updatedAtDoc
        },
        cook: {
            type: SimpleUserType,
            resolve: resolver(DinnerClub.Cook),
            description: 'The user who cooks the dinner'
        },
        participants: {
            type: new ListType(DinnerClubParticipationType),
            resolve: resolver(DinnerClub.Participants),
            description: 'List of participants of the dinner'
        }
    }),
    description: 'A dinnerclub represents one dinner that the kitchen community have together'
});

export default DinnerClubType;
