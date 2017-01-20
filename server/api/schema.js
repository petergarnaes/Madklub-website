/**
 * Created by peter on 1/20/17.
 */

// A schema is what describes the graph, and how all nodes in the graph connect
// which is why this is what needs to be registered with GraphQL
// Think of it as the top type

import {
    GraphQLSchema as Schema,
    GraphQLNonNull as NonNull,
    GraphQLString as StringType,
    GraphQLObjectType as ObjectType,
} from 'graphql';

import me from './queries/me';
import kitchens from './queries/kitchens';
var bcrypt = require('bcrypt');

// Mapping sequelize models to graphql types
// TODO dealing with SimpleUserType???
import {User,Kitchen,DinnerClub} from './db';
import UserType from './types/UserType';
import KitchenType from './types/KitchenType';
import DinnerClubType from './types/DinnerClubType';

const schema = new Schema({
    query: new ObjectType({
        name: 'Query',
        fields: {
            me,
            // TODO disallow mutations on kitchens
            kitchens,
            util: {
                type: new ObjectType({
                    name: 'Util',
                    fields: {
                        hash: {
                            type: StringType,
                            args: {
                                input: {type: new NonNull(StringType)}
                            },
                            resolve: function (_, args) {
                                var salt = bcrypt.genSaltSync(10);
                                var hash = bcrypt.hashSync(args.input, salt);
                                return hash;
                            },
                            description: 'Hashes the input'
                        }
                    }
                }),
                resolve: function({ request }){
                    return { request }
                }
            },
        },
    }),
    mutation: new ObjectType({
        name: 'Mutations',
        description: '',
        fields: {
            createUser: require('./mutations/createUser').default,
            changeUser: require('./mutations/changeUser').default,
            createDinnerClub: require('./mutations/createDinnerClub').default,
            changeDinnerClub: require('./mutations/changeDinnerclub').default,
            changeKitchen: require('./mutations/changeKitchen').default,
            participate: require('./mutations/participate').default,
        }
    })
});

export default schema;