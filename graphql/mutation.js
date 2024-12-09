const prisma = require("../database/db")
const { GraphQLString, GraphQLList, GraphQLObjectType } = require('graphql');
const {RecipeType, IngredientType} = require("./query")

const Mutation = new GraphQLObjectType({
    name : "Mutation",
    fields : {
        createRecipe : {
            type : RecipeType,
            args : {
                name : { type: GraphQLString },
                description : { type: GraphQLString }, 
                cookingTime : { type: GraphQLString },
                category : { type: GraphQLString },
                ingredients: { type: new GraphQLList(IngredientType) }
            },
            async resolve(parent, args) {
              const id = await prisma.recipe.create({
                 data : {
                     name : args.name,
                     description : args.description,
                     cookingTime : args.cookingTime,
                     category : args.category
                 }
             })
             
             for (let i = 0; i < args.ingredients.length; i++) {
                 await prisma.ingredient.create({
                     data : {
                         name : args.ingredients[i].name,
                         quantity : args.ingredients[i].quantity,
                         measuringUnit : args.ingredients[i].measuringUnit,
                         recipeId : id.id
                     }
                 })
             }

             return args
            }
        }
    }
});


module.exports = Mutation;