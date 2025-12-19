import { betterAuth} from 'better-auth';
import {mongoAdapter} from 'better-auth/adapters/mongo';
import User from "../models/user.model.js";
import Session from "../models/session.model.js";
import Account from "../models/account.model.js";


export const auth = betterAuth({
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL,
    basePath:'/api/auth',
    database: mongoAdapter({
        user: User,
        session: Session,
        account: Account,
    }),
    socialProviders:{
        github:{
            clientId:process.env.GITHUB_CLIENT_ID,
            clientSecret:process.env.GITHUB_CLIENT_SECRET,
        },
    },
    emailAndPassword: {
        enabled: false,
    }

});