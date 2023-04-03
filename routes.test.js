process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("./app");
let items = require("./fakeDb");

let eggs = {
    name: "eggs",
    price: "5.99"
};

beforeEach(function() {
    items.push(eggs);
});

afterEach(function() {
    items.length = 0;
});

describe("GET /items", function() {
    test("Gets an array of item objects", async function() {
        const resp = await request(app).get(`/items`);
        expect(resp.statusCode).toBe(200);

        expect(resp.body).toEqual([eggs]);
    });
});

describe("POST /items", function() {
    test("Creates a new item", async function() {
        const resp = await request(app)
            .post(`/items`)
            .send({
                name: "milk",
                price: "4.99"
            });
        expect(resp.statusCode).toBe(201);
        expect(resp.body).toEqual({
            added: {
                name: "milk",
                price: "4.99"
            }
        });
    });

    test("Responds with 400 if missing item name", async function() {
        const resp = await request(app)
            .post(`/items`)
            .send({
                price: "2.99"
            });
        expect(resp.statusCode).toBe(400);
        expect(resp.body).toEqual({
            error: {
                message: "Item name is required",
                status: 400
            }
        });
    });

    test("Responds with 400 if missing item price", async function() {
        const resp = await request(app)
            .post(`/items`)
            .send({
                name: "chips"
            });
        expect(resp.statusCode).toBe(400);
        expect(resp.body).toEqual({
            error: {
                message: "Item price is required",
                status: 400
            }
        });
    });
});

describe("GET /items/:name", function() {
    test("Gets a single item object", async function() {
        const resp = await request(app)
            .get(`/items/${eggs.name}`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual(eggs);
    });

    test("Responds with 404 if item invalid", async function() {
        const resp = await request(app).get(`/items/milk`);
        expect(resp.statusCode).toBe(404);
    });
})

describe("PATCH /items/:name", function() {
    test("Updates a single item", async function() {
        const resp = await request(app)
            .patch(`/items/${eggs.name}`)
            .send({price: "3.99"});
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            updated: {
                name: "eggs",
                price: "3.99"
            }
        });
    });

    test("Responds with 404 if item invalid", async function() {
        const resp = await request(app).patch(`/items/milk`);
        expect(resp.statusCode).toBe(404);
    });
});

describe("DELETE /items/:name", function() {
    test("Deletes a single item", async function() {
        const resp = await request(app).delete(`/items/${eggs.name}`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({ message: "Deleted"});
        expect(items.length).toEqual(0);
    });

    test("Responds with 404 if item invalid", async function() {
        const resp = await request(app).delete(`/items/milk`);
        expect(resp.statusCode).toBe(404);
    });
});