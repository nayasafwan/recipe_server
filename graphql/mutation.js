const { GraphQLString, GraphQLList, GraphQLObjectType } = require('graphql');
const {RecipeResultType, IngredientInput} = require("./query")
const databaseRecipe = require("../controllers/recipe.controller");
const logger = require('../logger');

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
            async resolve(parent, args) {
                try{
                    await databaseRecipe.createRecipe(args)
                    return args
                }
                catch(err){
                    logger.error('Error creating recipe: ', err);
                    return {error : "Error creating recipe", code : 400}
                }
            }
        }
    }
});


module.exports = Mutation;