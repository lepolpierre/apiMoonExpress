"use strict";

const Rocket = require('../models/rocket');



exports.getRockets = (req, res, next) => {
    Rocket.find()
    .then(rockets => {
        if(!rockets){
            const err = new Error("Aucun rocket trouvé!");
            err.statusCode = 404;
            err.code = "ROCKETS_EMPTY";
            throw err;
        }
        res.status(200).json({rockets: rockets});
    })
    .catch(err => {
        next(err);
    });
};

exports.getRocket = (req, res, next) => {
    const rocketId = req.params.rocketId;
    Rocket.findById(rocketId)
    .then(rocket => {
        if (!rocket) {
            const error = new Error('La rocket n\'existe pas.');
            error.statusCode = 404;
            error.code = "INEXISTANT_ROCKET";
            throw error;
        }
        res.json({rocket});
    })
    .catch(err => {
        next(err);
    });
};


/**
 * Permet la création de rocket
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 */
exports.createRocket = (req, res, next) => {
    const {date, nbPlace, nbPlaceRemaining, price, image, name, spatioportDepartureId, spatioportArrivalId} = req.body;
    
    if(!date || !nbPlace || !nbPlaceRemaining || !price || !image || !name || !spatioportDepartureId || !spatioportArrivalId){
        const err = new Error("Formulaire création de rocket invalide, champs manquanr!");
        err.statusCode = 404;
        err.code = "INVALID_ROCKET_CREATION_FORM";
        throw err;
    }

    // Création et enregistrement de la nouvelle rocket dans la BD.
    new Rocket({
        date, nbPlace, nbPlaceRemaining, 
        price, image, name, 
        spatioportDepartureId, spatioportArrivalId
    })
    .save()
    .then(rocket=>{
        res.status(201).json({
            message: "Rocket crée avec succès!",
            rocket
        });
    })
    .catch(err=>next(err));
};



exports.deleteRocket = (req, res, next) => {
    const rocketId = req.params.rocketId;
    console.log('rocketId', rocketId)
    Rocket.findByIdAndRemove(rocketId)
    .then(() => {
      console.log('rocket supprimé');
      res.status(204).json({ message: "rocket supprimé" });
    });
};


