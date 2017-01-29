/**
 * Created by peter on 4/24/16.
 */
import {
  GraphQLObjectType as ObjectType,
  GraphQLList as ListType,
} from 'graphql';
import {resolver} from 'graphql-sequelize';
import {Kitchen} from '../db';
import {attributeFields} from 'graphql-sequelize';
import DinnerClubType from './DinnerClubType';
import InputDateRangeType from './InputDateRangeType';
import {SimpleUserType} from './SimpleUserType';
import moment from 'moment';

const KitchenType = new ObjectType({
  name: 'Kitchen',
  fields: Object.assign(attributeFields(Kitchen,{exclude: ['adminId']}),{ // Extra fields
    dinnerclubs: {
      type: new ListType(DinnerClubType),
      args: {
        range: {
          type: InputDateRangeType,
          description: 'Select DinnerClubs in this range'
        }
      },
      resolve: resolver(Kitchen.DinnerClubs,{
        before: (options,args) => {
          // We ALWAYS order by 'at' date. Very important, as frontend needs to pick the upcoming one
          options.order = [
            ['at', 'ASC']
          ];
          if(args.range){
            var start = moment(args.range.start);
            var end = moment(args.range.end);
            // Dates must be valid
            if (start.isValid() && end.isValid() && start.isBefore(end)) {
              options.where = {
                at: {
                  $gt: start.toISOString(),
                  $lt: end.toISOString()
                }
              };
            } else {
              // date is not valid
              Promise.reject('Dates invalid! Make sure dates follow ISO 8601 date format and make sure ' +
                  'start is before end...');
              return options;
            }
          }
          return options;
        }
      }),
      description: 'List of dinnerclubs, both future and past, associated with this kitchen'
    },
    members: {
      type: new ListType(SimpleUserType),
      resolve: resolver(Kitchen.Members),
      description: 'List of users that are a part of this kitchen community, and participants ' +
      'of this kitchens dinners'
    },
    admin: {
      type: SimpleUserType,
      resolve: resolver(Kitchen.Admin),
      description: 'The admin of the kitchen'
    }
  }),
  description: 'Kitchens represent the community of which people organize dinners together'
});

export default KitchenType;
