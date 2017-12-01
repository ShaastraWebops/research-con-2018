'use strict';

import User from './user.model';
import config from '../../config/environment';
import jwt from 'jsonwebtoken';
import json2csv from 'json2csv';
import multer from 'multer';
import path from 'path';

var saveWithName = "Noname";
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'client/assets/reports')
  },
  filename: function(req, file, cb) {
    saveWithName = file.fieldname + '-' + Date.now() + "." + file.originalname.split('.').pop();
    cb(null, saveWithName)
  }
});

var upload = multer({storage: storage}).single('uploadedFile');

function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return function(err) {
    return res.status(statusCode).json(err);
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    return res.status(statusCode).send(err);
  };
}

/**
 * Get list of users
 * restriction: 'admin'
 */
export function index(req, res) {
  return User.find({role: 'user'}, '-salt -password').exec()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(handleError(res));
}

export function showfile(req,res) {
   res.sendFile(path.resolve('client/assets/reports/' + req.params.name));
}

/**
 * Creates a new user
 */
export function create(req, res) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  
  User.count({}, function (err, len) {
  
  if(len < 10)
    newUser.srcID = 'SRC000'+(len+1);
  else if(len < 100)
    newUser.srcID = 'SRC00'+(len+1);
  else if(len < 1000)
    newUser.srcID = 'SRC0'+(len+1);
  else if(len < 10000)
    newUser.srcID = 'SRC'+(len+1);


  newUser.save()
    .then(function(user) {
      var token = jwt.sign({ _id: user._id }, config.secrets.session, {
        expiresIn: 60 * 60 * 5
      });
      res.json({ token });
    })
    .catch(validationError(res));
  });


}

export function exp(req, res) {
  return User.find({'role': 'user'}).exec()
    .then(participants => {
      participants = participants.sort(function(a, b){return a.srcID > b.srcID});
      var fields = [{
        value: 'srcID',
        label: 'SRC ID'}, 'name', 'position','organisation', 'email', 'phoneNumber', 'city', 'state'];
      var csv = json2csv({ data: participants, fields: fields});
      res.setHeader('Content-disposition', 'attachment; filename=participants.csv');
      res.set('Content-Type', 'text/csv');
      res.status(200).send(csv);
    })
    .catch(handleError(res));
}

/**
 * Get a single user
 */
export function show(req, res, next) {
  var userId = req.params.id;

  return User.findById(userId).exec()
    .then(user => {
      if(!user) {
        return res.status(404).end();
      }
      res.json(user.profile);
    })
    .catch(err => next(err));
}

export function fileupload(req,res) {
  var user = req.user._id;
  upload(req, res, err => {

    if (err) {

      return res.json({success: false,  msg: "Error while uploading file", name: 'no file was uploaded'});
    }
    User.findOne({_id: user},function(err,user){
      if(err) throw err;
      user.file = saveWithName;
      user.save(function(err){
        if(err) throw err;
        res.json({success: true, msg: "File Uploaded!"});
      });
    });
  });
}

/**
 * Deletes a user
 * restriction: 'admin'
 */
export function destroy(req, res) {
  return User.findByIdAndRemove(req.params.id).exec()
    .then(function() {
      res.status(204).end();
    })
    .catch(handleError(res));
}

/**
 * Change a users password
 */
export function changePassword(req, res) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  return User.findById(userId).exec()
    .then(user => {
      if(user.authenticate(oldPass)) {
        user.password = newPass;
        return user.save()
          .then(() => {
            res.status(204).end();
          })
          .catch(validationError(res));
      } else {
        return res.status(403).end();
      }
    });
}

/**
 * Get my info
 */
export function me(req, res, next) {
  var userId = req.user._id;

  return User.findOne({ _id: userId }, '-salt -password').exec()
    .then(user => { // don't ever give out the password or salt
      if(!user) {
        return res.status(401).end();
      }
      res.json(user);
    })
    .catch(err => next(err));
}

/**
 * Authentication callback
 */
export function authCallback(req, res) {
  res.redirect('/');
}
