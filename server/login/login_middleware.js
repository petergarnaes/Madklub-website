/**
 * Created by peter on 1/24/17.
 */
import passport from '../passport';
import successful_login from './successful_login';

export default function (app) {
    app.use(passport.initialize());
    // Is a get request, because we do not post any data, user is redirected to facebook
    // and returned to /login/facebook/return
    app.get('/login/facebook',
        passport.authenticate('facebook', { scope: ['email', 'user_location'], session: false })
    );
    // Local login
    // TODO failed login should mean red fields!
    app.post('/login',
        passport.authenticate('local', { failureRedirect: '/login', session: false }),
        successful_login,
        (req,res,next) => {res.redirect('/');next();}
    );

    // Url we want our users returned to when they have been to facebook and accepted us.
    app.get('/login/facebook/return',
        passport.authenticate('facebook', { failureRedirect: '/login', session: false }),
        successful_login,
        (req,res) => res.redirect('/')
    );
}
