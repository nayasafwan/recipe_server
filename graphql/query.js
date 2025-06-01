const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLFloat,
  GraphQLScalarType,
  GraphQLID,
  GraphQLEnumType,
  GraphQLInputObjectType,
  GraphQLUnionType,
} = require("graphql");
const databaseRecipe = require("../controllers/recipe.controller");
const recipeCache = require("../cache/recipe.cache");
const cache = require("../cache/cache");
const {RecipesList, RecipeResultType, UserType} = require("./type")




const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
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
      type: RecipeResultType,
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
          return {
                message: "Recipe not found",
                code: 400,
            }
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
    },

    user: {
      type : UserType,
      resolve (parent, args, context) {
          const {req} = context;

          if( !req.session.user ){
              return {username : null, code : 401}
          }
          return {
              username : req.session.user.username, 
              code : 200
          }
      }
    },
  },
});

module.exports = { RootQuery };
