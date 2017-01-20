/**
 * Created by peter on 5/15/16.
 */

import {
  GraphQLID as ID,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
} from 'graphql';
import {resolver,attributeFields} from 'graphql-sequelize';
import DinnerClubType from '../types/DinnerClubType';
import {DinnerClub} from '../db';
import {csrf_check,csrf_error_message} from '../csrf_check';

// Pretty simple, we simply require the ID field, and exclude the ones we do not want the user to be able to change.
// The sequelize validation will take care of input validation, and correctly reject wrong input.
// Only authorization must be done.
const changeDinnerClub = {
  type: DinnerClubType,
  // should it even be possible to change date? maybe just cancel and become cook another day?)
  args: Object.assign(attributeFields(DinnerClub,{exclude: ['id','at','KitchenId','cookId','createdAt','updatedAt']}),{
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
    return DinnerClub.update(args,{
      where: {
        id: args.id,
        // only the cook can change a dinnerclub
        cookId: root.request.user.id
      }
    }).then((affectedRows,_)=>{
      if(affectedRows != 1){
        return Promise.reject('No DinnerClub with that ID, or you are not the cook of this DinnerClub');
      }
      // Resolves the DinnerCLub
      return resolver(DinnerClub)(root,{id: args.id},context, info);
    }).catch((err)=> {
      return Promise.reject(err);
    });
  },
  description: 'Changes dinnerclub fields, only cook can change a dinnerclub'
};

export default changeDinnerClub;
