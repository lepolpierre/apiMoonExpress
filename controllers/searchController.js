"use strict";
require('dotenv').config();


const Rocket = require('../models/rocket');
const SpatioPort = require('../models/spatioport');


const url_base = process.env.URL + ":" + process.env.PORT;


exports.createSearch = (req, res, next) => {
  // console.log(req.params);
  const {date,nbPerson,spatioportArrivalId,spatioportDepartureId} = req.params;
  // On récupère les noms des spacioport du formulaire, afin de faciliter la lecture, remplacer les noms variables 
  let spatioDep;
  let spatioArrival;


  // Récupération spatioport Depat.
  SpatioPort.find({city: spatioportDepartureId})
    .then(s => {
      spatioDep = s[0];
    })
    .then(()=>{
      // Récupération spatioport arrivée.
      SpatioPort.find({city: spatioportArrivalId})
      .then(s=>{
        spatioArrival = s[0];
      })
      .then(()=>{
        // Ici on a obtenu les spatioport depart et arrivee..
        // Recherche
        Rocket.find({
          date : new Date(date),
          nbPlaceRemaining : {
            $gte: nbPerson
          },
          spatioportDepartureId : spatioDep._id,
          spatioportArrivalId : spatioArrival._id
        })
        .then(rockets => {
           if(!rockets){
             const err = new Error("Aucun résultat!");
             err.statusCode = 404;
             err.code = "ROCKETS_EMPTY";
             throw err;
           }

           let rocketsWithLinks = rockets.map(rocket =>{

            let links = [
              {
                self: {
                  method: "GET",
                  href: url_base + "/rocket/" + rocket._id.toString()
                }
              },
              {
                create: {
                  method: "POST",
                  href: url_base + "/rocket/"
                }
              },
              {
                delete: {
                  method: "DELETE",
                  href: url_base + "/rocket/" + rocket._id.toString()
                }
              }
            ];

            rocket = rocket.toJSON();
            rocket.links = links;
            return rocket;
           });

           res.status(200).json({result: rocketsWithLinks});
        });
      });
    })
    .catch(err=> next(err));
   



};