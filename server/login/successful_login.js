/**
 * Created by peter on 1/24/17.
 */
import { auth } from '../config';
import jwt from 'jsonwebtoken';

export default function(req, res,next) {
    console.log("We successfully logged in!!!!!");
    const expiresIn = 60 * 60 * 24 * 1; // 180 days
    const token = jwt.sign(req.user, auth.jwt.secret, {expiresIn});
    // httpOnly true since the client side does not need access to it
    res.cookie('id_token', token, {maxAge: 1000 * expiresIn, httpOnly: true});
    next();
    //return token;
    //res.redirect('/');
}