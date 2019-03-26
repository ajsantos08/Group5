const express = require ('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');
router.get('/login', (req, res) => res.render('login')); 


router.get('/register', (req, res) => res.render('register')); 

module.exports = router;


//Register Handle

router.post('/register', (req, res) =>
{
    const {name, email, password, password2} = req.body;
    let errors = [];
    // check fields

    if (!name || !email || !password || !password2)
    {
        errors.push({msg: 'Please fill in all fields'})
    }

    // check passwords match

    if (password != password2)
    {
        errors.push({msg: 'Passwords do not match'})
    }

    // check password lenth

    if (password.length < 6)
    {
        errors.push({msg: 'Password should be at least 6 characters'})
    }


    if (errors.length > 0)
    {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    }
    else{
        User.findOne({email:email})  //searching database
        .then(user => {
            if(user)
            {
                errors.push({msg: 'Email is already registered'});
                //User exists
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            }
            else{
                const newUser = new User({name, email, password});

                bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err;
                    {
                        //set apassword to hash
                        newUser.password = hash;
                        //save user
                        newUser.save()
                        .then(user => {
                            req.flash('success_msg' , 'You are now registered and can login');
                            res.redirect('/users/login')
                        })
                        .catch(err => console.log(err));
                    }
                }))
            }

        });

        
    }


});

// Login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/dashboard',
      failureRedirect: '/users/login',
      failureFlash: true
    })(req, res, next);
  });
  
  // Logout
  router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
  });


module.exports = router;