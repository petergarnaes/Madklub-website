/**
 * Created by peter on 5/15/16.
 */

import {
  GraphQLInputObjectType as InputObjectType,
} from 'graphql';
import {resolver,attributeFields} from 'graphql-sequelize';
import UserType from '../types/UserType';
import {sequelize,User,UserAccount} from '../db';
import {csrf_check,csrf_error_message} from '../csrf_check';

// Users can only change themselves, can change a limited amount of things
const changeUser = {
  type: UserType,
  args: Object.assign(attributeFields(User,{exclude: ['id','kitchen_admin','memberId','createdAt','updatedAt']}),{ //Extra fields
    // It is possible to modify account information as well
    account: {
      // Must be input type, although declared like a normal object
      type: new InputObjectType({
        name: 'MutableAccountType',
        fields: attributeFields(UserAccount,{
          // As of now only fields are: email, phone_number, username
          exclude: ['id',
            'userId',
            'password_hash',
            'lockout_end',
            'lockout_enabled',
            'access_failed_count',
            'email_confirmed',
            'phone_number_confirmed',
            'two_factor_enabled',
            'createdAt',
            'updatedAt']
        }),
        description: 'The mutable part of your account'
      })
  }}),
  resolve: function(root, args, context, info) {
    // This is how we must do csrf checks for now...
    if(csrf_check(root)){
      return Promise.reject(csrf_error_message);
    }
    console.log(args);
    // Set account to empty object if not there, will result in an updatedAt on account, even though only user changed
    args.account = args.account ? args.account : {};
    // Transaction ensures either both or neither changes happen!
    return sequelize.transaction((t) => {
      // If user changes phone number it is not confirmed
      if(args.account.phone_number){
        args.account.phone_number_confirmed = false;
      }
      return UserAccount.update(args.account,{
        where: {
          userId: root.request.user.id
        },
        transaction: t
      }).then((account) => {
        return User.update(args,{
          where: {
            id: root.request.user.id
          },
          transaction: t
        })
      });
    }).then((affectedRows,_)=>{
      // No need to rollback since nothing was actually updated
      if(affectedRows != 1){
        return Promise.reject('Request rejected, no such user exists or you are not logged in');
      }
      // Resolves the user
      return resolver(User)(root,{id: root.request.user.id},context, info);
    }).catch((err)=> {
      return Promise.reject(err);
    });;
  }
};

export default changeUser;
