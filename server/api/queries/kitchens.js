/**
 * Created by peter on 4/25/16.
 */

import {
  GraphQLObjectType as ObjectType,
  GraphQLList as ListType,
} from 'graphql';
import KitchenType from '../types/KitchenType';
import {resolver} from 'graphql-sequelize';
import {Kitchen} from '../db';

const kitchens = {
  type: new ListType(KitchenType),
  resolve: resolver(Kitchen),
  descriptions: 'All kitchens in database'
};

export default kitchens;
