const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/api/auth/google/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if user already exists
                let user = await User.findOne({ googleId: profile.id });

                if (user) {
                    // Exists, return user
                    done(null, user);
                } else {
                    // Check if email already exists
                    user = await User.findOne({ email: profile.emails[0].value });
                    if (user) {
                        // Link accounts or handle email collision
                        user.googleId = profile.id;
                        if (!user.profilePicture) {
                            user.profilePicture = profile.photos[0].value;
                        }
                        await user.save();
                        done(null, user);
                    } else {
                        // New user, create and save
                        const newUser = {
                            googleId: profile.id,
                            name: profile.displayName,
                            email: profile.emails[0].value,
                            profilePicture: profile.photos[0].value,
                        };

                        user = await User.create(newUser);
                        done(null, user);
                    }
                }
            } catch (err) {
                console.error(err);
                done(err, null);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});
