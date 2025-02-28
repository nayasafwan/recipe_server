const { GraphQLString, GraphQLList, GraphQLObjectType } = require('graphql');
const {RecipeType, IngredientInput} = require("./query")
const databaseRecipe = require("../controllers/recipe.controller")

const Mutation = new GraphQLObjectType({
    name : "Mutation",
    fields : {
        postRecipe : {
            type : RecipeType,
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
              await databaseRecipe.createRecipe(args)
             return args
            }
        }
    }
});


module.exports = Mutation;