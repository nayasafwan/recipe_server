const { errorTypes, errorNames } = require("../constants/constants");
const { RecipeType } = require("../schema/schema");
const { GraphQLInputObjectType, GraphQLString, GraphQLFloat, GraphQLList} = require("graphql");
const databaseRecipe = require("../controllers/recipe.controller");
const logger = require('../logger');

//Input from postRecipe mutation
const IngredientInput = new GraphQLInputObjectType({
  name: "IngredientInput",
  fields: {
    name: { type: GraphQLString },
    quantity: { type: GraphQLFloat },
    measuringUnit: { type: GraphQLString },
    abbreviation : { type: GraphQLString }
  },
});


module.exports = {
    postRecipe: {
        type: RecipeType,
        args: {
            name: { type: GraphQLString },
            description: { type: GraphQLString },
            image: { type: GraphQLString },
            category: { type: GraphQLString },
            cookingTime: { type: GraphQLString },
            ingredients: { type: new GraphQLList(IngredientInput) },
            instructions: { type: new GraphQLList(GraphQLString) },
        },
        async resolve(parent, args, context) {
            try {

                const { req } = context;

                if (!req || !req.session.user) {
                    throw new Error(errorNames.UNAUTHENTICATED)
                }
                await databaseRecipe.createRecipe(args, req.session.user.id)
                return args
            }
            catch (err) {
                logger.error('Error creating recipe: ', err);
                throw new Error(errorNames.SERVER_ERROR)
            }
        }
    },
    editRecipe: {
        type: RecipeType,
        args: {
            id: { type: GraphQLString },
            name: { type: GraphQLString },
            description: { type: GraphQLString },
            image: { type: GraphQLString },
            category: { type: GraphQLString },
            cookingTime: { type: GraphQLString },
            ingredients: { type: new GraphQLList(IngredientInput) }, 
            instructions: { type: new GraphQLList(GraphQLString) },
        },
        async resolve(parent, args, context) {
            try {

                const { req } = context;

                if (!req || !req.session.user) {
                    throw new Error(errorNames.UNAUTHENTICATED)
                }

                await databaseRecipe.editRecipe(args.id, args)
                return args
            }
            catch (err) {
                if (
                    err.message === errorNames.UNAUTHENTICATED
                ) {
                    throw err;
                }

                throw new Error(errorNames.SERVER_ERROR)
            }
        }
    },
}