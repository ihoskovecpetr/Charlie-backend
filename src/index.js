var express = require('express');
var router = express.Router();
var app = express();
var path = require("path");
var bodyParser = require('body-parser');

const MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var serveIndex = require('serve-index');
var _ = require("underscore");
var request = require('request');

var SettingsObj = require('./settings.js');
var AppObj = require('./app.js')

app.use('/.well-known', express.static('.well-known'), serveIndex('.well-known'));
app.use('/img', express.static('img'), serveIndex('img'));

//console.log("index.js: AppObj.PartyCollection: ", AppObj)

// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
router.use(bodyParser.json());


console.log("1!");

// mongoose.connect(SettingsObj.url, { useNewUrlParser: true });

// mongoose.set('debug', true);

// MongoClient.connect(SettingsObj.url,{ useNewUrlParser: true }, function(err, db) {
//   if (err) throw err;
//   console.log("Database connected! Tyler Charlie");
//   db.close();
// });

// const POI = new mongoose.Schema(SettingsObj.MongoRastr);

// POI.index({ geometry: "2dsphere" });

// var PartyCollection = mongoose.model('Party-collection', POI)


//const PORT = process.env.PORT || 3003

router.use(express.static(path.join(__dirname, 'public/')));
router.use(express.static(path.join(__dirname, 'public/dist')));
//router.use(express.static(`http://localhost:${PORT}/public`));


router.get('/', (req, res, next) => {
   console.log("/ ENDPOINT index.js");

  res.sendFile(path.join(__dirname + '/public/dist/index.html'));
})

router.get('/event/:id', (req, res, next) => {
   console.log("/event/:id ENDPOINT index.js req.path: ", req.path);
  
    res.send(SettingsObj.indexHTML)
})

router.get('/map', (req, res, next) => {
   console.log("/map ENDPOINT index.js req.path: ", req.path);
  
    res.send(SettingsObj.indexHTML)

})

router.get('/user-profile', (req, res, next) => {
   console.log("/user ENDPOINT index.js req.path: ", req.path);
  
    res.send(SettingsObj.indexHTML)

})

router.get('/create', (req, res, next) => {
   console.log("/create ENDPOINT index.js req.path: ", req.path);
  
    res.send(SettingsObj.indexHTML)

})

router.get('/login', (req, res, next) => {
   console.log("/login ENDPOINT index.js req.path: ", req.path);
  
    res.send(SettingsObj.indexHTML)

})

router.get('/about', (req, res, next) => {
   console.log("/about ENDPOINT index.js req.path: ", req.path);
  
    res.send(SettingsObj.indexHTML)

})


router.get('/delete-all', function(req, res, next) {
  console.log("delete-all endpoint req.body: " , req.body);

    AppObj.PartyCollection.deleteMany({ }, function(err, delData){
    console.log("DELETEDDD" + delData)
    res.json({delData});
})
});



router.post('/custom-party',function(req , res, next){
  console.log('jsme v custom-point PARTY APPPP');
  console.log("REQ.BODY @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ type");
  console.log(req.body);

var today = new Date()

console.log("date FORM, date START +  new Date(): " , req.body.dateStart , today)
// check parties cloose by..

  AppObj.PartyCollection.find(
   { dateStart: {"$gte": today}, hide: false ,geometry: {
      $nearSphere: {
          $geometry: {
              type : "Point",
              coordinates : [ req.body.lat, req.body.lng ]
                },
           $maxDistance: 1,
          } 
      },
    }
, function(err, docs){
  console.log("err")
  console.log(err)
  console.log("docs[0]")
  console.log(docs[0])

  
  if (docs[0] !== undefined && docs[0]._id.toString() !== req.body.updating_id ) {
    res.status(311)
    res.send("STATUS 311, found some close point")
  }else{

    if (req.body.isUpdating) {
console.log("/custom-party - endpoint for : req.body.isUpdating = true ")
              AppObj.PartyCollection.updateOne(
              { _id: req.body.updating_id },
              {
    "geometry.coordinates": [ req.body.lat, 
                              req.body.lng],
      name: req.body.name, 
      dateStart: req.body.dateStart, 
      dateEnd: req.body.dateEnd,
      repeatWeek: req.body.repeatWeek, 
      price: req.body.price, 
      capacityMax: req.body.capacityMax,
      BYO: req.body.BYO,
      //EventGuests: req.body.EventGuests, 
          freeSnack: req.body.freeSnack, 
          freeBeer: req.body.freeBeer, 
          freeMeal: req.body.freeMeal,
      imagesArr: req.body.imagesArr, 
      description: req.body.description, 
      addressGoogle: req.body.addressGoogle, 
      addressCustom: req.body.addressCustom, 
      confirmed: req.body.confirmed, 
      eventType: req.body.eventType,
      hide: req.body.hide,
          creatorEmail: req.body.creatorEmail, 
          creatorName: req.body.creatorName,
          creatorPhoto: req.body.creatorPhoto,
      IsThisUser: false,
      userName: req.body.userName ,
      userPicture: req.body.userPicture ,
      userEmail: req.body.userEmail ,
      attendedEventId: req.body.attendedEventId ,
      hostedEventId: req.body.hostedEventId ,
      rating: req.body.rating
  }, function(err, data){
    console.log("err /custom-party:updating")
    console.log(err)
    console.log("data /custom-party:updating")
    console.log(data)
        res.json({data: data});
  })
    } else{

        AppObj.PartyCollection.create({
    "geometry.coordinates": [ req.body.lat, 
                              req.body.lng],
      name: req.body.name, 
      dateStart: req.body.dateStart, 
      dateEnd: req.body.dateEnd,
      repeatWeek: req.body.repeatWeek, 
      price: req.body.price, 
      capacityMax: req.body.capacityMax,
      EventGuests: req.body.EventGuests,
      BYO: req.body.BYO, 
          freeSnack: req.body.freeSnack, 
          freeBeer: req.body.freeBeer, 
          freeMeal: req.body.freeMeal,
      imagesArr: req.body.imagesArr, 
      description: req.body.description, 
      addressGoogle: req.body.addressGoogle, 
      addressCustom: req.body.addressCustom, 
      eventType: req.body.eventType,
      confirmed: req.body.confirmed, 
      hide: req.body.hide,
          creator_id: req.body.creator_id,
          creatorEmail: req.body.creatorEmail, 
          creatorName: req.body.creatorName,
          creatorPhoto: req.body.creatorPhoto,
      IsThisUser: false,
      userName: req.body.userName ,
      userPicture: req.body.userPicture,
      userEmail: req.body.userEmail ,
      //attendedEventId: req.body.attendedEventId ,
      hostedEventId: req.body.hostedEventId ,
      rating: req.body.rating
  }, function(err, data){
    console.log("EVENT typke: ", req.body.eventType)
    console.log("err /add-custom-party SSSS")
    console.log(err)
    console.log("data /add-custom-party")
    console.log(data)
    console.log("data._id XXXXXXX")
    console.log(data._id)
        res.json({data: data});
      } )

    }
    //sem zbytek create eventu??
  }
  }
).limit( 1 )

});


router.post('/add-user',function(req , res, next){
  console.log('jsme v add-user, REQ.BODY:' , req.body);
    AppObj.PartyCollection.find(
     {IsThisUser: true, userEmail: req.body.userEmail
      }
  , function(err, data){
    console.log("ERR search for user", err)
    console.log("DATA search for user", data)
    if (data[0] == undefined) {
      console.log("ADDing NEW USER")
        AppObj.PartyCollection.create({
    "geometry.coordinates": [req.body.lat, req.body.lng],
     dateStart: req.body.dateStart, 
     confirmed: true, 
     hide: false,
     IsThisUser: true,
    userName: req.body.userName,
    userPicture: req.body.userPicture,
    userEmail: req.body.userEmail,
    attendedEventId: [],
    hostedEventId: [],
  }, function(err, data){
    console.log("ERR AppObj.PartyCollection.create", err)
    console.log("DATA AppObj.PartyCollection.create NEW USER", data)
        res.json({data: data});
      } )
    } else{
      console.log("This USER ALREADY EXIST, send DATA: ")
      console.log(data)
        res.json({data: data[0]});
    }
    }
  )
});



//user Info Email as a attribute

router.post('/user-info', function(req, res, next) {
  console.log("users-info ENDPOINT req.body: ", req.body);
  AppObj.PartyCollection.find(
     { userEmail: req.body.userEmail
      }
  , function(err, data){
    console.log("err")
    console.log(err)
    console.log("data")
    console.log(data[0])
    if (data[0] == undefined) {
      console.log("Prazdna mnozina of results /user-info")
    } 
          res.json({data: data});
    }
  )
});



router.post('/users-info-array', function(req, res, next) {
  console.log("users-info-array ENDPOINT req.body.userEmail ", req.body.userEmail);
  var felonUsers = []
 _.map(req.body.userEmail, (emailUsera, index) => felonUsers.push(emailUsera))
 console.log("QUERY tyhle maily ", felonUsers)
  AppObj.PartyCollection.find(
     { userEmail: felonUsers, IsThisUser: true }
  , function(err, data){
    console.log("err")
    console.log(err)
    console.log("data")
    console.log(data)
    if (data[0] == undefined) {
      console.log("Prazdna mnozina of results /users-info-array")
    } else{
      res.json({data: data});
      }

      }
    )
});

router.post('/confirm-event', function(req, res, next) {
  console.log("/confirm-event ENDPOINT req.body ", req.body);

    AppObj.PartyCollection.updateOne(
         { _id: req.body.event_id },
       { $set: { confirmed : true } },
       function(err, data){
        console.log("/api/delete-event - GUEST Update err", err)
        console.log("/api/delete-event - GUEST Update data", data)
        console.log(data)
        res.json({data: data});
      }
    )
  }
);

router.post('/user-hosted', function(req, res, next) {
  console.log("User-Hosted ENDPOINT req.body ", req.body);
  AppObj.PartyCollection.find(
     { creatorEmail: req.body.userEmail, hide: false }
  , function(err, data){
    console.log("err")
    console.log(err)
    console.log("data")
    console.log(data[0])
    if (data[0] == undefined) {
      console.log("Prazdna mnozina of results /user-hosted")
    }
  res.json({data: data});
    }
  )
});




router.post('/delete-event', function(req, res, next) {
  console.log("/delete-event ENDPOINT req.body ", req.body);

    AppObj.PartyCollection.updateOne(
         { _id: req.body.eventId },
       { $set: { hide : true } },
       function(err, data){
        console.log("/api/delete-event - GUEST Update err", err)
        console.log("/api/delete-event - GUEST Update data" + data)
      }
    )
    AppObj.PartyCollection.updateMany(
      { "attendedEventId.event_id": req.body.eventId },
       { $set: { "attendedEventId.$.event_hostDeleted" : true } },
       function(err, data){
        console.log("/api/delete-event - GUEST Update err", err)
        console.log("/api/delete-event - GUEST Update data" + data)
      res.json({data: data});
      }
    )
});



// router.get('/event/:id', function(req, res, next) {
//   console.log("/event/:id EDNPOINT ", req.body);
//   console.log("enevtId: ", req.params.id)
//   res.redirect('/user');

//   // AppObj.PartyCollection.findOne({ _id: req.body.eventId } , function(err, data){
//   //         console.log("err")
//   //         console.log(err)
//   //         console.log("data event-info EDNPOINT cc")
//   //         console.log(data)
//   //         if (data !== undefined) {
//   //           console.log('/event-info EDNPOINT some DATA')
//   //           res.json({data: data});
//   //         } else{
//   //             console.log('/event-info EDNPOINT keine 0 DATA')
//   //             res.status(311)
//   //             res.send("NOTHING FOUND")
//   //         }
        
//   //         }
//   // )
// });


router.post('/events-info-array', function(req, res, next) {
  console.log("events-info-array EDNPOINT ", req.body);
 
//make digestable arr of Id for find() and find only active not cancelled events

  var ArrOfId = [];
  _.map(req.body.eventsIdArr, (event, index) => {
    if (!event.event_guestCancelled && !event.event_hostDeleted){
          ArrOfId.push(event.event_id)
    }
})

  AppObj.PartyCollection.find({ _id: ArrOfId } , function(err, data){
          console.log("/events-info-array - err")
          console.log(err)
          console.log("/events-info-array - data")
          console.log(data)
        res.json({data: data});
          }
  )
});




// router.get('/api/near-fetch',function(req , res, next){
//   console.log('jsme v /api/near-fetch');

// AppObj.PartyCollection.find(
//    {geometry: {
//       $nearSphere: {
//           $geometry: {
//               type : "Point",
//               coordinates : [ 151.2426405 , -33.9420607 ]
//                 },
//            $maxDistance: 1,
//           } 
//       },
//     }
// , function(err, docs){
//   console.log("err")
//   console.log(err)
//   console.log("docs")
//   console.log(docs)
//   if (docs) {
//     res.status(311)
//     res.send("STATUS 311, found some close point")
//   }else{
//     res.status(200)
//     res.send("STATUS 200, noone near, keep on going")
//   }
//   }
// ).limit( 1 )
// });


//Index get - loading static index.html
router.get('/*', function(req, res, next) {
  console.log("Catched, redirected to home '/' ");
   return res.redirect('/');
   next();
});

router.use(express.static(path.join(__dirname, 'public/client/dist')));


module.exports = router;
