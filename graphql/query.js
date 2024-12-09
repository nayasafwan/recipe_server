const { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt,  GraphQLID, GraphQLEnumType } = require('graphql');
const prisma = require("../database/db")


const CategoryEnumType = new GraphQLEnumType({
    name: 'Category',
    values: {
        BREAKFAST: { value: 'BREAKFAST' },
        LUNCH: { value: 'LUNCH' },
        DINNER: { value: 'DINNER' },
        SNACK: { value: 'SNACK' },
        APPETIZER : { value: 'Appetizer' },
        BEVERAGE : { value: 'Beverage' },
        DESSERT : { value: 'Dessert' },
        SOUP : { value: 'Soup' },
        SALAD : { value: 'Salad' }
    }
})

const IngredientType = new GraphQLObjectType({
    name: 'Ingredient',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        quantity: { type: GraphQLInt },
        measuringUnit: { type: GraphQLString }
    })
})

const RecipeType = new GraphQLObjectType({
    name: 'Recipe',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        category : { type: CategoryEnumType },
        ingredients: { type: new GraphQLList(IngredientType) }
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


module.exports = {RootQuery, RecipeType, IngredientType, UserType}