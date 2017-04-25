/**
 * Created by peter on 5/15/16.
 */

import {
    GraphQLID as ID,
    GraphQLString as StringType,
    GraphQLNonNull as NonNull,
} from 'graphql';
import moment from 'moment';
import {resolver,attributeFields} from 'graphql-sequelize';
import DinnerClubType from '../types/DinnerClubType';
import {sequelize,DinnerClub,Participation} from '../db';
import {csrf_check,csrf_error_message} from '../csrf_check';

// Pretty simple, we simply require the ID field, and exclude the ones we do not want the user to be able to change.
// The sequelize validation will take care of input validation, and correctly reject wrong input.
// Only authorization must be done.
const changeDinnerClub = {
    type: DinnerClubType,
    // should it even be possible to change date? maybe just cancel and become cook another day?)
    args: Object.assign(attributeFields(DinnerClub,{exclude: ['id','at','KitchenId','cookId','createdAt','updatedAt','archived']}),{
        id: {
            type: new NonNull(ID),
            description: 'Must provide ID to correctly change the DinnerClub'
        }
    }),
    resolve: function(root, args, context, info) {
        // This is how we must do csrf checks for now...
        if(csrf_check(root)){
            return Promise.reject(csrf_error_message);
        }
        // TODO if we do not mutate total cost, we don't have to do join
        return sequelize.transaction((t)=>DinnerClub.findById(args.id,{
            transaction: t,
            // We count the number of participants so we can calculate the individual price
            // and thereby check if the priceloft is broken
            attributes: { include: [
                [sequelize.fn('COUNT', sequelize.col('participant.id')), 'nrPart'],
                [sequelize.fn('SUM',sequelize.col('participant.guest_count')), 'guestCountPart']
            ]},
            include: [
                {
                    // Only id required, since we just need to count
                    attributes: ['id','guest_count'],
                    model: Participation,
                    // This 'as' must match the association name in db
                    as: 'participant',
                    // Ensures participant count is only people who have not cancelled
                    where: {
                        cancelled: false
                    },
                    required: true
                }
            ]
        }).then((dinnerclub)=>{
            console.log('So it begins:');
            console.log(dinnerclub.get('guestCountPart'));
            if(!dinnerclub)
                return Promise.reject('No such dinnerclub with that ID');
            if(dinnerclub.archived)
                return Promise.reject('Dinnerclub archived, cannot be changed now');
            return dinnerclub.getKitchen({transaction: t}).then((kitchen)=>{
                let current = moment();
                let at = moment(dinnerclub.at);
                // Verify cancelling is not to late
                let deadline = kitchen.cancellation_deadline;
                if(deadline > 0 && current.isAfter(moment(at).subtract({'minutes': deadline}))){
                    return Promise.reject('You are trying to cancel after the cancel deadline ' +
                        'is passed');
                }
                // Verify shopping complete is not to early
                let shop_at = kitchen.shopping_open_at;
                if(shop_at > 0 && current.isBefore(moment(at).subtract({'minutes': shop_at}))){
                    return Promise.reject('You are trying to shop to early!');
                }
                // - verify shopping complete is not set from true to false, it seems non-sensical

                // verify total_cost is not to high
                if(kitchen.priceloft_applies){
                    let participant_count = dinnerclub.get('nrPart');
                    let guest_count = dinnerclub.get('guestCountPart');
                    let total_part_count = participant_count+guest_count;
                    args.total_cost = ((dinnerclub.total_cost/total_part_count) > kitchen.default_priceloft) ?
                        (kitchen.default_priceloft*total_part_count) : dinnerclub.total_cost;
                }

                // Verification successful, we perform the update
                return DinnerClub.update(args,{
                    transaction: t,
                    where: {
                        id: args.id,
                        // only the cook can change a dinnerclub
                        cookId: root.request.user.id
                    }
                }).then((affectedRows,d)=>{
                    if(affectedRows != 1){
                        return Promise.reject('You are not the cook of this dinnerclub, and cannot change it');
                    }
                    //
                    return d;
                }).catch((err)=> {
                    return Promise.reject(err);
                });
            });
            // Resolves the DinnerClub, return when transaction is committed so updated data is returned
        })).then((_)=>resolver(DinnerClub)(root,{id: args.id},context, info));
    },
    description: 'Changes dinnerclub fields, only cook can change a dinnerclub'
};

export default changeDinnerClub;
