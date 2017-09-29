/* Dependencies */
var mongoose = require('mongoose'), 
    Item = require('../models/item.server.model.js');
//TODO define Item schema

/*
  In this file, you should use Mongoose queries in order to retrieve/add/remove/update items.
  On an error you should send a 404 status code, as well as the error message. 
  On success (aka no error), you should send the item(s) as JSON in the response.
  HINT: if you are struggling with implementing these functions, refer back to this tutorial 
  from assignment 3 https://scotch.io/tutorials/using-mongoosejs-in-node-js-and-mongodb-applications
 */

/* Create a item */
exports.create = function(req, res) {

  /* Instantiate a Item */
  var item = new Item(req.body);

  /* save the coordinates (located in req.results if there is an address property) */
  if(req.results) {
    item.coordinates = {
      latitude: req.results.lat, 
      longitude: req.results.lng
    };
  }

  /* Then save the item */
  item.save(function(err) {
    if(err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      res.json(item);
    }
  });
};

/* Show the current item */
exports.read = function(req, res) {
  /* send back the item as json from the request */
  res.json(req.item);
};

/* Update a item */
exports.update = function(req, res) {
  var item = req.item;

  /* Replace the article's properties with the new properties found in req.body */
  item.name = req.body.name;
  item.code = req.body.code;
  item.address = req.body.address;

  /* save the coordinates (located in req.results if there is an address property) */
  if(req.results) {
    item.coordinates = {
      latitude: req.results.lat, 
      longitude: req.results.lng
    };
  }

  /* Save the article */
  item.save(function(err) {
    if(err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      res.json(item);
    }
  });
};

/* Delete a item */
exports.delete = function(req, res) {
  var item = req.item;

  /* Remove the article */
  item.remove(function(err) {
    if(err) {
      res.status(400).send(err);
    }
    else {
      res.end();
    }
  })
};

/* Retreive all the directory items, sorted alphabetically by item code */
exports.list = function(req, res) {
  Item.find().sort('code').exec(function(err, items) {
    if(err) {
      res.status(400).send(err);
    } else {
      res.json(items);
    }
  });
};

/* 
  Middleware: find a item by its ID, then pass it to the next request handler. 
  HINT: Find the item using a mongoose query, 
        bind it to the request object as the property 'item', 
        then finally call next
 */
exports.itemByID = function(req, res, next, id) {
  Item.findById(id).exec(function(err, item) {
    if(err) {
      res.status(400).send(err);
    } else {
      req.item = item;
      next();
    }
  });
};