const { mockReset, mockDeep} = require('jest-mock-extended');
const request = require('supertest');
const app = require('../server');
// const {prismaMock } = require('./prismaMock');
const recipes = require("./mock_data/recipes.json")
const { prisma } = require('../controllers/dbInit');


jest.mock("../controllers/dbInit", () => ({
    prisma : mockDeep()
}))


const prismaMock = prisma



describe('Recipe test API', () => {
    beforeEach(()=>{
        mockReset(prismaMock);
    })
    

    it("fetches recipes based on page and limit", async()=>{

        prismaMock.recipe.findMany.mockResolvedValueOnce(recipes);
        prismaMock.recipe.count.mockResolvedValueOnce(10);

        const res = await request(app)
        .post('/graphql')
        .send({
            query: `query {
                recipes 
                    (skip : 0, take: 10)
                {
                recipes {
                  id,
                  name,
                  description,
                  cookingTime
                },
                count
                }
            }`
        });

        expect(res.statusCode).toEqual(200);
        expect(res.body.data.recipes.count).toEqual(10);
    });

    it("fetches recipes based on category", async()=>{
        prismaMock.recipe.findMany.mockResolvedValueOnce(recipes);
        prismaMock.recipe.count.mockResolvedValueOnce(10);

        const res = await request(app)
        .post('/graphql')
        .send({
            query: `query {
                recipes 
                    (skip : 0, take: 10, category: "Breakfast")
                {
                recipes {
                  id,
                  name,
                  description,
                  cookingTime
                },
                count
                }
            }`
        });

        expect(res.statusCode).toEqual(200);
        expect(res.body.data.recipes.count).toEqual(10);
    });

    it("fetches recipe based on id", async()=>{
        prismaMock.recipe.findUnique.mockResolvedValueOnce(recipes[0]);
        prismaMock.recipe.findMany.mockResolvedValueOnce(recipes);

        const res = await request(app)
        .post('/graphql')
        .send({
            query: `query {
                recipe(id: 1){
                  ... on Recipe {
                    id,
                    name,
                    description,
                    cookingTime
                  }
                }
            }`
        });

        expect(res.statusCode).toEqual(200);
        expect(res.body.data.recipe.id).toEqual("1");
    })

    it("fetches recipe based on id and returns error message", async()=>{
        prismaMock.recipe.findUnique.mockResolvedValueOnce(null);
        prismaMock.recipe.findMany.mockResolvedValueOnce(recipes);
        const res = await request(app)
        .post('/graphql')
        .send({
            query: `query {
                recipe(id: 5245){
                  ... on ErrorMessage {
                    error,
                    code
                  }
                }
            }`
        });


        expect(res.body.data.recipe.code).toEqual(400);
        expect(res.body.data.recipe.error).toEqual("Recipe not found");
    })
})




