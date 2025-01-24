const { createClient } = require('redis');
const logger = require('../logger');
const {getAllRecipes} = require("../database/query");

const client = createClient()

client.connect()

client.flushAll()

const cashRecipes = async () =>{
    const categories = ["Breakfast", "Lunch", "Dinner", "Snacks", "Appetizer", "Dessert", "Salad", "Soup", "Beverage"];

    const allRecipes = await getAllRecipes();

    categories.forEach(category => {
        const recipes = allRecipes.filter(recipe => recipe.category === category);
        client.hSet('categories', category, JSON.stringify(recipes));
    }); 

    logger.info('Cashing data');

    client.set('allRecipes', JSON.stringify(allRecipes));
}


const getCachedRecipes = async(args) => {
    try {
        
        const {category, search, skip = 0, take = 10} = args;
        let recipes = [];

        const redisValue = await client.get("allRecipes");
        const allRecipes = JSON.parse(redisValue);

        if(!category && !search){
            
            return allRecipes.slice(skip * take, skip * take + take);
        }

        //if category is provided, get recipes from that category
        if(category) {
            logger.info(`Filter recipes by category: ${args.category}`);

            recipes =  await client.hGet("categories", category) || [];
        }

        //if recipes is already filtered by category, then filter by search else get all recipes and filter by search
        if (search){
            logger.info(`Filter recipes by search: ${args.search}`);
            recipes = recipes.length > 0 ? recipes.filter(recipe => recipe.name.includes(search)) : allRecipes.filter(recipe => recipe.name.includes(search));
        }

        return recipes.slice(skip * take, skip * take + take);

    } catch (err) {
        logger.error('Error getting recipes: ', err);
        return [];
    }
}

const isCachEmptyFunc = async() => {
    const allRecipes = await client.get("allRecipes");

    return await client.get("allRecipes") === null;
}

module.exports = {getCachedRecipes, cashRecipes, isCachEmptyFunc}