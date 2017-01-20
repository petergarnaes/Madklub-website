/**
 * Created by peter on 4/25/16.
 */

import {
  GraphQLObjectType as ObjectType,
  GraphQLID as ID,
  GraphQLString as StringType,
  GarphQLInt as IntType,
  GraphQLNonNull as NonNull,
} from 'graphql';
import {resolver} from 'graphql-sequelize';
import {User} from '../db';
import KitchenType from './KitchenType';
import {attributeFields} from 'graphql-sequelize';

export const SimpleUserFields = attributeFields(User,{exclude: ['memberId']});

export const SimpleUserType = new ObjectType({
  name: 'SimpleUser',
  fields: Object.assign(Object.assign({},SimpleUserFields),{
    id: {
      type: ID,
      description: 'Users ID to uniquely identify a user. Only used when needing to mutate specific user'
    }
  }),
  description: 'Basic user info'
});
