"use strict";

const Reservation = require('../models/reservation');
const Rocket = require('../models/rocket');



exports.getReservations = (req, res, next) => {
    Reservation.find()
        .then(reservations => {
            if(!reservations){
                const err = new Error("Aucune réservations trouvées!");
                err.statusCode = 404;
                err.code = "RESERVATIONS_EMPTY";
                throw err;
            }
            res.json({reservations: reservations});
        })
        .catch(err => next(err));
};

exports.getReservation = (req, res, next) => {
    const reservationId = req.params.reservationId;

    Reservation.findById(reservationId)
        .then(reservation => {
            if (!reservation) {
                const error = new Error('La reservation n\'existe pas.');
                error.statusCode = 404;
                error.code = "RESERVATION_NULL";
                throw error;
            }
            res.json({
                reservation: reservation
            });
        })
        .catch(err => {
            next(err);
        });
};



exports.createReservation = (req, res, next) => {
    const rocketId = req.params.rocketId;
    const nbPerson = req.params.nbPerson;
    const price = req.params.price;

    const reservation = new Reservation({
        rocketId: rocketId,
        nbPerson: nbPerson,
        price: price,
        userId: req.user.userId
    });

    console.log(rocketId);
    Rocket.findById(rocketId)
    .then(rocket=>{
        if(!rocket){
            const err = new Error("Rocket invalide");
            err.statusCode = 404;
            err.code = "ROCKET_INVALIDE";
            throw err;
        }

        rocket.nbPlaceRemaining -= nbPerson;
        return rocket.save();
    })
    .then(()=>{
        reservation.save()
            .then(result => {
                res.status(201).json({
                    message: "Fusée réservé avec succès",
                    reservation: result
                });
            });

    })
    .catch(err => {
        next(err);
    });
};




exports.deleteReservation = (req, res, next) => {
    const reservationId = req.params.reservationId;

    Reservation.findByIdAndRemove(reservationId)
    .then(reservation => {

        Rocket.findById(reservation.rocketId)
        .then(rocket=>{
            if(!rocket){
                const err = new Error('Aucune rocket trouvé!');
                err.statusCode =404;
                err.code = "ROCKET_INTROUVABLE";
                throw err;
            }
            rocket.nbPlaceRemaining += reservation.nbPerson;
            return rocket.save();
        })
        .then(()=>{

            console.log('reservation supprimé');
            res.status(204).json({ message: "reservation supprimé" });
        });

        
    })
    .catch(err => next(err));
};