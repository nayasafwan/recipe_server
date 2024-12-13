const { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt, GraphQLFloat , GraphQLScalarType, GraphQLID, GraphQLEnumType, GraphQLInputObjectType } = require('graphql');
const prisma = require("../database/db")
const logger = require("../logger")


const CategoryEnumType = new GraphQLEnumType({
    name: 'Category',
    values: {
        BREAKFAST: { value: 'Breakfast' },
        LUNCH: { value: 'Lunch' },
        DINNER: { value: 'Dinner' },
        SNACKS: { value: 'Snacks' },
        APPETIZER : { value: 'Appetizer' },
        BEVERAGE : { value: 'Beverage' }, 
        DESSERT : { value: 'Dessert' },
        SOUP : { value: 'Soup' },
        SALAD : { value: 'Salad' }
    }
})

const IngredientInput = new GraphQLInputObjectType({
    name: 'IngredientInput',
    fields: {
        name: { type: GraphQLString },
        quantity: { type: GraphQLFloat },
        measuringUnit: { type: GraphQLString }
    }
});


const IngredientType = new GraphQLObjectType({
    name: 'Ingredient',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        quantity: { type: GraphQLFloat },
        measuringUnit: { type: GraphQLString }
    })
})

const DateScalar = new GraphQLScalarType({
    name: 'Date',
    description: 'Custom Date type',
    serialize(value) {
      //To return value
      return value.toISOString();
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
    name: 'Recipe',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        image : { type: GraphQLString },
        category : { type: CategoryEnumType },
        cookingTime: { type: GraphQLString },
        createdAt : { type: DateScalar },
        ingredients: { type: new GraphQLList(IngredientType) },
        instructions: { type: new GraphQLList(GraphQLString) },
    })
})

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLID },
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString }
    })
})

const RootQuery = new GraphQLObjectType({
    "name" : "RootQueryType",
    "fields" : {
        "recipes" : {
            "type" : new GraphQLList(RecipeType),
            "args" : {
                "skip" : { "type" : GraphQLInt }, 
                "take" : { "type" : GraphQLInt }
            },
            "resolve" : async(parent, args) => {
                return await prisma.recipe.findMany({
                    skip: args.skip,
                    take: args.take
                });
            }
        },
        "recipe" : {
            "type" : RecipeType,
            "args" : {
                "id" : { "type" : GraphQLID }
            },
            "resolve" : async(parent, args) => {
                return await prisma.recipe.findUnique({
                    where: {
                        id: args.id
                    }
                });
            }
        },
        "user" : {
            "type" : UserType,
            "args" : {
                "id" : { "type" : GraphQLID }
            },
            "resolve" : async(parent, args) => {
                return await prisma.user.findUnique({
                    where: {
                        id: args.id
                    }
                });
            }
        }
    }
})


module.exports = {RootQuery, RecipeType, IngredientInput, UserType}