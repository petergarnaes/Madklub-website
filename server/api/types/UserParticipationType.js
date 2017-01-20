/**
 * Created by peter on 5/17/16.
 */

import {
  GraphQLObjectType as ObjectType,
  GraphQLID as ID,
  GraphQLString as StringType,
  GarphQLInt as IntType,
  GraphQLNonNull as NonNull,
  GraphQLList as ListType,
} from 'graphql';
import {resolver} from 'graphql-sequelize';
import {Participation} from '../db';
import {attributeFields} from 'graphql-sequelize';
import DinnerClubType from './DinnerClubType';
import {SimpleUserType} from './SimpleUserType';

const UserParticipationType = new ObjectType({
  name: 'UserParticipation',
  fields: Object.assign(attributeFields(Participation,{exclude: ['id','dp_key','up_key']}),{ // Extra fields
    dinnerclub: {
     type: DinnerClubType,
     resolve: resolver(Participation.DinnerClub),
     description: 'Dinnerclub the user and their guests are participating in'
     }
  }),
  description: 'A dinnerclub represents one dinner that the kitchen community have together'
});

export default UserParticipationType;
