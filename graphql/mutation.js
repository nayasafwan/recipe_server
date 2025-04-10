const { GraphQLString, GraphQLList, GraphQLObjectType, GraphQLNonNull } = require('graphql');
const {RecipeResultType, IngredientInput, ErrorMessageType} = require("./query")
const databaseRecipe = require("../controllers/recipe.controller");
const databaseUser = require("../controllers/user.controller");
const logger = require('../logger');
const bcrypt = require('bcrypt');


const saltRounds = Number(process.env.SALT_ROUNDS) || 10;

const Mutation = new GraphQLObjectType({
    name : "Mutation",
    fields : {
        postRecipe : {
            type : RecipeResultType,
            args : {
                name : { type: GraphQLString },
                description : { type: GraphQLString }, 
                image : { type: GraphQLString },
                category : { type: GraphQLString }, 
                cookingTime : { type: GraphQLString },
                ingredients: { type: new GraphQLList(IngredientInput) },
                instructions: { type: new GraphQLList(GraphQLString) },
            },
            async resolve(parent, args, context) {
                try{

                    const {req} = context;

                    if(!req || !req.session.user ){
                        return {message : "Unauthorized", code : 401}
                    }
                    await databaseRecipe.createRecipe(args)
                    return args
                }
                catch(err){
                    logger.error('Error creating recipe: ', err);
                    return {message : "Error creating recipe", code : 400}
                }
            }
        },
        signup : {
            type : ErrorMessageType,
            args : {
                username : { type: new GraphQLNonNull(GraphQLString) },
                password : { type: new GraphQLNonNull(GraphQLString) }, 
                email : { type: new GraphQLNonNull(GraphQLString) },
            },
            async resolve(parent, args, context) {
                try{

                    const {req} = context;

                    const existingUsername = await databaseUser.getUsername(args.username)
                    if(existingUsername){
                         throw new Error("Username already exists")
                    }

                    const existingEmail = await databaseUser.getEmail(args.email)
                    if(existingEmail){
                        throw new Error("Email already exists")
                    }

                    const newPassword = await bcrypt.hash(args.password, saltRounds);
                    args.password = newPassword; // Hash the password
                    const newUser = await databaseUser.createUser(args) 
                    req.session.user = {
                        id: newUser.id,
                        username: newUser.username,
                        email: newUser.email,
                    }

                    return {message : "User created successfully", code : 200}
                } 
                catch(err){
                    logger.error('Error creating user: ', err);
                    return {message : err.toString(), code : 400}
                }
            }
        },
        login : {
            type : ErrorMessageType,
            args : {
                username : { type: GraphQLString },
                email : { type: GraphQLString },
                password : { type: GraphQLString }, 
            },
            async resolve(parent, args, context) {
                try{
                    const {req} = context;
                    const {username, email , password} = args
                    let user = null;
                    if(username ){
                        user = await databaseUser.getUsername(username)
                        if(!user){
                            return {message : "Username does not exist", code : 400}
                        }
                    }

                    if(email ){
                        user = await databaseUser.getEmail(email)
                        if(!user){
                            return {message : "Email does not exist", code : 400}
                        }
                    }

                    if(!user){
                        return {message : "Username or email does not exist", code : 400}
                    }

                    const matchedPassword = await bcrypt.compare(password, user.password);

                    if(!matchedPassword){
                        return {message : "Invalid credentails", code : 400}
                    }
            
                    req.session.user = {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                    }

                    return {message : "User logged in successfully", code : 200}
                } 
                catch(err){
                    logger.error('Error logging in user: ', err);
                    return {message : err.toString(), code : 400}
                }
            }
        }
    }
});


module.exports = Mutation;