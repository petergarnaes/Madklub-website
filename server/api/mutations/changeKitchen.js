/**
 * Created by peter on 5/15/16.
 */

import {
    GraphQLID as ID, 
    GraphQLString as StringType, 
} from 'graphql';
import {resolver,attributeFields} from 'graphql-sequelize';
import KitchenType from '../types/KitchenType';
import {sequelize,Kitchen,User} from '../db';
import {csrf_check,csrf_error_message} from '../csrf_check';
import {verifyKitchenAdmin} from './utils';

// Pretty simple, we simply require the ID field, and exclude the ones we do not want the user to be able to change.
// The sequelize validation will take care of input validation, and correctly reject wrong input.
// Only authorization must be done.

// Automatically resolves kitchen based on user, checks user is admin as well
const changeKitchen = {
    type: KitchenType,
    args: Object.assign(attributeFields(Kitchen,{exclude: ['id','adminId','name','createdAt','updatedAt']}),{
        name: {
            type: StringType,
            description: 'name of kitchen'
        },
        transferAdminId: {
            type: ID,
            description: 'ID of the user to be new admin. Must be member of the kitchen. After transfer, the ' +
            'admin who made this transaction is no longer admin.'
        }
    }),
    resolve: function(root, args, context, info) {
        // This is how we must do csrf checks for now...
        if(csrf_check(root)){
            return Promise.reject(csrf_error_message);
        }

        var resolving = function(affectedRows,kitchenID){
            if(affectedRows != 1){
                return Promise.reject('No Kitchen with that ID, or you are not the admin of this Kitchen');
            }
            // Resolves the Kitchen
            return resolver(Kitchen)(root,{id: kitchenID},context, info);
        };

        let update;
        if(args.transferAdminId){
            // If we are doing the admin transfer
            update = sequelize.transaction((t)=>
                verifyKitchenAdmin(root,t).then((u)=>
                    User.findById(args.transferAdminId,{transaction: t}).then((newAdmin)=>{
                          // Confirming new admin is part of the same kitchen
                        if(newAdmin && u.kitchen.id === newAdmin.memberId){
                            return u.kitchen.setAdmin(newAdmin.id,{transaction: t}).then(()=>{
                                return Kitchen.update(args,{
                                    where: {
                                        id: u.kitchen.id
                                    },
                                    transaction: t
                                }).then((affectedRows,_)=>resolving(affectedRows,kitchen.id));
                            });
                        } else {
                            return Promise.reject('Cannot transfer admin permissions to a user not part of the same kitchen');
                        }
                    })
                )
            )
        } else {
            // No admin transfer, just simple kitchen mutation
            update = verifyKitchenAdmin(root,null).then((u)=>
                Kitchen.update(args, {
                    where: {
                        id: u.kitchen.id,
                        // only the kitchen admin can change a kitchen
                        adminId: u.id
                    }
                }).then((affectedRows,_)=>resolving(affectedRows,u.kitchen.id))
            )
        }
        return update;
    },
    description: 'Changes kitchen fields, only admin can change a kitchen'
};

export default changeKitchen;
