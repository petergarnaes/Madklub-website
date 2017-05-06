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
var bcrypt = require('bcrypt');
import MutableAccountType from '../types/MutableAccountType';

// Users can only change themselves, can change a limited amount of things
const changeUser = {
  type: UserType,
  args: Object.assign(attributeFields(User,{exclude: ['id','kitchen_admin','memberId','createdAt','updatedAt']}),{ //Extra fields
    // It is possible to modify account information as well
    account: {
      // Must be input type, although declared like a normal object
      type: MutableAccountType,
    }
  }),
  resolve: function(root, args, context, info) {
    // This is how we must do csrf checks for now...
    if(csrf_check(root)){
      return Promise.reject(csrf_error_message);
    }
    console.log(args);
    // Set account to empty object if not there, will result in an updatedAt on account, even though only user changed
    args.account = args.account ? args.account : {};
    // Transaction ensures either both or neither changes happen!
    return sequelize.transaction((t)=>User.findById(root.request.user.id,{
        transaction: t,
        include: [{model: UserAccount, as: 'account'}]
      })
      .then((user)=>{
        // If user changes phone number it is not confirmed
        if(args.account.phone_number){
          args.account.phone_number_confirmed = false;
        }
        // User wishes to change their password
        console.log("Change password object:");
        console.log(args.account.change_password);
        if(args.account.change_password){
          let oldPasswordCorrect = bcrypt.compareSync(args.account.change_password.old_password,user.account.password_hash);
          // Success
          console.log("Is old password correct? "+oldPasswordCorrect);
          if(oldPasswordCorrect){
            // TODO standarize round number between register and change
            let hash = bcrypt.hashSync(args.account.change_password.new_password,10);
            console.log("Reasonable hash? "+hash);
            args.account.password_hash = hash;
          } else {
            return Promise.reject('Gammelt kodeord ikke korrekt!');
          }
          // Remove property that is not used in storage
          delete args.account.change_password;
        }
          console.log("Final args: ");
          console.log(args);
          // If account updates, then update, else nothing
          return (args.account) ? UserAccount.update(args.account,{
            transaction: t,
            where: {
              id: user.account.id
            }
          }) : null;
      })
      .then((_)=>User.update(args,{
              transaction: t,
              include: [{model: UserAccount, as: 'account'}],
              where: {
                id: root.request.user.id
              }
          })
      )
      .then((affectedRows,_)=>{
          // No need to rollback since nothing was actually updated
          if(affectedRows != 1){
            return Promise.reject('Request rejected, no such user exists or you are not logged in');
          }
          // Resolves the user
          return resolver(User)(root,{id: root.request.user.id},context, info);
        }).catch((err)=> {
          return Promise.reject(err);
        })
    );
  },
  description: 'Changing user settings, including all account settings related to your user. This includes ' +
  'email and password.'
};

export default changeUser;
