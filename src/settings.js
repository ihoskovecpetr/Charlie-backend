
var MongoRastr = {

  name: {type: String},
  geometry: {
      type: {
      type: String,
      default: "Point"
    },
    coordinates: {
      type: [Number]
    }
    },
  addressGoogle: {type: String}, //Address..
  addressCustom: {type: String},
  eventType: {type: Number},
  dateStart: {type: Date},
  dateEnd: {type: Date},
  price: {type: Number},
  capacityMax: {type: Number},
  EventGuests: [ {guest_id: {type: String}, 
                  guest_email: {type: String}, 
                  guest_name: {type: String}, 
                  guest_photo: {type: String},
                  guest_comment: {type: String},
                  guest_confirmed: {type: Boolean},
                  guest_pending: {type: Boolean},
                  guest_inquiry: {type: String},
                }],
  BYO:{type: Boolean},
  repeatWeek: {type: Boolean},
  freeSnack:{type: Boolean}, 
  freeBeer: {type: Boolean}, 
  freeMeal: {type: Boolean},
  imagesArr: {type: Array},
  description: {type: String},
  confirmed: {type: Boolean},
  hide: {type: Boolean},
  creator_id: {type: String},
  creatorEmail: {type: String},
  creatorName: {type: String},
  creatorPhoto: {type: String},
  IsThisUser: {type: Boolean},
  userName: {type: String},
  userPicture: {type: String},
  userEmail: {type: String},
  attendedEventId: [{ event_id: {type: String},  
                      event_name: {type: String},
                      event_price: {type: String}, 
                      event_photo: {type: String},
                      event_host: {type: String},
                      event_host_email: {type: String},
                      event_host_photo: {type: String},
                      event_dateStart: {type: Date},
                      event_guestCancelled: {type: Boolean},
                      event_hostDeleted: {type: Boolean},
                      confirmed: {type: Boolean},
                      pending: {type: Boolean},
                      inquiry: {type: String},
                  }],
  hostedEventId: {type: Array},
  rating: {type: Array},  //[from: (_id) , stars: 3]

}

var indexHTML = `
        <!DOCTYPE html>
          <html lang="en">
            <head>

              <meta charset="utf-8">
              <link rel="shortcut icon" href="party-marker.png">
              <meta name="theme-color" content="#000000">
              <meta name="viewport" content="width=device-width, user-scalable=no" />

              <link rel="manifest" href="%PUBLIC_URL%/manifest.json">
              <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.0/animate.min.css">
              <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
              <link href="https://gitcdn.github.io/bootstrap-toggle/2.2.2/css/bootstrap-toggle.min.css" rel="stylesheet">
              <script src="https://gitcdn.github.io/bootstrap-toggle/2.2.2/js/bootstrap-toggle.min.js"></script>
              <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyADHzQ7cTn3uwDBUMoROC2JFdzZ_gEAzvI&libraries=places"></script>
              <script src="https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/markerclusterer.js"></script>
              
              <style>
                  #wrap p {font-size: 15px; font-weight: 200 !important;}
                  #wrap {display: inline-block; height: 150px; position: absolute; top: 25%; transform: translate(-50%, -50%);}
                  #center{text-align: center;}
              </style>
              <title>Charlie party App</title>
            </head>
            <body>
             </script>
              <noscript>
                You need to enable JavaScript to run this app.
              </noscript>
              <div id="center">
              <div id="wrap">
              <p><b>Charlie</b> &copy; 2019</p>
              </div>
              </div>
              <div id="root"></div>

              <script type="text/javascript" src="/infobubble.js"></script>
              <script type="text/javascript" src="/bund.js"></script>
            </body>
          </html>
      `


var url = 'mongodb+srv://party-admin:party-admin-heslo@cluster-party-app-fbuxs.mongodb.net/cluster-party-app?retryWrites=true';


module.exports = {	MongoRastr: MongoRastr, 
					indexHTML: indexHTML,
					url: url,
				}
					