const { RecipesList, RecipeType } = require("../schema/schema");
const {errorNames} = require("../constants/constants")
const {GraphQLInt, GraphQLString, GraphQLID} = require("graphql")
const databaseRecipe = require("../controllers/recipe.controller");
const recipeCache = require("../cache/recipe.cache");
const cache = require("../cache/cache"); 

module.exports = {
    recipes: {
        type: RecipesList,
        args: {
            skip: { type: GraphQLInt, defaultValue: 0 },
            take: { type: GraphQLInt, defaultValue: 10 },
            category: { type: GraphQLString },
            search: { type: GraphQLString },
        },
        resolve: async (parent, args) => {
            const isCachEmpty = await cache.isCachEmptyFunc();

            if (isCachEmpty) {
                cache.cacheData();
                return await databaseRecipe.getRecipes(args);
            }

            const recipes = await recipeCache.getCachedRecipes(args);
            return recipes
        },
    },
    recipe: {
        type: RecipeType,
        args: {
            id: { type: GraphQLID },
        },
        resolve: async (parent, args) => {
            const cachedRecipe = await recipeCache.getCachedRecipeById(args.id);
            console.log("Cached recipe ", cachedRecipe);
            if (cachedRecipe) {
                return cachedRecipe;
            }

            const isCachEmpty = await cache.isCachEmptyFunc();

            const recipe = await databaseRecipe.getRecipeById(args.id);

            if (!recipe) {
                throw new Error(errorNames.RECIPE_NOT_FOUND)
            }

            if (isCachEmpty) {
                //if cache is empty, cache all recipes
                cache.cacheData();
            } else {
                //if cache is not empty, get recipe by id and cache it
                recipeCache.addRecipeToCache();
            }

            return recipe;
        },
    }
}