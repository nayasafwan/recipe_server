const { GraphQLString, GraphQLList, GraphQLObjectType, GraphQLNonNull } = require('graphql');
const {RecipeResultType, IngredientInput} = require("./type")
const databaseRecipe = require("../controllers/recipe.controller");
const databaseUser = require("../controllers/user.controller");
const logger = require('../logger');
const bcrypt = require('bcrypt');
const { RecipeType } = require('../schema/schema');
const { errorNames } = require('../constants/constants');


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
                    await databaseRecipe.createRecipe(args, req.session.user.id)
                    return args
                }
                catch(err){
                    logger.error('Error creating recipe: ', err);
                    return {message : "Error creating recipe", code : 400}
                }
            }
        },
        editRecipe : {
            type : RecipeType,
            args : {
                id : {type : GraphQLString},
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
                        throw Error(errorNames.UNAUTHORIZED)
                    }
                    await databaseRecipe.editRecipe(args.id, args)
                    return args
                }
                catch(err){
                    logger.error('Error creating recipe: ', err);
 
                    if (
                        err.message === errorNames.UNAUTHENTICATED
                    ) {
                        throw err;
                    }

                    throw new Error(errorNames.SERVER_ERROR)
                }
            }
        }
    }
});


module.exports = Mutation;