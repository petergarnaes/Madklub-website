/**
 * Created by peter on 4/24/16.
 */
import {
  GraphQLNonNull as NonNull,
  GraphQLObjectType as ObjectType,
  GraphQLList as ListType,
  GraphQLBoolean as BooleanType,
  GraphQLID as ID,
} from 'graphql';
import {resolver} from 'graphql-sequelize';
import {Kitchen,DinnerClub} from '../db';
import {attributeFields} from 'graphql-sequelize';
import DinnerClubType from './DinnerClubType';
import PeriodType from './PeriodType';
import InputDateRangeType from './InputDateRangeType';
import {SimpleUserType} from './SimpleUserType';
import moment from 'moment';
import DateType from './DateType';
import {createdAtDoc,updatedAtDoc} from '../docs/created_updated';

const KitchenType = new ObjectType({
    name: 'Kitchen',
    fields: Object.assign(attributeFields(Kitchen,{exclude: ['adminId','createdAt','updatedAt','associatedKitchenId']}),{ // Extra fields
        createdAt: {
            type: new NonNull(DateType),
            description: createdAtDoc
        },
        updatedAt: {
            type: new NonNull(DateType),
            description: updatedAtDoc
        },
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
        dinnerclub: {
          type: DinnerClubType,
          args: {
            id: {
              type: new NonNull(ID),
              description: 'The ID of the dinnerclub you want to look at'
            }
          },
          resolve: (a,b,c,d) => resolver(Kitchen.DinnerClubs,{
                before: (options,args) => {
                    options.where = {
                      id: args.id
                    };
                    return options;
                }
            })(a,b,c,d).then((ds)=>ds[0]),
          //.then((dinnerclubs)=>dinnerclubs[0]),
          description: 'Specific dinnerclub of this kitchen.'
        },
        periods: {
            type: new ListType(PeriodType),
            args: {
                archived: {
                    type: BooleanType,
                    description: 'Filters periods based on archived'
                }
            },
            resolve: resolver(Kitchen.Periods,{
                before: (options,args) => {
                    if(args.archived){
                        options.where.archived = args.archived;
                    }
                    return options;
                }
            }),
            description: 'List of all periods associated with this kitchen, both active' +
            'and inactive.'
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
