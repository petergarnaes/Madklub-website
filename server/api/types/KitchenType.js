/**
 * Created by peter on 4/24/16.
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
import {Kitchen} from '../db';
import {attributeFields} from 'graphql-sequelize';
import DinnerClubType from './DinnerClubType';
import {SimpleUserType} from './SimpleUserType';

const KitchenType = new ObjectType({
  name: 'Kitchen',
  fields: Object.assign(attributeFields(Kitchen,{exclude: ['adminId']}),{ // Extra fields
    dinnerclubs: {
      type: new ListType(DinnerClubType),
      resolve: resolver(Kitchen.DinnerClubs),
      description: 'List of dinnerclubs, both future and past, associated with this kitchen'
    },
    members: {
      type: new ListType(SimpleUserType),
      resolve: resolver(Kitchen.Members),
      description: 'List of users that are a part of this kitchen community, and participants ' +
      'of this kitchens dinners'
    },
    admin: {
      type: SimpleUserType,
      resolve: resolver(Kitchen.Admin),
      description: 'The admin of the kitchen'
    }
  }),
  description: 'Kitchens represent the community of which people organize dinners together'
});

export default KitchenType;
