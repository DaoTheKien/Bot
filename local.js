var request = require('request');
var url = 'https://17cfdde2fcd7945875e0d1acf50fe6c2:81baa2ea778b271889789e10581e8979@caphetau.myshopify.com/admin/smart_collections.json';

request({
  url: url,
  json: true
}, (err, response, body) => {
  var smartCollection = body.smart_collections;
  var element = {
    "type": "template",
    "payload": {
      "template_type": "generic",
      "elements": {
        "title": smartCollection[0].title,
        "image_url": smartCollection[0].image.src
      }
    }
  }
  console.log(element)
  // sendMessage(senderId, {attachment: element});
});
