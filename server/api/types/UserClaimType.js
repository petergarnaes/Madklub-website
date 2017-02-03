/**
 * Created by peter on 4/25/16.
 */
import {
  GraphQLObjectType as ObjectType,
} from 'graphql';
import {UserClaim} from '../db';
import {attributeFields} from 'graphql-sequelize';
import DateType from './DateType';
import {createdAtDoc,updatedAtDoc} from '../docs/created_updated';

const UserClaimType = new ObjectType({
    name: 'UserClaims',
    fields: Object.assign(attributeFields(UserClaim,{
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
    description: 'The currently logged in users third party login claims'
});

export default UserClaimType;
