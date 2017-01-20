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

const UserLoginsType = new ObjectType({
  name: 'UserLogins',
  fields: attributeFields(UserLogin,{
    exclude: ['id','UserId']
  }),
  description: 'The currently logged in users third party login information'
});

export default UserLoginsType;
