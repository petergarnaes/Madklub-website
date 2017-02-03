/**
 * Created by peter on 5/17/16.
 */

import {
  GraphQLObjectType as ObjectType,
} from 'graphql';
import {resolver} from 'graphql-sequelize';
import {Participation} from '../db';
import {attributeFields} from 'graphql-sequelize';
import DinnerClubType from './DinnerClubType';
import DateType from './DateType';
import {createdAtDoc,updatedAtDoc} from '../docs/created_updated';

const UserParticipationType = new ObjectType({
    name: 'UserParticipation',
    fields: Object.assign(attributeFields(Participation,{exclude: ['id','dp_key','up_key','createdAt','updatedAt']}),{ // Extra fields
        createdAt: {
            type: DateType,
            description: createdAtDoc
        },
        updatedAt: {
            type: DateType,
            description: updatedAtDoc
        },
        dinnerclub: {
            type: DinnerClubType,
            resolve: resolver(Participation.DinnerClub),
            description: 'Dinnerclub the user and their guests are participating in'
        }
    }),
    description: 'A dinnerclub represents one dinner that the kitchen community have together'
});

export default UserParticipationType;
