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
import {User} from '../db';
import KitchenType from './KitchenType';
import UserParticipationType from './UserParticipationType';
import UserAccountType from './UserAccountType';
import UserClaimType from './UserClaimType';
import UserLoginsType from './UserLoginsType';
import {SimpleUserType,SimpleUserFields} from './SimpleUserType';

const UserType = new ObjectType({
  name: 'User',
  // Object.assign({},something) copies the object, so the extra fields we Object.assign do not show up on
  // SimpleUserType in the other places it is used
  fields: Object.assign(Object.assign({},SimpleUserFields),{ // Extra fields
    id: {
      type: ID,
      description: 'Users ID to uniquely identify a user. Only used when needing to mutate specific user'
    },
    kitchen: {
      type: KitchenType,
      resolve: resolver(User.Kitchen),
      description: 'The kitchen of which the user is a part of'
    },
    participating: {
      type: new ListType(UserParticipationType),
      resolve: resolver(User.Participating),
      description: 'All the dinners this user is participating in'
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
