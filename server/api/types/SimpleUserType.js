/**
 * Created by peter on 4/25/16.
 */

import {
  GraphQLObjectType as ObjectType,
  GraphQLID as ID,
} from 'graphql';
import {User} from '../db';
import {attributeFields} from 'graphql-sequelize';
import DateType from './DateType';
import {createdAtDoc,updatedAtDoc} from '../docs/created_updated';

export const SimpleUserFields = attributeFields(User,{exclude: ['memberId','createdAt','updatedAt']});

export const SimpleUserType = new ObjectType({
    name: 'SimpleUser',
    fields: Object.assign(Object.assign({},SimpleUserFields),{
        id: {
            type: ID,
            description: 'Users ID to uniquely identify a user. Only used when needing to mutate specific user'
        },
        createdAt: {
            type: DateType,
            description: createdAtDoc
        },
        updatedAt: {
            type: DateType,
            description: updatedAtDoc
        }
    }),
    description: 'Basic user info'
});
