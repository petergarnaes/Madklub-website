/**
 * Created by peter on 5/14/16.
 */

import {
  GraphQLList as List,
  GraphQLNonNull as NonNull,
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
} from 'graphql';
import {resolver} from 'graphql-sequelize';
import validator from 'validator';
import UserType from '../types/UserType';
import {User,UserAccount} from '../db';
var bcrypt = require('bcrypt');

const createUser = {
  type: new ObjectType({
    name: 'CreateUserResult',
    fields: {
      errors: { type: new NonNull(new List(StringType)) },
      user: { type: UserType },
    }
  }),
  args: {
    display_name: { type: new NonNull(StringType) },
    email: { type: new NonNull(StringType) },
    password: { type: new NonNull(StringType) },
    room_number: { type: StringType }
  },
  async resolve(root, { email, password,display_name,room_number }, context, info) {
    let user = null;
    let errors = [];

    // Validate email
    if (validator.isNull(email)) {
      errors.push(...['email', 'The email filed must not be empty.']);
    } else if (!validator.isLength(email, { max: 250 })) {
      errors.push(...['email', 'The email must be at a maximum 250 characters long.']);
    }

    // Validate password
    if (validator.isNull(password)) {
      errors.push(...['password', 'The password filed must not be empty.']);
    } else if (!validator.isLength(password, { min: 6 })) {
      errors.push(...['password', 'The password must be at a minimum 6 characters long.']);
    }

    // Validate display name
    if (!validator.isNull(display_name)) {
      if (validator.isLength(display_name, {max: 50})) {
        errors.push(...['display_name','Your display name is to long']);
      }
    }

    // Validate room number
    if (!validator.isNull(room_number)) {
      if (validator.isLength(room_number, {max: 50})) {
        errors.push(...['room_number','Your rooms name is to long']);
      }
    }

    // TODO make async
    // TODO determine salt rounds globally (now default, which is 10)
    var salt = bcrypt.genSaltSync();
    var hash = bcrypt.hashSync(password, salt);

    // TODO select picture at sign up
    // Create user and account at the same time
    if(errors.length == 0){
      let res = await User.create({
        display_name: display_name,
        room_number: room_number,
        account: {
          username: display_name,
          email: email,
          email_confirmed: false,
          password_hash: hash
        },
      }, {
        include: [
          { model: UserAccount, as: 'account' },
        ],
      });
      user = resolver(User)(root,{id: res.id},context,info)
    }

    return { user, errors };
  },
  description: 'Creates new user, anyone including users not logged in can do this.'
};

export default createUser;
