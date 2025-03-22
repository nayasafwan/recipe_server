const mockRedisClient = {
    connect: jest.fn(),
    flushAll: jest.fn(),
    hSet: jest.fn(),
    set: jest.fn(),
    keys: jest.fn().mockResolvedValue([]),
    get : jest.fn()
};

const createClient = jest.fn(() => mockRedisClient);

module.exports = { createClient };
