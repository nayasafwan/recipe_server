const { errorNames } = require("../constants/constants");
const { UserType } = require("../schema/schema");
const {GraphQLNonNull, GraphQLString} = require("graphql")
const databaseUser = require("../controllers/user.controller")
const logger = require('../logger');
const bcrypt = require('bcrypt');


const saltRounds = Number(process.env.SALT_ROUNDS) || 10; 

module.exports = {
    signup: {
        type: UserType,
        args: {
            username: { type: new GraphQLNonNull(GraphQLString) },
            password: { type: new GraphQLNonNull(GraphQLString) },
            email: { type: new GraphQLNonNull(GraphQLString) },
        },
        async resolve(parent, args, context) {
            try {

                const { req } = context;

                const existingUsername = await databaseUser.getUsername(args.username)
                if (existingUsername) {
                    throw new Error(errorNames.USERNAME_ALREADY_EXISTS)
                }

                const existingEmail = await databaseUser.getEmail(args.email)
                if (existingEmail) {
                    throw new Error(errorNames.EMAIL_ALREADY_EXISTS)
                }

                const newPassword = await bcrypt.hash(args.password, saltRounds);
                args.password = newPassword; // Hash the password
                const newUser = await databaseUser.createUser(args)
                req.session.user = {
                    id: newUser.id,
                    username: newUser.username,
                    email: newUser.email,
                }

                return { username: newUser.username }
            }
            catch (err) {
                logger.error('Error creating user: ', err);

                if (
                    err.message === errorNames.USERNAME_NOT_FOUND ||
                    err.message === errorNames.EMAIL_NOT_FOUND 
                ) {
                    throw err;
                }
                throw new Error(errorNames.SERVER_ERROR)
            }
        }
    },
    login: {
        type: UserType,
        args: {
            username: { type: GraphQLString },
            email: { type: GraphQLString },
            password: { type: GraphQLString },
        },
        async resolve(parent, args, context) {
            try {
                const { req } = context;
                const { username, email, password } = args
                let user = null;
                if (username) {
                    user = await databaseUser.getUsername(username)
                    if (!user) {
                        throw new Error(errorNames.USERNAME_NOT_FOUND)
                    } 
                }

                if (email) {
                    user = await databaseUser.getEmail(email)
                    if (!user) {
                        throw new Error(errorNames.EMAIL_NOT_FOUND)
                    }
                }

                // if (!user) {
                //     return { message: "Username or email does not exist", code: 400 }
                // }

                const matchedPassword = await bcrypt.compare(password, user.password);

                if (!matchedPassword) {
                    throw new Error(errorNames.INVALID_CREDENTIALS)
                }

                req.session.user = {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                }

                return {  username: user.username }
            }
            catch (err) {
                logger.error('Error logging in user: ', err);
                if (
                    err.message === errorNames.USERNAME_NOT_FOUND ||
                    err.message === errorNames.EMAIL_NOT_FOUND ||
                    err.message === errorNames.INVALID_CREDENTIALS
                ) {
                    throw err;
                }
                
                throw new Error(errorNames.SERVER_ERROR)
            }
        }
    }
}