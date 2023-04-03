const express = require('express');
const router = new express.Router();
const ExpressError = require('./expressError');

const items = require('./fakeDb');

router.get("/", function(req, res, next) {
    return res.json(items);
});

router.post("/", function(req, res, next) {

    try {
        if (!req.body.name) throw new ExpressError("Item name is required", 400);
        if (!req.body.price) throw new ExpressError("Item price is required", 400);

        const newItem = {
            name: req.body.name,
            price: req.body.price
        };

        items.push(newItem);

        return res.status(201).json({ added: newItem });

    } catch(error) {
        next(error);
    }

});

router.get("/:name", function(req, res, next) {
    
    const item = items.find(entry => entry.name === req.params.name);

    if (item === undefined) {
        throw new ExpressError("Item not found", 404);
    }

    return res.json(item);
});

router.patch("/:name", function(req, res, next) {
    
    const item = items.find(entry => entry.name === req.params.name);

    if (item === undefined) {
        throw new ExpressError("Item not found", 404);
    }

    item.name = req.body.name || item.name;
    item.price = req.body.price || item.price;

    return res.json({ updated: item });
});

router.delete("/:name", function(req, res, next) {

    const itemIndex = items.findIndex(item => item.name === req.params.name);

    if (itemIndex === -1) {
        throw new ExpressError("Item not found", 404)
    }
    
    items.splice(itemIndex, 1);

    return res.json({ message: "Deleted"});
})

module.exports = router;