/**
 * Created by peter on 5/17/16.
 */

import {
  GraphQLInputObjectType as InputObjectType,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
} from 'graphql';
import {resolver,attributeFields} from 'graphql-sequelize';
import UserParticipationType from '../types/UserParticipationType';
import {sequelize,User,Participation,Kitchen,DinnerClub} from '../db';
import {csrf_check,csrf_error_message} from '../csrf_check';

// Pretty simple, we simply require the ID field, and exclude the ones we do not want the user to be able to change.
// The sequelize validation will take care of input validation, and correctly reject wrong input.
// Only authorization must be done.
const participate = {
  //type: UserParticipationType,
  type: UserParticipationType,
  // should it even be possible to change date? maybe just cancel and become cook another day?)
  args: {
    // Using ID, to support different types of dinnerclubs in the future on the same day.
    id: {
      type: new NonNull(StringType),
      description: 'ID of the dinnerclub to join'
    },
    participating: {
      type: new InputObjectType({
        name: 'Participating',
        fields: attributeFields(Participation,{exclude: ['id','up_key','dp_key','createdAt','updatedAt']}),
        description: 'The cooks own initial participation'
      }),
      description: 'Specific info about your participation like number of guests etc.'
    }
  },
  resolve: function(root, args, context, info) {
    // This is how we must do csrf checks for now...
    if(csrf_check(root)){
      return Promise.reject(csrf_error_message);
    }

    // Here we see how to test for the same day
    return sequelize.transaction((t)=>
      User.findById(root.request.user.id,{transaction: t}).then((user)=>{
        // We try and find a record satisfying conditions that mean we are not allowed to insert or update
        return DinnerClub.findOne({
          include: [{model: Participation, as: 'participant', where: {up_key: user.id}}],
          where: {
            id: args.id
          },
          transaction: t
        }).then((dinnerclub)=>{
          console.log(dinnerclub.participant);
          if(dinnerclub.shopping_complete){
            Promise.reject('Shopping has completed, and it is no longer possible to change participation');
          }
          if(dinnerclub.participant){
            // We update
            const participationId = dinnerclub.participant[0].id;
            return Participation.update(args.participating,{transaction: t, where: {id: participationId}})
              .then((a,_)=>participationId);
          } else {
            // We insert
            return Participation.create(args.participating,{transaction: t}).then((p)=>p);
          }
        })
      })
      // If integer, its the id of the element we want to return, if not it is the create object
    ).then((res)=>Number.isInteger(res) ? resolver(Participation)(root, {id: res}, context, info) : res);
  },
  description: 'Changes or creates participation, based on if current user is participating'
};

export default participate;
