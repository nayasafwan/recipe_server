const { mockReset, mockDeep} = require('jest-mock-extended');
const request = require('supertest');
const app = require('../server');
const { prisma } = require('../controllers/dbInit');
const bcrypt = require('bcrypt');


jest.mock("../controllers/dbInit", () => ({
    prisma : mockDeep()
}))


const prismaMock = prisma


const saltRounds = Number(process.env.SALT_ROUNDS) || 10;

beforeEach(()=>{
    mockReset(prismaMock);
}) 

describe('Recipe test API', () => {

    it("signs ups new user", async()=>{

        prismaMock.user.findUnique.mockResolvedValueOnce(null);
        prismaMock.user.findUnique.mockResolvedValueOnce(null);
        prismaMock.user.create.mockResolvedValueOnce({
            username: "testuser", password: "testpassword", email : "testuser@gmail.com"
        })

        const res = await request(app)
        .post('/graphql')
        .send({
            query : `mutation {
                signup(username: "testuser", password: "testpassword", email : "testuser@gmail.com") {
                    message
                    code
                }
            }`
        })

        expect(res.body.data.signup.code).toEqual(200);
        const sessionCookie = res.headers['set-cookie'];
       
        expect(sessionCookie).toBeDefined();

        const res2 = await request(app)
        .post('/graphql')
        .set('Cookie', sessionCookie)
        .send({
            query : `query {
                user {
                    message
                    code
                }
            }`
        })

        expect(res2.body.data.user.code).toEqual(200);
        expect(res2.body.data.user.message).toEqual("Session is valid");
    })


    beforeEach(async()=> {

        await request(app)
        .post('/graphql')
        .send({
            query : `mutation {
                signup(username: "test", password: "testpassword", email : "test@gmail.com") {
                    message
                    code
                }
            }`
        })
    })

    it("logs in user", async()=>{

        prismaMock.user.create.mockResolvedValueOnce({})
        const firstAttempt = await request(app)
        .post('/graphql')
        .send({
            query : `mutation {
                login(username: "test2", password: "testpassword") {
                    message
                    code
                }
            }`
        })

        expect(firstAttempt.body.data.login.code).toEqual(400);
        expect(firstAttempt.body.data.login.message).toEqual("Username does not exist");

        prismaMock.user.findUnique.mockResolvedValueOnce(null)
        const secondAttempt = await request(app)
        .post('/graphql')
        .send({
            query : `mutation {
                login(email: "test2@gmail.com", password: "testpassword") {
                    message
                    code
                }
            }`
        })

        expect(secondAttempt.body.data.login.code).toEqual(400);
        expect(secondAttempt.body.data.login.message).toEqual("Email does not exist");


        prismaMock.user.findUnique.mockResolvedValueOnce({
            "email" : "test@gmail.com",
            "password" : "testpasswor",
        })
        

        const thirdAttempt = await request(app)
        .post('/graphql')
        .send({
            query : `mutation {
                login(email: "test@gmail.com", password: "testpasswor") {
                    message
                    code
                }
            }`
        })

        expect(thirdAttempt.body.data.login.code).toEqual(400);
        expect(thirdAttempt.body.data.login.message).toEqual("Invalid credentails");
        
        const hashedPassword = await bcrypt.hash("testpassword", saltRounds);
        prismaMock.user.findUnique.mockResolvedValueOnce({
            "email" : "test@gmail.com",
            "password" : hashedPassword,
            "username" : "test"
        })

        const fourthAttempt = await request(app)
        .post('/graphql')
        .send({
            query : `mutation {
                login(username: "test", password: "testpassword") {
                    message
                    code
                }
            }`
        })

        expect(fourthAttempt.body.data.login.code).toEqual(200);

        const sessionCookie = fourthAttempt.headers['set-cookie'];
       
        expect(sessionCookie).toBeDefined();

    })




})