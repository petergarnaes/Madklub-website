/**
 * Created by peter on 5/6/17.
 */
import {
    GraphQLInputObjectType as InputObjectType,
} from 'graphql';
import {attributeFields} from 'graphql-sequelize';
import {UserAccount} from '../db';
import ChangePasswordType from './ChangePasswordType';

const MutableAccountType = new InputObjectType({
    name: 'MutableAccountType',
    fields: Object.assign(attributeFields(UserAccount,{
          // As of now only fields are: email, phone_number, username
          exclude: [
              'id',
              'userId',
              'password_hash',
              'lockout_end',
              'lockout_enabled',
              'access_failed_count',
              'email_confirmed',
              'phone_number_confirmed',
              'two_factor_enabled',
              'createdAt',
              'updatedAt'
          ]
    }),{
        change_password: {
            type: ChangePasswordType,
            description: 'This object must be provided in order to change the password'
        }
    }),
    description: 'The mutable part of your account'
});

export default MutableAccountType;

