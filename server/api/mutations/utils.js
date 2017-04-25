/**
 * Created by peter on 25-04-17.
 */
import {User,Kitchen} from '../db';

export const verifyKitchenAdmin = (root,transaction) => {
    // Query options
    var options = {
        attributes: ['id'],
        include: [
            {
                attributes: ['id','adminId'],
                model: Kitchen,
                as: 'kitchen'
            }
        ]
    };
    // If part of transaction, setup transaction
    if(transaction){
        options.transaction = transaction;
    }
    return User.findById(root.request.user.id,options)
        .then((u) => (u.id !== u.kitchen.adminId) ? Promise.reject('Current user is not admin!') : u);
};

