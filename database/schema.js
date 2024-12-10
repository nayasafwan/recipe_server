
// const typeDefs = `

//     enum Category {
//         Breakfast
//         Lunch 
//         Dinner
//         Snack
//         Appetizer
//         Beverage
//         Dessert
//         Soup
//         Vegeterian
//     }

//     type Ingredient {
//         name: String!
//         quantity: String!
//         measuringUnit : String
//     }

//     type Recipe {
//         id: ID!
//         name: String!
//         ingredients: String!
//         cookingTime: String!
//         category: Category!
//         ingredients: [Ingredient!]!
//     }

//     type User {
//         id: ID!
//         username: String!
//         email: String!
//         password: String!
//     }

//     type Query {
//         recipes(skip: Int, take: Int): [Recipe!]!
//         recipe(id: ID!): Recipe
//         user(id: ID!): User
//     }
// `

// export default typeDefs;