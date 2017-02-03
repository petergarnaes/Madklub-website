/**
 * Created by peter on 4/25/16.
 */
import {
  GraphQLObjectType as ObjectType,
} from 'graphql';
import {UserAccount} from '../db';
import {attributeFields} from 'graphql-sequelize';
import DateType from './DateType';
import {createdAtDoc,updatedAtDoc} from '../docs/created_updated';

const UserAccountType = new ObjectType({
    name: 'UserAccount',
    fields: Object.assign(attributeFields(UserAccount,{
        exclude:
            ['id','userId','password_hash','lockout_end','lockout_enabled','access_failed_count','createdAt','updatedAt']
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
    description: 'The currently logged in users account information'
});

export default UserAccountType;
