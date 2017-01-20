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
import {UserClaim} from '../db';
import {attributeFields} from 'graphql-sequelize';

const UserClaimType = new ObjectType({
  name: 'UserClaims',
  fields: attributeFields(UserClaim,{
    exclude: ['id','UserId']
  }),
  description: 'The currently logged in users third party login claims'
});

export default UserClaimType;
