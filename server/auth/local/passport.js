import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

/* Método para validar la authenticacion local, es decir sobre un usuario y clave existente en base de datos */
function localAuthenticate(User, email, password, done) {
    
    /* consulto la base si encuentro el email */
    User.findByEmail(
        email.toLowerCase()
    ).then(user => {
        /* si no encontro el email retorno mensaje que no existe el mail */
        if (!user) {
            return done(null, false, {
                message: 'This email is not registered.'
            });
        }

        /* de existir el email valido la password */
        user.authenticate(password, function (authError, authenticated) {
            if (authError) {
                return done(authError);
            }
            if (!authenticated) {
                return done(null, false, { message: 'This password is not correct.' });
            } else {
                return done(null, user);
            }
        });
    }).catch(err => done(err));
}

export function setup(User) {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password' // this is the virtual field on the model
    }, function (email, password, done) {
        return localAuthenticate(User, email, password, done);
    }));
}
