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
  resolve: function({request,response},args,context,info) {
    // TODO Check for csrf with double cookie submit method
    //if(request && request.user.id && req.cookies.csrf_token === req.get('X-CSRF-TOKEN')){
    if(request.exp){
        console.log("Testing...")
        console.log(request.exp)
    }
    if(request && request.user && request.user.id){
      console.log("Valid login");
      return resolver(User)({request: request},{id: request.user.id},context,info);
    } else {
      console.log("Invalid login");
      console.log(request);
      console.log(request.user);
      response.status(403);
      return null;
    }
  },
  description: 'The current logged in user'
};

export default me;
