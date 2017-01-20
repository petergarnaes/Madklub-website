/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import UserType from '../types/UserType';
import {resolver} from 'graphql-sequelize';
import {User} from '../db';

const me = {
  type: UserType,
  resolve: function({request},args,context,info) {
    // TODO Check for csrf with double cookie submit method
    //if(request && request.user.id && req.cookies.csrf_token === req.get('X-CSRF-TOKEN')){
    if(request && request.user.id){
      console.log("Valid login");
      return resolver(User)({request: request},{id: request.user.id},context,info);
    } else {
      console.log("Invalid login");
      return null;
    }
  },
  description: 'The current logged in user'
};

export default me;
