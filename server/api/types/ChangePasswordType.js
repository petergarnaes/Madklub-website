/**
 * Created by peter on 5/6/17.
 */
import {
    GraphQLNonNull as NonNull,
    GraphQLInputObjectType as InputObjectType,
    GraphQLString as StringType,
} from 'graphql';
import {attributeFields} from 'graphql-sequelize';

const ChangePasswordType = new InputObjectType({
    name: 'ChangePasswordType',
    fields: {
        old_password: {
            type: new NonNull(StringType),
            description: 'Your previous password'
        },
        new_password: {
            type: new NonNull(StringType),
            description: 'Your new password'
        }
    },
    description: 'The mutable part of your account'
});

export default ChangePasswordType;

