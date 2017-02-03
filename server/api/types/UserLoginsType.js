/**
 * Created by peter on 4/25/16.
 */
import {
  GraphQLObjectType as ObjectType,
  GraphQLID as ID,
  GraphQLString as StringType,
  GarphQLInt as IntType,
  GraphQLNonNull as NonNull,
  GraphQLList as ListType,
} from 'graphql';
import {UserLogin} from '../db';
import {attributeFields} from 'graphql-sequelize';
import DateType from './DateType';
import {createdAtDoc,updatedAtDoc} from '../docs/created_updated';

const UserLoginsType = new ObjectType({
  name: 'UserLogins',
  fields: Object.assign(attributeFields(UserLogin,{
    exclude: ['id','UserId','createdAt','updatedAt']
  }),{ // Extra fields
      createdAt: {
          type: DateType,
          description: createdAtDoc
      },
      updatedAt: {
          type: DateType,
          description: updatedAtDoc
      }
  }),
  description: 'The currently logged in users third party login information'
});

export default UserLoginsType;
