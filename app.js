var express = require('express');
var request = require('request');
var _ = require('lodash');
var bodyParser = require('body-parser');
var messages = require('./messages.js');

const ShopifyBuy = require('shopify-buy');
// const Shopify = require('shopify-api-node');
const shopifyAPI = require('shopify-node-api');

const apiKey = '17cfdde2fcd7945875e0d1acf50fe6c2';
const password = '81baa2ea778b271889789e10581e8979';
const accessToken = '64956e0c29ac38eb06f9768968ae246b';

var collection = [];

// const shopify = new Shopify({
//    shopName: 'caphetau',
//    apiKey: '17cfdde2fcd7945875e0d1acf50fe6c2',
//    password: '81baa2ea778b271889789e10581e8979'
// });


var shopify = new shopifyAPI({
   shop: 'caphetau', // MYSHOP.myshopify.com
   shopify_api_key: 'b1a18a405f32a49a2e3752582b68a2bd', // Your API key
   shopify_shared_secret: '07b3b6ac271f6a1945a6da165cfc3cab', // Your Shared Secret
   access_token: accessToken,
   verbose: false
   // shopify_scope: 'read_products',
   // redirect_uri: 'http://scb.solutions-union.com',
   // nonce: 'c1d0b4b9970e69d0b20da281bf223aae' // you must provide a randomly selected value unique for each authorization request
});


var shopClient = ShopifyBuy.buildClient({
   accessToken: '87269e2bcb8744b47909f3d55a05defc',
   domain: 'caphetau.myshopify.com',
   appId: '6'
});

function buyButton(id, callback) {
   shopClient.fetchProduct(id)
   .then(function (product) {
      var urlArray = [];
      product.variants.forEach((variant) => {
         var quantity = 1;
         var checkoutURL = variant.checkoutUrl(quantity);
         urlArray.push(checkoutURL);
      })
      callback(urlArray);
   })
   .catch(err => console.error(err));
};

var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.listen(app.get('port'));

//Server index page
app.get('/', (req, res) => {
   res.send('Deployed!');
});

//Facebook Webhook
//Used for verification
app.get('/webhook', (req, res) => {
   if (req.query['hub.verify_token'] === 'this_is_my_token') {
      console.log('Verified webhook');
      res.status(200).send(req.query['hub.challenge']);
   } else {
      console.error('Verification failed. The tokens do not match.');
      res.sendStatus(403);
   }
});

// All callbacks for Messenger will be POST-ed here
app.post("/webhook", (req, res) => {
   // Make sure this is a page subscription
   if (req.body.object == "page") {
      // Iterate over each entry
      // There may be multiple entries if batched
      req.body.entry.forEach((entry) => {
         // Iterate over each messaging event
         entry.messaging.forEach((event) => {
            if (event.postback) {
               processPostback(event);
            }
            else {
               processMessage(event);
            }
         });
      });

      res.sendStatus(200);
   }
});


function processPostback(event) {

   var senderId = event.sender.id;
   var payload = event.postback.payload;

   if (payload === "Greeting") {
      request({
         url: "https://graph.facebook.com/v2.6/" + senderId,
         qs: {
            access_token: process.env.PAGE_ACCESS_TOKEN,
            fields: "first_name"
         },
         method: "GET"
      }, function(error, response, body) {
         if (error) {
            console.log("Error getting user's name: " +  error);
         } else {
            var bodyObj = JSON.parse(body);
            name = bodyObj.first_name;
         }

         setTimeout(() => {
            sendMessage(senderId, {text: messages.message1});
         }, 1000);
         setTimeout(() => {
            sendMessage(senderId, {text: messages.message2});
         }, 2000);
         setTimeout(() => {
            sendMessage(senderId, {attachment: messages.messageOption});
         }, 3000);

      })
   };

   if (payload === "SHOPPING_INFO_PAYLOAD") {
      setTimeout(() => {
         sendMessage(senderId, {text: messages.message3});
      }, 1000);
      setTimeout(() => {
         sendMessage(senderId, {attachment: messages.messageData});
      }, 1500);
   };


   if (payload === "SHOPPING_PAYLOAD") {

      // request({
      //    url: url,
      //    json: true
      // }, (err, response, body) => {
      //
      //    var customCollection = body.custom_collections;
      //    customCollection[0].image = { 'src': 'https://external.xx.fbcdn.net/safe_image.php?d=AQBbJwEqF8YUvzsK&url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F1023%2F1927%2Fproducts%2FMUTXuXjfQxymW1HG8ZJq_Original-samsung-icr18650-icr-18650-icr18650-22f-Protected-18650-battery-high-quality-2200mah-3-7v-li_764x400_pad.jpg%3Fv%3D1492238290&_nc_hash=AQAyPcWAQfxSKO53'}
      //    customCollection[1].image = { 'src': 'https://external.xx.fbcdn.net/safe_image.php?d=AQCdHhci4GwBImIl&url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F1023%2F1927%2Fproducts%2FBrewichDare_764x400_pad.jpg%3Fv%3D1492237919&_nc_hash=AQCnJxSrx5ajYx8K'}


      shopify.get('/admin/smart_collections.json', function(err, data, headers) {
         collection = data.smart_collections;
         shopify.get('/admin/custom_collections.json', function(err, data, headers) {
            collection = collection.concat(data.custom_collections);
         });

         sendMessage(senderId, {text: messages.message3});
         setTimeout(() => {
            sendMessage(senderId, messages.display(collection, "C"));
         }, 1000);
      });
   }




   if (payload.substr(0, 1) === "C") {
      shopify.get(`/admin/products.json?collection_id=${payload.substr(1)}`, function(err, data, headers) {
         collection = data.products;
         sendMessage(senderId, messages.display(collection, "P"));
      });
   }

   if (payload.substr(0, 1) === "P") {
      shopify.get(`/admin/products/${payload.substr(1)}/variants.json`, function(err, data, headers) {
         collection = data.variants;
         buyButton(payload.substr(1), (link, array) => {
            array = collection;
            sendMessage(senderId, messages.display(array, undefined, link));
         });
      });
   }

};
//
//    if(payload.substr(0, 1) === "P") {
//       shopify.productVariant.list(payload.substr(1))
//       .then(variant => {
//             request({
//                url: `https://17cfdde2fcd7945875e0d1acf50fe6c2:81baa2ea778b271889789e10581e8979@caphetau.myshopify.com/admin/products/${payload.substr(1)}/images.json`,
//                json:true
//             }, (err, response, body) => {
//                for (i = 0; i < variant.length; i++) {
//                   variant[i].image = { 'src': body.images[0].src };
//                }
//
//                buyButton(payload.substr(1), (link, array) => {
//                   array = variant;
//                   sendMessage(senderId, messages.display(array, undefined, link));
//                })
//             });
//          })
//          .catch(err => console.error(err));
//       };
//
//
//    if (payload === "MORE_INFO_PAYLOAD") {
//       sendMessage(senderId, {text: messages.info});
//    };
//
// };

function processMessage(event) {
   var senderId = event.sender.id;
   var message = event.message.text;
   if (message === "View more") {
      collection = collection.splice(5);
      sendMessage(senderId, messages.display(collection, "C"));
      return collection;
   }

};


// sends message to user
function sendMessage(recipientId, message) {
   request({
      url: "https://graph.facebook.com/v2.6/me/messages",
      qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
      method: "POST",
      json: {
         recipient: {id: recipientId},
         message: message,
      },
      // "sender_action": "typing_on"
   }, function(error, response, body) {
      if (error) {
         console.log("Error sending message: " + response.error);
      }
   });
};
