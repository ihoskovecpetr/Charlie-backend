var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
var path = require("path");
var _ = require("underscore");

var SettingsObj = require('./settings.js');
var AppObj = require('./app.js')




/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource Maroubra');
});

router.post('/get-user-info', function(req, res, next) {
  console.log("api2/get-user-info ENDPOINT req.body: ", req.body);
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
    } else{
          res.json({data: data});
    }
  }
  )
});


router.post('/rating', function(req, res, next) {
  console.log(" endpoint /rating - req.body: " , req.body);
    var rate = {  guestId : req.body.guestId, 
                  guestName: req.body.guestName,
                  guestPicture: req.body.guestPicture,
                  ratedEventId : req.body.eventId , 
                  ratingCustom : req.body.rating,
                  ratingComment : req.body.ratingComment
                   };
      
      AppObj.PartyCollection.updateOne(
  {  _id: req.body.creatorId },
  { $push: {rating : rate}}, function(err, data){
    console.log("RATED John PartyLiker" + data)
    res.json({data: data})
  }
)

});


router.post('/boundaries',function(req , res, next){
  console.log('fetch Boundaries req.body', req.body);

AppObj.PartyCollection.find(
   {dateStart: {"$gte": req.body.startD, "$lte": req.body.endD}, hide : false , geometry: {
       $geoWithin: {
          $geometry: {
             type : "Polygon" ,
             coordinates: [[[ req.body.sw1, req.body.sw2 ], 
                    [ req.body.ne1, req.body.sw2 ], 
                    [req.body.ne1, req.body.ne2], 
                    [ req.body.sw1, req.body.ne2], 
                    [ req.body.sw1, req.body.sw2 ]]]
          }
       }
      }
    }
, function(err, docs){
  console.log("err")
  console.log(err)
  console.log("docs")
  console.log(docs)
res.json({docs: docs});
  }
)//.limit(100)
});


router.post('/boundariesSingle',function(req , res, next){
  console.log('fetch Boundaries SINGLE req.body', req.body);

AppObj.PartyCollection.find(
   {dateStart: {"$gte": req.body.singleD, "$lte": req.body.singleDTmr} , hide : false, IsThisUser: false , geometry: {
       $geoWithin: {
          $geometry: {
             type : "Polygon" ,
             coordinates: [[[ req.body.sw1, req.body.sw2 ], 
                    [ req.body.ne1, req.body.sw2 ], 
                    [req.body.ne1, req.body.ne2], 
                    [ req.body.sw1, req.body.ne2], 
                    [ req.body.sw1, req.body.sw2 ]]]
          }
       }
      }
    }
, function(err, docs){
  console.log("err")
  console.log(err)
  console.log("docs")
  console.log(docs)
res.json({docs: docs});
  }
)//.limit(100)
});


router.post('/all-venues',function(req , res, next){
  console.log('fetch All venues SINGLE req.body', req.body);

AppObj.PartyCollection.find(
   {dateStart: {"$gte": req.body.singleD, "$lte": req.body.singleDTmr} , hide : false, IsThisUser: false 
    }
, function(err, docs){
  console.log("err")
  console.log(err)
  console.log("docs")
  console.log(docs)
res.json({docs: docs});
  }
)//.limit(100)
});


router.post('/nearVenues',function(req , res, next){
  console.log('nearVenues endpoint!!');
  console.log(req.body.workingLocationGate);

AppObj.PartyCollection.find(
   {dateStart: {"$gte": req.body.singleD, "$lte": req.body.singleDTmr}, hide : false, IsThisUser: false ,

   geometry: {
      $nearSphere: {
          $geometry: {
              type : "Point",
              coordinates : [ req.body.workingLocationGate[1] , req.body.workingLocationGate[0] ]
                },
          // $maxDistance: 900000,
          } 
      }
    }
, function(err, docs){
  console.log("err")
  console.log(err)
  console.log("docs")
  console.log(docs)
res.json({docs: docs});
  }
).limit( 40 )
});

//user Info _id as a attribute

router.post('/user-info-id', function(req, res, next) {
  console.log("Users- Info ENDPOINT req.body ", req.body);
  AppObj.PartyCollection.find(
     { _id: req.body.user_id
      }
  , function(err, data){
    console.log("err")
    console.log(err)
    console.log("data user-info-id :id")
    console.log(data)
    if (data[0] == undefined) {
      console.log("Prazdna mnozina of results /api2/user-info-id")
    } 
          res.json({data: data});
    }
  )
});


router.post('/cancel-guest', function(req, res, next) {
  console.log("/api2/cancel-guest ENDPOINT req.body ", req.body);
  AppObj.PartyCollection.updateOne(
     { _id: req.body.eventId },
      { $pull: { EventGuests: { guest_id: req.body.user_id} } }
  , function(err, data){
    console.log("EventGuests Updated ++ ParticipantEmail" + data)
  }
)

  AppObj.PartyCollection.update(
     { _id: req.body.user_id , "attendedEventId.event_id": req.body.eventId },
   { $set: { "attendedEventId.$.event_guestCancelled" : true } },
   function(err, data){
    console.log("DELETED from USER attendedEventId err", err)
    console.log("DELETED from USER attendedEventId" + data)
  res.json({data: data});
  }
)
});

router.post('/accept-guest', function(req, res, next) {

        console.log("/api2/accept-guest ENDPOINT req.body ", req.body);

        AppObj.PartyCollection.updateOne(
           { _id: req.body.eventId, "EventGuests.guest_id": req.body.guest_id },
            { $set: { "EventGuests.$.guest_pending" : false, "EventGuests.$.guest_confirmed" : true }}
        , function(err, data){
          console.log("Event EventGuests confirmed! " + data)
        }
      )

        AppObj.PartyCollection.update(
           { _id: req.body.guest_id , "attendedEventId.event_id": req.body.eventId },
         { $set: { "attendedEventId.$.confirmed" : true , "attendedEventId.$.pending" : false  } },
         function(err, data){
          console.log("DELETED from USER attendedEventId err", err)
          console.log("DELETED from USER attendedEventId" + data)
        res.json({data: data});
        }
      )
});


router.post('/add-attend',function(req , res, next){
  console.log('jsme v add-attend ENDpoint');
  console.log("REQ.BODY");
  console.log(req.body);

  var insert = {"guest_id": req.body.user_id,
                "guest_email": req.body.user_email, 
                "guest_name": req.body.user_name, 
                "guest_photo": req.body.user_photo,
                "guest_confirmed": false,
                "guest_pending": true,
                "guest_inquiry": req.body.inquiry,}

  AppObj.PartyCollection.updateOne(
    {  _id: req.body.event_id },
    { $push: { EventGuests: insert }}, function(err, data){
      console.log("EventGuests Updated ++ ParticipantEmail" + data)}
  )

    AppObj.PartyCollection.updateOne(
     { _id: req.body.user_id,  "attendedEventId.event_id": req.body.event_id },
   { $set: { "attendedEventId.$.event_guestCancelled" : false } },
   function(err, data){
    console.log("/add-attend - GUEST PREVIOUSLY JOIN err", err)
    console.log("/add-attend - GUEST PREVIOUSLY JOIN data")
    console.log(data)
    if (data.n == 0) {
      console.log("NOT PREVIOUSLY JOIN")

      var insertUser = {"event_id": req.body.event_id, 
                      "event_name": req.body.event_name, 
                      "event_price": req.body.event_price,
                      "event_photo": req.body.event_photo,
                      "event_dateStart": req.body.event_dateStart,
                      "event_guestCancelled": false,
                      "event_hostDeleted": false,
                      "confirmed": false,
                      "pending": true,
                      "event_host": req.body.event_host,
                      "event_host_email": req.body.event_host_email,
                      "event_host_photo": req.body.event_host_photo,
                      "inquiry": req.body.inquiry,
                    };

    console.log("INSERting into her this bog boy: ", insertUser)

    AppObj.PartyCollection.updateMany(
  { IsThisUser: true, userEmail: req.body.user_email },
  { $push: { attendedEventId: insertUser }}, function(err, data){
    console.log("attendedEventId Hotovo add _id of Event" + data)}
  )
      }
      res.json({data: data})
    }
  )

});

router.post('/event-info', function(req, res, next) {
    console.log("/event-info EDNPOINT ", req.body);
    console.log("enevtId: ", req.body.eventId)
    var id = req.body.eventId
    AppObj.PartyCollection.findOne({ _id: req.body.eventId } , function(err, data){
            console.log("err")
            console.log(err)
            console.log("data event-info EDNPOINT")
            console.log(data)
            if (data !== undefined) {
              console.log('/event-info EDNPOINT some DATA')
              res.json({data: data});
            } else{
                console.log('/event-info EDNPOINT keine 0 DATA')
                res.status(311)
                res.send("NOTHING FOUND")
            }
          
            }
    )
});

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


router.get('/info-stats', function(req, res, next) {
    AppObj.PartyCollection.find({} , function(err, data){
          console.log("/events-info-array - err")
          console.log(err)
          console.log("/events-info-array - data")
          console.log(data)
        res.json({data: data});
          }
  )

});
module.exports = router;