var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
var path = require("path");

const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const hbs = require("nodemailer-express-handlebars")

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
     "119981354324-qlg4hf4dlb1k8dd7r32jkouoaoni0gt7.apps.googleusercontent.com", // ClientID
     "rJKG6kbFTkk80WCAaB1dKgAF", // Client Secret
     "https://developers.google.com/oauthplayground" // Redirect URL
);


oauth2Client.setCredentials({
     refresh_token: "1/51zxtNU8LnjfKH-7McNaqtWK6OCSK0X0vogDTcAhc0U"
});

const accessToken=oauth2Client.getAccessToken()


const smtpTransport = nodemailer.createTransport({
     service: "gmail",
     auth: {
          type: "OAuth2",
          user: "hoskovectest@gmail.com", 
          clientId: "119981354324-qlg4hf4dlb1k8dd7r32jkouoaoni0gt7.apps.googleusercontent.com",
          clientSecret: "rJKG6kbFTkk80WCAaB1dKgAF",
          refreshToken: "1/51zxtNU8LnjfKH-7McNaqtWK6OCSK0X0vogDTcAhc0U",
          accessToken: accessToken
     }
});




/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource Maroubra');
});

// router.get('/now', function(req, res, next) {
//   console.log("endpoint mail/now")

//   var mailOptions = {
//      from: "hoskovectest@gmail.com",
//      to: 'ihoskovecpetr@gmail.com',
//      subject: "just GET /now!",
//      template: 'index',
//      context: {
//       name: "Vep5ik Pepik",
//      }
//      // generateTextFromHTML: true,
//      // html: "<h1>Eat ass Mon Sweet!</h1><p>here are details of event you are going to attend: </p><b>kce prcata Mons do zkdu vds vzvd njk !!</b>"

// }

//   smtpTransport.sendMail(mailOptions, (error, response) => {
//     if (error) {console.log("ERROR SENDING MAIL: ", error) 
//       } else{
//        res.json({response});
//        console.log("SUCCESS MAIL SENDED", response);
//        res.send("SUCCESS MAIL SENDED")
//        smtpTransport.close();
//    }

//   });


// });

// router.get('/ex', function(req, res, next) {
//     console.log("hitting endpoint '/ex' ")

//     var fake_id = '5cb68bfc6bc1707d56334a9d'

//   res.render('monkey', { eventURL: 'https://young-retreat-68334.herokuapp.com/event/' + fake_id});
// });


router.post('/post',function(req,res, next){
  console.log("mail/post ENDPOINT pOSt");
  console.log("body._id: ", req.body.event._id)

  smtpTransport.use('compile', hbs({
    viewEngine: {
    extName: '.handlebars',
    partialsDir: './views/',
    layoutsDir: './views/',
    // defaultLayout: 'monkey.handlebars'
  },
  viewPath: 'views'
}))

var eventURL = 'https://www.charlieparty.club/event/' + req.body.event._id 

  console.log("mail/post ENDPOINT pOSt: eventURL ", eventURL);

  var mailOptions1 = {
     from: "Charlie Party App",
     to: req.body.user_email, //req.body.user_email
     subject: "You just created CHARLIE event",
     template: 'monkey',
     context: {
      eventURL: eventURL,
      user_name: req.body.user_name,
      event_name: req.body.event.name,
      dateStart: req.body.event.dateStart,
      dateEnd: req.body.event.dateEnd,
      repeatWeek: req.body.event.repeatWeek,
      price: req.body.event.price,
      capacityMax: req.body.event.capacityMax,
      freeSnack: req.body.event.freeSnack,
      freeBeer: req.body.event.freeBeer,
      freeMeal: req.body.event.freeMeal,
      description: req.body.event.description,
      addressGoogle: req.body.event.addressGoogle,
      addressCustom: req.body.event.freeaddressCustomMeal,
      creatorName: req.body.event.creatorName,
      creatorPhoto: req.body.event.creatorPhoto,

     }

}

smtpTransport.sendMail(mailOptions1, (error, response) => {
	if (error) {console.log(error)
            res.json({error}); 
		} else{
     res.json({response});
     console.log("response NODE:", response);
     smtpTransport.close();
 }

	

     // error ? console.log(error) : {console.log("response NODE: ", response);
     // response.send("poslano, hotovo")
     // response.status(200)
     // response.json({response});
     // smtpTransport.close();}
});
});

router.post('/inquiry-to-host',function(req,res, next){
  console.log("mail/inquiry-to-host ENDPOINT!!");
  console.log("body: ", req.body)

  smtpTransport.use('compile', hbs({
    viewEngine: {
    extName: '.handlebars',
    partialsDir: './views/',
    layoutsDir: './views/',
    //defaultLayout: 'inquiry.handlebars'
  },
  viewPath: 'views'
}))

var eventURL = 'https://www.charlieparty.club/event/' + req.body.event._id 

  console.log("mail/post ENDPOINT pOSt: eventURL ", eventURL);

  var mailOptions2 = {
     from: "Charlie Party App",
     to: req.body.event.creatorEmail, //req.body.user_email
     subject: "Guests Pending Inquiry (CHARLIE PARTY)",
     template: 'inquiry',
     context: {
      eventURL: eventURL,
      guest_name: req.body.guest_name,
      guest_email: req.body.guest_email,
      guest_picture: req.body.guest_picture,
      guest_inquiry: req.body.guest_inquiry,
      event_name: req.body.event.name,
      dateStart: req.body.event.dateStart,
      dateEnd: req.body.event.dateEnd,
      repeatWeek: req.body.event.repeatWeek,
      price: req.body.event.price,
      capacityMax: req.body.event.capacityMax,
      addressGoogle: req.body.event.addressGoogle,
      addressCustom: req.body.event.freeaddressCustomMeal,
      creatorName: req.body.event.creatorName,
      creatorPhoto: req.body.event.creatorPhoto,

     }

}

smtpTransport.sendMail(mailOptions2, (error, response) => {
  if (error) {console.log(error)
            res.json({error}); 
    } else{
     res.json({response});
     console.log("response NODE:", response);
     smtpTransport.close();
 }

     // error ? console.log(error) : {console.log("response NODE: ", response);
     // response.send("poslano, hotovo")
     // response.status(200)
     // response.json({response});
     // smtpTransport.close();}
});
});

router.post('/inquiry-to-guest',function(req,res, next){
  console.log("mail/inquiry-to-guest ENDPOINT!! email for: ", req.body.guest_email);
  console.log("body: ", req.body)

  smtpTransport.use('compile', hbs({
    viewEngine: {
    extName: '.handlebars',
    partialsDir: './views/',
    layoutsDir: './views/',
    //defaultLayout: 'inquiry.handlebars'
  },
  viewPath: 'views'
}))

var eventURL = 'https://www.charlieparty.club/event/' + req.body.event._id 

  console.log("mail/post ENDPOINT pOSt: eventURL ", eventURL);

  var mailOptions3 = {
     from: "Charlie Party App",
     to: req.body.guest_email, //req.body.user_email
     subject: "copy of your inquiry (CHARLIE PARTY)",
     template: 'inquiry',
     context: {
      eventURL: eventURL,
      guest_name: req.body.guest_name,
      guest_email: req.body.guest_email,
      guest_picture: req.body.guest_picture,
      guest_inquiry: req.body.guest_inquiry,
      event_name: req.body.event.name,

     }

}

smtpTransport.sendMail(mailOptions3, (error, response) => {
  if (error) {console.log(error)
            res.json({error}); 
    } else{
     res.json({response});
     console.log("response NODE:", response);
     smtpTransport.close();
 }

     // error ? console.log(error) : {console.log("response NODE: ", response);
     // response.send("poslano, hotovo")
     // response.status(200)
     // response.json({response});
     // smtpTransport.close();}
});
});

router.post('/access-granted',function(req,res, next){
  console.log("mail/access-granted ENDPOINT!! email for: ", req.body.guest_email);
  console.log("body: ", req.body)

  smtpTransport.use('compile', hbs({
    viewEngine: {
    extName: '.handlebars',
    partialsDir: './views/',
    layoutsDir: './views/',
    //defaultLayout: 'granted.handlebars'
  },
  viewPath: 'views'
}))

var eventURL = 'https://www.charlieparty.club/event/' + req.body.event._id 

  console.log("mail/post ENDPOINT pOSt: eventURL ", eventURL);

  var mailOptions5 = {
     from: "Charlie Party App",
     to: req.body.guest_email, //req.body.user_email
     subject: "Access Granted (CHARLIE PARTY)",
     template: 'granted',
     context: {
      eventURL: eventURL,
      guest_name: req.body.guest_name,
      event_name: req.body.event_name,
      creatorName: req.body.event.creatorName,
      creatorEmail: req.body.event.creatorEmail,
     }
}

smtpTransport.sendMail(mailOptions5, (error, response) => {
  if (error) {console.log(error)
            res.json({error}); 
    } else{
     res.json({response});
     console.log("response NODE:", response);
     smtpTransport.close();
 }

     // error ? console.log(error) : {console.log("response NODE: ", response);
     // response.send("poslano, hotovo")
     // response.status(200)
     // response.json({response});
     // smtpTransport.close();}
});
});


router.post('/postquestion',function(req,res, next){
  console.log("mail/post ENDPOINT pOSt");
  console.log("body._id: ", req.body.guestEmail)
   console.log("body._id: ", req.body.question)

  smtpTransport.use('compile', hbs({
    viewEngine: {
    extName: '.handlebars',
    partialsDir: './views/',
    layoutsDir: './views/',
    //defaultLayout: 'monkey.handlebars'
  },
  viewPath: 'views'
}))

  var mailOptions4 = {
     from: "Charlie Party App",
     to: "ihoskovecpetr@gmail.com", //req.body.user_email
     subject: "Charlie Question",
     template: 'monkey',
     context: {
      user_name: req.body.guestEmail,
      description: req.body.question,
     }

}

smtpTransport.sendMail(mailOptions4, (error, response) => {
  if (error) {console.log(error) 
    } else{
     res.json({response});
     console.log("response NODE:", response);
     smtpTransport.close();
 }

  
});


});



module.exports = router;
