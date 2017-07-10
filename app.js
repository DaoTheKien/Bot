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
                  "type":"web_url",
                  "url":"https://www.taudientu.com/",
                  "title":"Show Website"
                },
                {
                  "type":"postback",
                  "title":"Start Chatting",
                  "payload":"USER_DEFINED_PAYLOAD"
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
      },110);

      setTimeout( function () {
        sendMessage(senderId, {text: message2});
      },120);

      setTimeout( function () {
        sendMessage(senderId, {attachment: first});
      }, 130);

      setTimeout( function () {
        sendMessage(senderId, {attachment: productTest});
      }, 150)


    });
  }
}

// sends message to user
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
}
