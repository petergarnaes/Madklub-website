/**
 * Created by peter on 4/24/16.
 */
import {
  GraphQLNonNull as NonNull,
  GraphQLObjectType as ObjectType,
  GraphQLList as ListType,
  GraphQLBoolean as BooleanType,
  GraphQLString as StringType,
  GraphQLFloat as FloatType,
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
            'archived',
            'shopping_complete',
            'cancelled',
            'meal',
            'total_cost',
            'associatedKitchenId',
            'KitchenId',
            'cookId',
            'at',
            'createdAt',
            'updatedAt'
        ]
    }),{ // Extra fields
        archived: {
            type: new NonNull(BooleanType),
            description: 'Whether or not it is archived, and thereby not changeable'
        },
        shopping_complete: {
            type: new NonNull(BooleanType),
            description: 'Whether or not it is shopping has completed, and thereby if '+
            'participants can cancel their Participation'
        },
        cancelled: {
          type: new NonNull(BooleanType),
          description: 'Whether or not the dinnerclub is cancelled'
        },
        meal: {
          type: new NonNull(StringType),
          description: 'Describes what is served for dinner, defaults to empty string'
        },
        total_cost: {
          type: new NonNull(FloatType),
          description: 'The cost of the dinnerclub'
        },
        at: {
            type: new NonNull(DateType),
            description: 'The date and time the DinnerClub is held at'
        },
        createdAt: {
            type: new NonNull(DateType),
            description: createdAtDoc
        },
        updatedAt: {
            // Can never be null because it defaults to createdDate
            type: new NonNull(DateType),
            description: updatedAtDoc
        },
        cook: {
            type: new NonNull(SimpleUserType),
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
