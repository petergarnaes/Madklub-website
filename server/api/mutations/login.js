/**
 * Created by peter on 1/23/17.
 */
import {
    GraphQLID as ID,
    GraphQLString as StringType,
    GraphQLObjectType as ObjectType,
    GraphQLBoolean as BooleanType,
    GraphQLNonNull as NonNull,
} from 'graphql';
import db from '../db';
import successful_login from '../../login/successful_login';
var bcrypt = require('bcrypt');

/*function successful_login(req, res) {
    const expiresIn = 60 * 60 * 24 * 180; // 180 days
    const token = jwt.sign(req.user, auth.jwt.secret, { expiresIn });
    // httpOnly true since the client side does not need access to it
    res.cookie('id_token', token, { maxAge: 1000 * expiresIn, httpOnly: true });
    return token;
    //res.redirect('/');
}*/

function log_in(username,password){
    // First we try and find the user
    return (db.UserAccount.findOne({
        where: {
            $or: [{email: username},{username: username}]
        }
    }).then((account) => {
        // We see if a user is found, if not we return an error
        if(!account){
            return false;
        }
        // User was found, we now check password
        return bcrypt.compare(password,account.password_hash).then((res) => {
            if(res){
                // Password was correct
                return account.getUser().then((user) => {
                    return {
                        id: user.id,
                        email: account.email
                    };
                });
            } else {
                // Password was incorrect, we error and return no user
                return false;
            }
        });
    }));
}

// Automatically resolves kitchen based on user, checks user is admin as well
const login = {
    type: new ObjectType({
        name: 'Login',
        fields: {
            success: {
                type: new NonNull(BooleanType),
                description: 'Did the user authorize successfully'
            },
            token: {
                type:StringType,
                description: 'The login token, is a JWT token. Must be sent in cookie as "id_token" on subsequent requests'
            },
            feedback: {
                type: new NonNull(StringType),
                description: 'The feedback to display to the user if "success" is false'
            }
        },
        description: 'Login information'
    }),
    args: {
        username: {
            type: new NonNull(StringType),
            description: 'Username or email of the user logging in login'
        },
        password: {
            type: new NonNull(StringType),
            description: 'Password of the user logging in'
        }
    },
    resolve: function({request,response}, args, context, info) {
        console.log('We got args: ');
        console.log(args);
        return log_in(args.username,args.password).then((login) => {
            console.log("the login is: "+JSON.stringify(login));
            if(login){
                request.user = {id: login.id, email: login.email};
                let token = successful_login(request,response);
                //console.log(response.headers);
                //let token = response.headers['id_token'];
                return {success: true, token: token,feedback: "Successfully authorized"}
            } else {
                return {success: false, token: '',feedback: "Invalid username or password"}
            }
        }).catch((err)=>Promise.reject(err));
    },
    description: 'End point used to retrieve Authorization token. This must be sent in the cookie as "id_token". '+
    'For mutations you should sent a "csrf_token" in the cookie as well as in the http header as "X-CSRF-TOKEN". They ' +
    'should match eachother, and be the same. The CSRF token can be whatever you want, server only checks they match'
};

export default login;
