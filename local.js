var request = require('request');
var url = 'https://64956e0c29ac38eb06f9768968ae246b@caphetau.myshopify.com/admin/smart_collections.json';
// var url = 'https://17cfdde2fcd7945875e0d1acf50fe6c2:81baa2ea778b271889789e10581e8979@caphetau.myshopify.com/admin/smart_collections.json';
// request({
//   url: url,
//   json: true
// }, (err, response, body) => {
//   var smartCollection = body.smart_collections;
//   var element = {
//     "type": "template",
//     "payload": {
//       "template_type": "generic",
//       "elements": {
//         "title": smartCollection[0].title,
//         "image_url": smartCollection[0].image.src
//       }
//     }
//   }
//   console.log(element)
//   // sendMessage(senderId, {attachment: element});
// });
// var input = body.smart_collections.length;
// console.log(input);

request({
  url: url,
  json: true
}, (err, response, body) => {
  var input = body.smart_collections.length;
  // console.log(input);
  for (var i = 0; i< input; i++) {
    var smartCollection = body.smart_collections;
      var element = {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": {
            "title": smartCollection[`${i}`].title,
            "image_url": smartCollection[`${i}`].image.src}


        }
      };
      if (i > 3) {
        smartCollection[`${i}`].image = {'src': 'https://www.theclementimall.com/assets/camaleon_cms/image-not-found-4a963b95bf081c3ea02923dceaeb3f8085e1a654fc54840aac61a57a60903fef.png'}
      }
      console.log(i);
      console.log(element)
      // sendMessage(senderId, {attachment: element});
  }

});


// const ShopifyToken = require('shopify-token');
// const accessToken = '64956e0c29ac38eb06f9768968ae246b';
//
// const shopifyToken = new ShopifyToken({
//   sharedSecret: '07b3b6ac271f6a1945a6da165cfc3cab',
//   redirectUri: 'https://dashboard.heroku.com/apps/rugged-glacier-98858',
//   apiKey: 'b1a18a405f32a49a2e3752582b68a2bd'
// });
//
// shopifyToken.generateNonce()

// const nonce = shopifyToken.generateNonce();
//
// console.log(nonce);
//48abc950bf366695da3e8df64387ea2e nonce

// shopifyToken.generateAuthUrl('caphetau','read_products');

// const url = shopifyToken.generateAuthUrl('caphetau');
//
// console.log(url);

//https://caphetau.myshopify.com/admin/oauth/authorize?scope=read_content&state=38c472e9ad4092408aca6aac6463044d&redirect_uri=https%3A%2F%2Fdashboard.heroku.com%2Fapps%2Frugged-glacier-98858&client_id=b1a18a405f32a49a2e3752582b68a2bd
