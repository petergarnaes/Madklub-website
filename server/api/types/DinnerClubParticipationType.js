/**
 * Created by peter on 5/17/16.
 */

import {
  GraphQLObjectType as ObjectType,
  GraphQLID as ID,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
  GraphQLList as ListType,
} from 'graphql';
import {resolver} from 'graphql-sequelize';
import {Participation} from '../db';
import {attributeFields} from 'graphql-sequelize';
import DinnerClubType from './DinnerClubType';
import {SimpleUserType} from './SimpleUserType';

const DinnerClubParticipationType = new ObjectType({
  name: 'DinnerClubParticipation',
  fields: Object.assign(attributeFields(Participation,{exclude: ['id','dp_key','up_key']}),{ // Extra fields
    user: {
      type: SimpleUserType,
      resolve: resolver(Participation.User),
      description: 'User participating in dinnerclub, they are the one bringing the guests etc.'
    }
  }),
  description: 'A dinnerclub represents one dinner that the kitchen community have together'
});

export default DinnerClubParticipationType;
