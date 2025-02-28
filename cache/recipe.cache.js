const cache = require('./cache');
const logger = require('../logger');

const client = cache.client

class RecipeCache {


    async getCachedRecipes(args){
        try {
            
            const {category, search, skip = 0, take = 10} = args;
            let recipes = [];

            const redisValue = await client.get("allRecipes");
            const allRecipes = JSON.parse(redisValue);

            if(!category && !search){
                const paginatedRecipes = allRecipes.slice(skip * take, skip * take + take);
                return {recipes: paginatedRecipes, count: allRecipes.length};
            }

            //if category is provided, get recipes from that category
            if(category) {
                logger.info(`Filter recipes by category: ${args.category}`);

                recipes =  await client.hGet("categories", category) || [];
                recipes = JSON.parse(recipes);
            }

            //if recipes is already filtered by category, then filter by search else get all recipes and filter by search
            if (search){
                logger.info(`Filter recipes by search: ${args.search}`);
                recipes = recipes.length > 0 ? recipes.filter(recipe => recipe.name.includes(search)) : allRecipes.filter(recipe => recipe.name.includes(search));
            }

            const paginatedRecipes = recipes.slice(skip * take, skip * take + take);

            return {recipes: paginatedRecipes, count: recipes.length};

        } catch (err) {
            logger.error('Error getting recipes: ', err);
            return [];
        }
    }

    async getCachedRecipeById (id) {
        const redisValue = await client.get("allRecipes");
        const allRecipes = JSON.parse(redisValue);

        if(!allRecipes) return null;
        
        const recipe = allRecipes.find(recipe => recipe.id === id);

        if(recipe) {
            logger.info(`Recipe with id ${id} found in cache`);
            return recipe;
        }
        else {
            logger.info(`Recipe with id ${id} not found in cache`);
            return null;
        }
            
    }



    async addRecipeToCache(recipe){
        const redisValue = await client.get("allRecipes");
        const allRecipes = JSON.parse(redisValue);
        
        allRecipes.push(recipe);

        client.set('allRecipes', JSON.stringify(allRecipes));

        const categoryRecipes = await client.hGet("categories", recipe.category) || [];

        categoryRecipes.push(recipe);

        client.hSet('categories', recipe.category, JSON.stringify(categoryRecipes));
    }


}

module.exports = new RecipeCache();