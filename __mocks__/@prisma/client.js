// __mocks__/@prisma/client.js
const { mockDeep } = require('jest-mock-extended');

// Mock PrismaClient as a constructor
const PrismaClient = jest.fn(() => mockDeep());

module.exports = {
  PrismaClient,
};