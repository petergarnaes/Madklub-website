/**
 * Created by peter on 5/16/16.
 */

/**
 * Created by peter on 5/15/16.
 */

import {
  GraphQLInputObjectType as InputObjectType,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
} from 'graphql';
import {resolver,attributeFields} from 'graphql-sequelize';
import DinnerClubType from '../types/DinnerClubType';
import {sequelize,User,DinnerClub,Kitchen,Participation} from '../db';
import {csrf_check,csrf_error_message} from '../csrf_check';

// Pretty simple, we simply require the ID field, and exclude the ones we do not want the user to be able to change.
// The sequelize validation will take care of input validation, and correctly reject wrong input.
// Only authorization must be done.
const createDinnerClub = {
  type: DinnerClubType,
  // should it even be possible to change date? maybe just cancel and become cook another day?)
  args: Object.assign(attributeFields(DinnerClub,{exclude: ['id','KitchenId','cookId','createdAt','updatedAt']}),{
    // Client side is responsible for picking the exact moment in time the dinnerclub is held.
    // So defaulting to the kitchens default_mealtime is the clients responsibility. Why? Because server cannot know
    // where in the world the request is coming from, and as a result how to convert to the default.
    at: {
      type: new NonNull(StringType),
      description: 'Date and time for the dinner club'
    },
    participation: {
      type: new InputObjectType({
        name: 'Participation',
        fields: attributeFields(Participation,{exclude: ['id','up_key','dp_key','cancelled','createdAt','updatedAt']}),
        description: 'The cooks own initial participation'
      }),
    }
  }),
  resolve: function(root, args, context, info) {
    // This is how we must do csrf checks for now...
    if(csrf_check(root)){
      return Promise.reject(csrf_error_message);
    }
    // Test the date format is correct
    var inputDate = new Date(args.at);
    if(isNaN(inputDate.getTime())){
      return Promise.reject('Not a valid date, dates must be in javascript date format');
    }
    // First convert to only date
    // Will be done in zero-offset UTC time, but things are stored that way to
    console.log(inputDate.getTimezoneOffset());
    var theD = inputDate.toISOString().substring(0,10);
    // When no time is specified, time will default to 0 on UTC+0000
    //let defaultTime = (inputDate.getUTCHours() == 0 && inputDate.getUTCMinutes() == 0 && inputDate.getUTCSeconds() == 0);

    // First retrieve user
    return sequelize.transaction((t)=>{
      return User.findById(root.request.user.id,{attributes: ['id','memberId'],transaction: t}).then((user)=>{
        if(!user){
          Promise.reject('You are currently not logged in');
        }
        // Retreive info to determine if the date clashes
        return DinnerClub.findAll({
          attributes: { include: [[sequelize.fn('DATE',sequelize.col('at')),'atDay']]},
          where: {
            KitchenId: user.memberId,
            $and: sequelize.where(sequelize.col('atDay'),theD)
          },
          transaction: t
        }).then((results)=>{
          // Determine if date clashes
          if(results.length > 0){
            return Promise.reject('This date is already occupied');
          }
          // Set up participation, defaults on all fields if not given anything
          args.participant = args.participation ? args.participation : {};
          args.participant.up_key = user.id;

          args.at = inputDate;
          // The include will then automatically set the foreign key?
          var createArgs = {transaction: t,include: [{ model: Participation, as: 'participant'}]};
          args.cookId = user.id;
          args.KitchenId = user.memberId;
          return DinnerClub.create(args,createArgs).then((dinnerclub)=>{
            // Can we return just the dinnerclub object? (we should be able to)
            return dinnerclub;
            //return resolver(DinnerClub)(root,{id: dinnerclub.id},context, info);
          });
        });
      });
    });
  },
  description: 'Creates a dinnerclub if the date provided is unique to your kitchen'
};

export default createDinnerClub;
