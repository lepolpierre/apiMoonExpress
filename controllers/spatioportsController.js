"use strict";

const Spatioport = require('../models/spatioport');

exports.getSpatioports = (req, res, next) => {
  // if (req.user.level !== 2) {
  //   const error = new Error("Vous ne pouvez pas...");
  //   error.statusCode = 401;
  //   throw error;
  // }
  
  Spatioport.find()
  .then(spatioports => {
    // console.log(spatioports[0].toJSON());
    res.json({spatioports});
  })
  .catch(err => {
    next(err);
  });
};

exports.getSpatioport = (req, res, next) => {
  const SpatioportId = req.params.SpatioportId;

  // if (req.user.level !== 2) {
  //   const error = new Error("Vous ne pouvez pas...");
  //   error.statusCode = 401;
  //   throw error;
  // }

  Spatioport.findById(SpatioportId)
  .then(spatioport => {
    if (!spatioport) {
      const error = new Error('Le spatioport n\'existe pas.');
      error.statusCode = 404;
      throw error;
    }
    res.json({
      spatioport: spatioport
    });
  })
  .catch(err => {
    next(err);
  });
};

exports.createSpatioport = (req, res, next) => {
  const {city, position} = req.body;

  if (req.user.level !== 2) {
    const error = new Error("Vous ne pouvez pas...");
    error.statusCode = 401;
    throw error;
  }

  const spatioport = new Spatioport({
    city: city,
    position: position
  });

  spatioport.save()
    .then(() => {
      res.status(200).json({ message: "Spatioport créé", spatioport: spatioport });
    })
    .catch(err => {
      next(err);
    });
};

exports.deleteSpatioport = (req, res, next) => {
  console.log(req.user);
  
  if (req.user.level !== 2) {
    const error = new Error("Vous ne pouvez pas supprimer");
    error.statusCode = 401;
    throw error;
  }
  const spatioportId = req.params.spatioportId;
  Spatioport.findByIdAndRemove(spatioportId)
  .then(() => {
    console.log('Spatioport supprimé');
    res.status(200).json({ message: "Spatioport supprimé" });
  });
  
};


