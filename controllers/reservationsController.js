"use strict";

const Reservation = require('../models/reservation');

exports.getReservations = (req, res, next) => {
    Reservation.find()
        .then(reservations => {
            res.json({
                reservations: reservations
            })
        })
        .catch(err => {
            next(err)
        })
};

exports.getReservation = (req, res, next) => {
    const reservationId = req.params.reservationId;
    Reservation.findById(reservationId)
        .then(reservation => {
            if (!reservation) {
                const error = new Error('La reservation n\'existe pas.');
                error.statusCode = 404;
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
    const rocketId = req.body.rocketId;
    const nbPerson = req.body.nbPerson;
    const price = req.body.price;

    const reservation = new Reservation({
        rocketId: rocketId,
        nbPerson: nbPerson,
        price: price,
        userId: req.user.userId
    });

    Reservation.save()
        .then(result => {
            res.status(200).json({
                message: "Fusee reserver",
                reservation: reservation
            });
        })
        .catch(err => {
            next(err);
        });
};

exports.deleteReservation = (req, res, next) => {
    const reservationId = req.params.reservationId;
    console.log('reservationId', reservationId)
    Reservation.findByIdAndRemove(reservationId)
    .then(() => {
      console.log('reservation supprimé');
      res.status(200).json({ message: "reservation supprimé" });
    });
};