/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import {
  GraphQLObjectType as ObjectType,
  GraphQLID as ID,
  GraphQLList as ListType,
} from 'graphql';
import {resolver} from 'graphql-sequelize';
import { User, DinnerClub } from '../db';
import KitchenType from './KitchenType';
import UserParticipationType from './UserParticipationType';
import UserAccountType from './UserAccountType';
import UserClaimType from './UserClaimType';
import UserLoginsType from './UserLoginsType';
import InputDateRangeType from './InputDateRangeType';
import { SimpleUserFields } from './SimpleUserType';
import moment from 'moment';
import DateType from './DateType';
import {createdAtDoc,updatedAtDoc} from '../docs/created_updated';

const UserType = new ObjectType({
  name: 'User',
  // Object.assign({},something) copies the object, so the extra fields we Object.assign do not show up on
  // SimpleUserType in the other places it is used
  fields: Object.assign(Object.assign({},SimpleUserFields),{ // Extra fields
    id: {
      type: ID,
      description: 'Users ID to uniquely identify a user. Only used when needing to mutate specific user'
    },
    createdAt: {
        type: DateType,
        description: createdAtDoc
    },
    updatedAt: {
        type: DateType,
        description: updatedAtDoc
    },
    kitchen: {
      type: KitchenType,
      resolve: resolver(User.Kitchen),
      description: 'The Kitchen of which the user is a part of'
    },
    participating: {
      type: new ListType(UserParticipationType),
        args: {
            range: {
                type: InputDateRangeType,
                description: 'Select Participation\'s in this range'
            }
        },
      resolve: resolver(User.Participating,{
        before: (options,args) => {
            // We ALWAYS order by 'at' date of dinnerclubs. Very important, as frontend needs to pick the upcoming one
            var includes = {model: DinnerClub};
            options.order = [
                [{ model: DinnerClub }, 'at', 'ASC']
            ];
            if(args.range){
                var start = moment(args.range.start);
                var end = moment(args.range.end);
                // Dates must be valid
                if (start.isValid() && end.isValid() && start.isBefore(end)) {
                    includes.where = {
                        at: {
                            $gt: start.toISOString(),
                            $lt: end.toISOString()
                        }
                    };
                } else {
                    // date is not valid
                    return Promise.reject('Dates invalid! Make sure dates follow ISO 8601 date format and make sure ' +
                        'start is before end...');
                }
            }
            options.include = [includes];
            return options;
        }
      }),
      description: 'All the dinners this user is participating in, in ascending order of date and time it is held at.'
    },
    account: {
      type: UserAccountType,
      resolve: resolver(User.UserAccount),
      description: 'Account information'
    },
    claims: {
      type: new ListType(UserClaimType),
      resolve: resolver(User.UserClaims),
      description: 'Authentication claims of the user'
    },
    logins: {
      type: new ListType(UserLoginsType),
      resolve: resolver(User.UserLogins),
      description: 'Authentication logins for the user'
    }
  }),
  description: 'Represents the current user, with access to certain account information, ' +
  'kitchen and dinnerclub data'
});

export default UserType;
