/**
 * Created by peter on 1/20/17.
 */

export const port = process.env.PORT || 3000;
export const host = process.env.WEBSITE_HOSTNAME || `localhost:${port}`;

export const databaseUrl = process.env.DATABASE_URL || 'postgresql://postgres:ixMWt5p6BSyumpc@localhost:5432/madklub';
export const developmentDB = {
    dialect: 'sqlite',
    storage: './madklub.db'
};
export const analytics = {

    // https://analytics.google.com/
    google: { trackingId: process.env.GOOGLE_TRACKING_ID || 'UA-XXXXX-X' },

};

export const auth = {

    jwt: { secret: process.env.JWT_SECRET || 'Madklub' },

    // https://developers.facebook.com/
    facebook: {
        id: process.env.FACEBOOK_APP_ID || '844405125668047', //186244551745631
        secret: process.env.FACEBOOK_APP_SECRET || '7050949c6e348f161d8cb73bddcfc26e', //a970ae3240ab4b9b8aae0f9f0661c6fc
    },

    // https://cloud.google.com/console/project
    google: {
        id: process.env.GOOGLE_CLIENT_ID || '251410730550-ahcg0ou5mgfhl8hlui1urru7jn5s12km.apps.googleusercontent.com',
        secret: process.env.GOOGLE_CLIENT_SECRET || 'Y8yR9yZAhm9jQ8FKAL8QIEcd',
    },

    // https://apps.twitter.com/
    twitter: {
        key: process.env.TWITTER_CONSUMER_KEY || 'Ie20AZvLJI2lQD5Dsgxgjauns',
        secret: process.env.TWITTER_CONSUMER_SECRET || 'KTZ6cxoKnEakQCeSpZlaUCJWGAlTEBJj0y2EMkUBujA7zWSvaQ',
    },

};