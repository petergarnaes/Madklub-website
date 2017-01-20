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
import {UserAccount} from '../db';
import {attributeFields} from 'graphql-sequelize';

const UserAccountType = new ObjectType({
  name: 'UserAccount',
  fields: attributeFields(UserAccount,{
    exclude:
      ['id','userId','password_hash','lockout_end','lockout_enabled','access_failed_count']
  }),
  description: 'The currently logged in users account information'
});

export default UserAccountType;
