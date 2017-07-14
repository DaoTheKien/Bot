const Shopify = require('shopify-api-node');

const shopify = new Shopify({
  shopName: 'caphetau', // MYSHOP.myshopify.com
  apiKey: '17cfdde2fcd7945875e0fe6c2', // Your API key
  password: '81baa2ea778b271889789e10581e8979'
});

var url = 'https://17cfdde2fcd7945875e0d1acf50fe6c2:81baa2ea778b271889789e10581e8979@caphetau.myshopify.com/admin/custom_collections.json?fields=id,title';

var express = require("express");
var request = require("request");
var bodyParser = require("body-parser");

var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.listen((process.env.PORT || 5000));

// Server index page
app.get("/", function (req, res) {
  res.send("Deployed!");
});

// Facebook Webhook
// Used for verification
app.get("/webhook", function (req, res) {
  if (req.query["hub.verify_token"] === process.env.VERIFICATION_TOKEN) {
    console.log("Verified webhook");
    res.status(200).send(req.query["hub.challenge"]);
  } else {
    console.error("Verification failed. The tokens do not match.");
    res.sendStatus(403);
  }
});

// All callbacks for Messenger will be POST-ed here
app.post("/webhook", function (req, res) {
  // Make sure this is a page subscription
  if (req.body.object == "page") {
    // Iterate over each entry
    // There may be multiple entries if batched
    req.body.entry.forEach(function(entry) {
      // Iterate over each messaging event
      entry.messaging.forEach(function(event) {
        if (event.postback) {
          processPostback(event);
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
    // Get user's first name from the User Profile API
    // and include it in the greeting
    request({
      url: "https://graph.facebook.com/v2.6/" + senderId,
      qs: {
        access_token: process.env.PAGE_ACCESS_TOKEN,
        fields: "first_name"
      },
      method: "GET"
    }, function(error, response, body) {
      var greeting = "";
      if (error) {
        console.log("Error getting user's name: " +  error);
      } else {
        var bodyObj = JSON.parse(body);
        name = bodyObj.first_name;
        greeting = "Hi " + name + ". ";
      }
      var message = greeting + "VAPE Tau Dien Tu xin chao";
      var message1 = "Shop là nơi uy tín hàng đầu dành cho vaper tại Việt nam với nguyên tắc.Nói không với clone!";
      var message2 = "Bắt đầu chat với chúng tôi hoặc lựa chọn các menu tư vấn nhanh dưới đây";
      var message3 = "Đây là một số VAPE & tinh dầu mới về tại shop. Xin mời bạn xem qua nhé";
      var first = {
        "type":"template",
        "payload":{
          "template_type":"button",
          "text":"What do you want to do next?",
          "buttons":[
            {
              "title":"Mua sắm",
              "type":"postback",
              "payload":"SHOPPING_PAYLOAD"
            },
            {
              "type":"web_url",
              "url":"https://www.taudientu.com/",
              "title":"Show Website"
            },
            {
              "type":"postback",
              "title":"Tu van them",
              "payload":"MORE_INFO_PAYLOAD"
            }
          ]
        }
      };
      var productTest = {
        "type":"template",
        "payload":{
          "template_type":"generic",
          "image_aspect_ratio":"square",
          "elements":[
            {
              "title":"Khuyến mãi giới thiệu tinh dầu vape VADER đến 31/05/2017",
              "image_url":"http://imagizer.imageshack.us/480x480f/923/SLsn7S.jpg",
              "subtitle":"Cơ hội đặc biệt mua tinh dầu vape với giá siêu khuyến mãi chỉ 220,000đ",
              "default_action": {
                "type": "web_url",
                "url": "https://www.taudientu.com/collections/khuy-n-mai-tinh-d-u-vape-20-03-09-04-2017"
              },
              "buttons":[
                {
                  "type":"web_url",
                  "url":"https://www.taudientu.com/collections/khuy-n-mai-tinh-d-u-vape-20-03-09-04-2017",
                  "title":"Chi tiết",
                }
              ]
            }, {
              "title":"Tổng hợp Top 100 tinh dầu Vape 2017 tại #Taudientu",
              "image_url":"http://imagizer.imageshack.us/480x480f/923/t9qKwC.jpg",
              "subtitle":"Tổng hợp list 100 tinh dầu vape bán chạy nhất, được ưa chuộng nhất tại #Tẩu Điện Tử",
              "default_action": {
                "type": "web_url",
                "url": "https://www.taudientu.com/collections/t-ng-h-p-top-100-tinh-d-u-vape-2017"
              },
              "buttons":[
                {
                  "type":"web_url",
                  "url":"https://www.taudientu.com/collections/t-ng-h-p-top-100-tinh-d-u-vape-2017",
                  "title":"Chi tiết",
                }
              ]
            }, {
              "title":"Châm tinh dầu là xài được ngay! Trọn bộ VAPE dành cho người mới",
              "image_url":"http://imagizer.imageshack.us/480x480f/924/NWEB5J.jpg",
              "subtitle":"Combo vape giá cực ưu đãi dành cho người mới bắt đầu",
              "default_action": {
                "type": "web_url",
                "url": "https://www.taudientu.com/collections/t-u-di-n-t"
              },
              "buttons":[
                {
                  "type":"web_url",
                  "url":"https://www.taudientu.com/collections/t-u-di-n-t",
                  "title":"Chi tiết",
                }
              ]
            }
          ]
        }

      }
      setTimeout( function () {
        sendMessage(senderId, {text: message});
      }, 0);

      setTimeout( function () {
        sendMessage(senderId, {text: message1});
      },1000);

      setTimeout( function () {
        sendMessage(senderId, {text: message2});
      },2000);

      setTimeout( function () {
        sendMessage(senderId, {attachment: first});
      }, 5000);
      setTimeout( function () {
        sendMessage(senderId, {text:message3});
      }, 3000);

      setTimeout( function () {
        sendMessage(senderId, {attachment: productTest});
      }, 4000)


    });
  };

  if (payload === "SHOPPING_PAYLOAD") {

    request({
      url: url,
      json: true
    }, (err, response, body) => {
      var customCollection = body.custom_collection;
      customCollection[0].image = {'src': 'https://external.xx.fbcdn.net/safe_image.php?d=AQBbJwEqF8YUvzsK&url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F1023%2F1927%2Fproducts%2FMUTXuXjfQxymW1HG8ZJq_Original-samsung-icr18650-icr-18650-icr18650-22f-Protected-18650-battery-high-quality-2200mah-3-7v-li_764x400_pad.jpg%3Fv%3D1492238290&_nc_hash=AQAyPcWAQfxSKO53'}
      customCollection[1].image = {'src': 'https://external.xx.fbcdn.net/safe_image.php?d=AQCdHhci4GwBImIl&url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F1023%2F1927%2Fproducts%2FBrewichDare_764x400_pad.jpg%3Fv%3D1492237919&_nc_hash=AQCnJxSrx5ajYx8K'}
      customCollection[2].image = {'src': 'https://external.xx.fbcdn.net/safe_image.php?d=AQDKJ-ajdU1mHB76&url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F1023%2F1927%2Fproducts%2Fewsad_764x400_pad.jpg%3Fv%3D1492237924&_nc_hash=AQAaF61ORoCjlDZ4'}
      sendMessage(senderId, {text: messages3});
      shopify.smartCollection.list()
      .then(collection => {
        collection = customCollection.concat(collection);
        sendMessage(senderId, display(collection));
      })
      .catch(err => console.error(err));
    });
  };
};

function processMessage(event) {
  var senderId = event.sender.id;
  var message = event.message.text;
  if (message === "View more") {
    shopify.smartCollection.list()
    .then(collection => {
      sendMessage(senderId, display(collection.splice(7)));
    })
    .catch(err => console.error(err))
  }
};

//sends message to user
function sendMessage(recipientId, message) {
  request({
    url: "https://graph.facebook.com/v2.6/me/messages",
    qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
    method: "POST",
    json: {
      recipient: {id: recipientId},
      message: message,
    }
  }, function(error, response, body) {
    if (error) {
      console.log("Error sending message: " + response.error);
    }
  });
};

function getImage(array) {
   var imageArray = [];

   for (i = 0; i < array.length; i++) {
      if (_.isNull(array[i])) { continue; }
      if (_.isEmpty(array[i])) { continue; }
      if (_.isNull(array[i].images)) { continue; }
      if (_.isNull(array[i].image)) {
         imageArray.push('https://www.theclementimall.com/assets/camaleon_cms/image-not-found-4a963b95bf081c3ea02923dceaeb3f8085e1a654fc54840aac61a57a60903fef.png');
         continue;
      }
      if (_.has(array[i],'image')) {
         var image = array[i].image.src;
         imageArray.push(image);
         continue;
         // console.log(imageArray);
      }
      if (_.has(array[i],'images')) {
         var image = array[i].images[0].src;
         imageArray.push(image);
         continue;
      }
      if (_.isEmpty(array[i].images)) {
         imageArray.push('https://www.theclementimall.com/assets/camaleon_cms/image-not-found-4a963b95bf081c3ea02923dceaeb3f8085e1a654fc54840aac61a57a60903fef.png');
         continue;
      }

   };
   return imageArray;
};


function addElement(input) {
   var elements = [];
   var images = getImage(input);
   for (i = 0; i < 10; i++) {
      if (_.isEmpty(input[i])) { break; }
      else {

         var element = {
            "title": input[i].title,
            "image_url": images[i],
            "buttons": [
               {
                  "type": "postback",
                  "payload": `C${input[i].id}`,
                  "title": "Chi tiết"
               }
            ]
         };
         elements.push(element);
      }
   }
   return elements;
};


function display(source) {
   var addedElements = addElement(source);

   function quick_replies(array) {
      if (array.length < 10) { return; }
      else {
         return [
            {
               "content_type": "text",
               "title": "View more",
               "payload": "VIEW_MORE_PAYLOAD"
            }
         ]
      }
   };

   var data = {
      "attachment": {
         "type": "template",
         "payload": {
            "template_type": "generic",
            // "image_aspect_ratio": "square",
            "elements": addedElements
         }
      },
      "quick_replies": quick_replies(source)
   };

   return data;
};
