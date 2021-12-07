"use strict";
require('dotenv').config();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const User = require('../models/user');



/**
 * Permet la connexion d'un utilisateur.
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 */
exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if(!email || !password){
    const err = new Error("Formulaire invalide, champs manquant!");
    err.code = "INVALID_LOGIN_FORM";
    throw err;
  }


  let loadedUser;
  User.findOne({email: email})
  .then(user =>{
    if (!user) {
      const error = new Error('Utilisateur non trouvée');
      error.statusCode = 404;
      error.code= "INVALID_USER";
      throw error;
    }
    loadedUser = user;
    // console.log('loadedUser', loadedUser);
    return bcrypt.compare(password, user.password);
  })
  .then(isEqual => {
    if (!isEqual) {
      const error = new Error('Mauvais mot de passe !');
      error.statusCode = 404;
      error.code = "INCORRECT_PASSWORD";
      throw error;
    }
    const token = jwt.sign(
      {
        email: loadedUser.email,
        name: loadedUser.name,
        userId: loadedUser._id.toString(),
        level: loadedUser.level
      },
      process.env.SECRET_JWT,
      { expiresIn: '1h' }
    );
    res.status(200).json({ token: token });
  })
  .catch(err =>{
    next(err);
  });
};



/**
 * Permet la création de compte.
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 */
exports.signup = (req, res, next) => {
  // Récupération des champs.
  const {email, name, password, level} = req.body;


  // Vérifier que les champs sont fournis.
  if(!email || !name || !password || !level){
    const err = new Error("Formulaire invalide, champs manquant!");
    err.code = "INVALID_SIGNUP_FORM";
    throw err;
  }
  
  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({
        email,
        name,
        password: hashedPassword,
        level
      });
      return user.save();
    })
    .then(result => {
      res.status(201).json(
        {
          message: "Utilisateur créé !",
          userId: result.id
        });
    })
    .catch(err => {
      next(err);
    });
};

