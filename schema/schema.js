const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLFloat,
  GraphQLScalarType,
  GraphQLID,
  GraphQLEnumType,
} = require("graphql");
const databaseUser = require("../controllers/user.controller")

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

const InstructionType = new GraphQLObjectType({
  name: "Instruction",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    order: { type: GraphQLInt },
  }),
});


const UserType = new GraphQLObjectType({
  name: "User",
  fields : () =>({
    username : { type: GraphQLString },
    recipes : {
        type : new GraphQLList(RecipeType),
        resolve: async (user, args, context) => {
            const { req } = context;

            if (!req.session.user) return []; // Return empty if not authenticated

            return await databaseUser.getUserRecipes(req.session.user.id);
        }
    }
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

module.exports = { RecipeType, UserType, RecipesList }