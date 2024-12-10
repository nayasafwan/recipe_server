// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();


// const resolvers = {
//     Query: {
//         recipes : async({skip = 0, take = 10}) =>{
//             return prisma.recipe.findMany({
//                 skip,
//                 take
//             });
//         },
//         recipe : async({id}) =>{
//             return prisma.recipe.findUnique({
//                 where: {
//                     id: id
//                 }
//             });
//         },
//         user : async({id }) =>{
//             return prisma.user.findUnique({
//                 where: {
//                     id: id
//                 }
//             });
//         }
//     },
//     Mutation : {
//         createRecipe : async({name, description, cookingTime, category, ingredients}) =>{
//             const id = (await prisma.recipe.create({
//                 data: {
//                     name,
//                     description,
//                     cookingTime,
//                     category
//                 }
//             })).id;

//             ingredients.forEach(async ingredient =>{
//                 await prisma.ingredient.create({
//                     data: {
//                         ...ingredient,
//                         recipeId: id
//                     }
//                 });
//             });
//         },
//         createUser : async({username, email, password}) =>{
//             return prisma.user.create({
//                 data: {
//                     username,
//                     email,
//                     password
//                 }
//             });
//         }
//     }
// }