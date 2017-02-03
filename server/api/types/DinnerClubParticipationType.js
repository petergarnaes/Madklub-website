/**
 * Created by peter on 5/17/16.
 */

import {
  GraphQLObjectType as ObjectType,
} from 'graphql';
import {resolver} from 'graphql-sequelize';
import {Participation} from '../db';
import {attributeFields} from 'graphql-sequelize';
import {SimpleUserType} from './SimpleUserType';
import DateType from './DateType';
import {createdAtDoc,updatedAtDoc} from '../docs/created_updated';

const DinnerClubParticipationType = new ObjectType({
    name: 'DinnerClubParticipation',
    fields: Object.assign(attributeFields(Participation,{exclude: ['id','dp_key','up_key','createdAt','updatedAt']}),{ // Extra fields
        createdAt: {
            type: DateType,
            description: createdAtDoc
        },
        updatedAt: {
            type: DateType,
            description: updatedAtDoc
        },
        user: {
            type: SimpleUserType,
            resolve: resolver(Participation.User),
            description: 'User participating in dinnerclub, they are the one bringing the guests etc.'
        }
    }),
    description: 'A dinnerclub represents one dinner that the kitchen community have together'
});

export default DinnerClubParticipationType;
