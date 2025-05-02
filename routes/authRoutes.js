const passport = require('passport');
const mongoose = require('mongoose');
const cleanCache = require('../middlewares/clearCache');

module.exports = app => {
  app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email']
    })
  );

  app.get(
    '/auth/google/callback',
    passport.authenticate('google'),
    (req, res) => {
      res.redirect('/blogs');
    }
  );

  app.get('/auth/logout', cleanCache,(req, res) => {
    req.logout();
    res.redirect('/');
  });

  app.get('/api/current_user', async(req, res) => {

    res.send(req.user);
  });
};
