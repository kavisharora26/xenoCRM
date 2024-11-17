// code for browser authentication
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { isAuthenticated } from './middlewares/authMiddleware.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import apiRoutes from './routes/route.js';



//for deployment
import path from 'path'
import { fileURLToPath } from "url";

dotenv.config();

const app = express();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/xenoCRM')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));


//esmodule fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000', // Specific origin instead of wildcard
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 204
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, './client/build')));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000
    },
    proxy: process.env.NODE_ENV === 'production'
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:8080/auth/google/callback",
    proxy: true
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const userData = {
            googleId: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
            picture: profile.photos[0].value
        };
        return done(null, userData);
    } catch (error) {
        return done(error, null);
    }
}));

app.get('/auth/google',
    passport.authenticate('google', { 
        scope: ['email', 'profile'],
        prompt: 'select_account'
    })
);

app.get('/auth/google/callback',
    passport.authenticate('google', { 
        failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:3000'}/login?error=true`
    }),
    (req, res) => {
        res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/dashboard`);
    }
);

app.get('/auth/status', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({
            authenticated: true,
            user: req.user
        });
    } else {
        res.json({
            authenticated: false,
            user: null
        });
    }
});

app.get('/api/protected', isAuthenticated, (req, res) => {
    res.json({
        message: 'This is a protected route',
        user: req.user
    });
});

app.get('/auth/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ error: 'Error logging out' });
        }
        req.session.destroy((err) => {
            if (err) {
                console.error('Session destruction error:', err);
            }
            res.clearCookie('connect.sid');
            res.json({ success: true, message: 'Logged out successfully' });
        });
    });
});


app.use('/api', apiRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

//rest api
app.use('*', function(req, res){
    res.sendFile(path.join(__dirname, './client/build/index.html'));
  });

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});




// code for postman check
// import express from 'express';
// import session from 'express-session';
// import passport from 'passport';
// import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// import { isAuthenticated } from './middlewares/authMiddleware.js';
// import dotenv from 'dotenv';
// import mongoose from 'mongoose';
// import cors from 'cors';

// import apiRoutes from './routes/route.js';

// dotenv.config();

// const app = express();

// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/xenoCRM')
//     .then(() => console.log('Connected to MongoDB'))
//     .catch(err => console.error('MongoDB connection error:', err));

// app.use(cors({
//     origin: process.env.CLIENT_URL || 'http://localhost:3000',
//     credentials: true
// }));
// app.use(express.json());
// app.use(session({
//     secret: process.env.SESSION_SECRET || 'your-session-secret',
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//         secure: false, // set to false for testing with Postman
//         maxAge: 24 * 60 * 60 * 1000
//     }
// }));

// app.use(passport.initialize());
// app.use(passport.session());

// passport.serializeUser((user, done) => {
//     done(null, user);
// });

// passport.deserializeUser((user, done) => {
//     done(null, user);
// });

// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: "http://localhost:8080/auth/google/callback"
// }, async (accessToken, refreshToken, profile, done) => {
//     try {
//         const userData = {
//             googleId: profile.id,
//             email: profile.emails[0].value,
//             name: profile.displayName,
//             picture: profile.photos[0].value
//         };
//         return done(null, userData);
//     } catch (error) {
//         return done(error, null);
//     }
// }));

// app.get('/auth/google',
//     passport.authenticate('google', { scope: ['email', 'profile'] })
// );

// app.get('/auth/google/callback',
//     passport.authenticate('google', { failureRedirect: '/auth/failed' }),
//     (req, res) => {
//         res.json({ 
//             message: 'Authentication successful',
//             user: req.user
//         });
//     }
// );

// app.get('/auth/status', (req, res) => {
//     res.json({
//         authenticated: req.isAuthenticated(),
//         user: req.user || null
//     });
// });

// app.get('/api/protected', isAuthenticated, (req, res) => {
//     res.json({
//         message: 'This is a protected route',
//         user: req.user
//     });
// });

// app.get('/auth/logout', (req, res) => {
//     req.logout((err) => {
//         if (err) {
//             return res.status(500).json({ error: 'Error logging out' });
//         }
//         res.json({ message: 'Logged out successfully' });
//     });
// });

// app.get('/auth/failed', (req, res) => {
//     res.status(401).json({ error: 'Authentication failed' });
// });

// app.use('/api', apiRoutes);

// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).json({ error: 'Something went wrong!' });
// });

// const PORT = process.env.PORT || 8080;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });
