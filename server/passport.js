/**
 * Created by peter on 1/20/17.
 */

/**
 * Passport.js reference implementation.
 * The database schema used in this sample is available at
 * https://github.com/membership/membership.db/tree/master/postgres
 */

import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import db from './api/db';
import { auth as config } from './config';
var bcrypt = require('bcrypt');

/**
 * Sign in with Facebook.
 */
passport.use(new FacebookStrategy({
    clientID: config.facebook.id,
    clientSecret: config.facebook.secret,
    callbackURL: '/login/facebook/return',
    profileFields: ['name', 'email', 'link', 'locale', 'timezone'],
    passReqToCallback: true,
}, (req, accessToken, refreshToken, profile, done) => {
    const loginName = 'facebook';
    const claimType = 'urn:facebook:access_token';
    const storeLogin = async () => {
        if (req.user) {
            const userLogin = await db.UserLogin.findOne({
                attributes: ['name', 'key'],
                where: { name: loginName, key: profile.id },
            });
            if (userLogin) {
                // There is already a Facebook account that belongs to you.
                // Sign in with that account or delete it, then link it with your current account.
                done();
            } else {
                const user = await db.User.create({
                    id: req.user.id,
                    display_name: profile.displayName,
                    picture: `https://graph.facebook.com/${profile.id}/picture?type=large`,
                    logins: [
                        { name: loginName, key: profile.id },
                    ],
                    claims: [
                        { type: claimType, value: profile.id },
                    ],
                    account: {
                        email: profile._json.email,
                    },
                }, {
                    include: [
                        { model: db.UserLogin, as: 'logins' },
                        { model: db.UserClaim, as: 'claims' },
                        { model: db.UserAccount, as: 'account' },
                    ],
                });
                done(null, {
                    id: user.id,
                    email: user.email,
                });
            }
        } else {
            const users = await db.User.findAll({
                attributes: ['id', 'email'],
                where: { '$logins.name$': loginName, '$logins.key$': profile.id },
                include: [
                    {
                        attributes: ['name', 'key'],
                        model: db.UserLogin,
                        as: 'logins',
                        required: true,
                    },
                ],
            });
            if (users.length) {
                done(null, users[0]);
            } else {
                let user = await db.User.findOne({ where: { email: profile._json.email } });
                if (user) {
                    // There is already an account using this email address. Sign in to
                    // that account and link it with Facebook manually from Account Settings.
                    done(null);
                } else {
                    user = await db.User.create({
                        display_name: profile.displayName,
                        picture: `https://graph.facebook.com/${profile.id}/picture?type=large`,
                        logins: [
                            { name: loginName, key: profile.id },
                        ],
                        claims: [
                            { type: claimType, value: accessToken },
                        ],
                        account: {
                            email: profile._json.email,
                            email_confirmed: true,
                        },
                    }, {
                        include: [
                            { model: db.UserLogin, as: 'logins' },
                            { model: db.UserClaim, as: 'claims' },
                            { model: db.UserAccount, as: 'account' },
                        ],
                    });
                    done(null, {
                        id: user.id,
                        email: user.email,
                    });
                }
            }
        }
    };
    storeLogin().catch(done);
}));

// Deprecated, not in use, we log in locally through GraphQL
passport.use(new LocalStrategy(
    // TODO prevent bruteforce, use lockout on user account
    function(username,password,done){
        // First we try and find the user
        db.UserAccount.findOne({
            where: {
                $or: [{email: username},{username: username}]
            }
        }).then(function (account) {
            // We see if a user is found, if not we return an error
            if(!account){
                done(null,false);
            }
            // User was found, we now check password
            bcrypt.compare(password,account.password_hash, function (err, res) {
                if(res){
                    // Password was correct
                    account.getUser().then(function (user) {
                        return done(null,{
                            id: user.id,
                            email: account.email
                        });
                    });
                } else {
                    // Password was incorrect, we error and return no user
                    return done(null,false);
                }
            });
        });
        // TODO make account creation like above? No, sign up must be separate
    }
));

export default passport;