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
// const { GraphQLError } = require("graphql"); //can return erros array

const CategoryEnumType = new GraphQLEnumType({
  name: "Category",
  values: {
    BREAKFAST: { value: "Breakfast" },
    LUNCH: { value: "Lunch" },
    DINNER: { value: "Dinner" },
    SNACKS: { value: "Snacks" },
    APPETIZER: { value: "Appetizer" },
    BEVERAGE: { value: "Beverage" },
    DESSERT: { value: "Dessert" },
    SOUP: { value: "Soup" },
    SALAD: { value: "Salad" },
  },
});

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

//return type
const IngredientType = new GraphQLObjectType({
  name: "Ingredient",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    quantity: { type: GraphQLFloat },
    measuringUnit: { type: GraphQLString },
    abbreviation : { type: GraphQLString }
  }),
});

//return type
const InstructionType = new GraphQLObjectType({
  name: "Instruction",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    order: { type: GraphQLInt },
  }),
});

const ErrorMessageType = new GraphQLObjectType({
  name: "ErrorMessage",
  fields: () => ({
    message: { type: GraphQLString },
    code: { type: GraphQLInt },
  }),
});


const UserType = new GraphQLObjectType({
  name: "User",
  fields : () =>({
    usernmae : { type: GraphQLString },
    code : { type: GraphQLInt },
  })
})

const DateScalar = new GraphQLScalarType({
  name: "Date",
  description: "Custom Date type",
  serialize(value) {
    return value;
  },
  parseValue(value) {
    // Graphql receives data in string format and converts it to Date
    return new Date(value);
  },
  parseLiteral(ast) {
    // values directly written in the GraphQL query
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  },
});

const RecipeType = new GraphQLObjectType({
  name: "Recipe",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    image: { type: GraphQLString },
    category: { type: CategoryEnumType },
    cookingTime: { type: GraphQLString },
    createdAt: { type: DateScalar },
    ingredients: { type: new GraphQLList(IngredientType) },
    instructions: { type: new GraphQLList(InstructionType) },
  }),
});

const RecipesList = new GraphQLObjectType({
  name: "RecipesList",
  fields: () => ({
    recipes: { type: new GraphQLList(RecipeType) },
    count: { type: GraphQLInt },
  })
})


//return type
// const UserType = new GraphQLObjectType({
//   name: "User",
//   fields: () => ({
//     id: { type: GraphQLID },
//     username: { type: GraphQLString },
//     email: { type: GraphQLString },
//     password: { type: GraphQLString },
//   }),
// });

const RecipeResultType = new GraphQLUnionType({
    name: "RecipeResult",
    types: [RecipeType, ErrorMessageType],
    resolveType(value) {
        if(value.message) {
            return "ErrorMessage"
        }
        return "Recipe"
    }
})

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

module.exports = { RootQuery, RecipeType, IngredientInput, UserType, RecipeResultType, ErrorMessageType };
