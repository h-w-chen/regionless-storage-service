jest.mock("axios");
const mockAxios = require("axios");
mockAxios.post.mockImplementation((node) => Promise.resolve(node));

const PIT = require('./pit');
pitTest = new PIT(new Map([['/', ['1.2.3.4']]]));
pitTest.add("k:1:3");
pitTest.add("test:3:4");

beforeAll(() => {
    jest.clearAllMocks();
});

it('PIT able to check pending interest', () => {
    expect(pitTest.has("k:1:3")).toBe(true);
    expect(pitTest.has("k:8:9")).toBe(false);
});

it('PIT able to insert pending interest and send out interest message', async () => {
    expect(pitTest.has("test:10:10")).toBe(false);
    p = await pitTest.add("test:10:10");
    expect(pitTest.has("test:10:10")).toBe(true);
    expect(p).toBe('sent ok');
    expect(mockAxios.post).toHaveBeenCalledTimes(1);
});

it('PIT able to delete pending interest', () => {
    expect(pitTest.has("test:3:4")).toBe(true);
    pitTest.delete("test:3:4");
    expect(pitTest.has("test:3:4")).toBe(false);
});
