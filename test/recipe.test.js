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

beforeEach(()=>{
    mockReset(prismaMock);
})


describe('Recipe test API', () => {

    it("fetches recipes based on page and limit", async()=>{
        console.log(recipes)
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
})




