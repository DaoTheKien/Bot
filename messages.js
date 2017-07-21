var _ = require('lodash');

// const ShopifyBuy = require('shopify-buy');
// const Shopify = require('shopify-api-node');
//
// const shopify = new Shopify({
//    shopName: 'caphetau',
//    apiKey: '17cfdde2fcd7945875e0d1acf50fe6c2',
//    password: '81baa2ea778b271889789e10581e8979'
// });
//
//
// var shopClient = ShopifyBuy.buildClient({
//   accessToken: '87269e2bcb8744b47909f3d55a05defc',
//   domain: 'caphetau.myshopify.com',
//   appId: '6'
// });
//
// function buy(callback) {
//    shopClient.fetchProduct('5946846277')
//       .then(function (product) {
//          var variant = product.variants[0];
//          var quantity = 1;
//          var checkoutURL = variant.checkoutUrl(quantity);
//          callback(checkoutURL);
//       })
//       .catch(err => console.error(err));
// };
//
//
// function getLink(link) {
//    shopify.product.list({ids: '5946846277'})
//    .then(variant => {
//          // console.log(JSON.stringify(variant, undefined, 2));
//       display(variant, undefined, link);
//    })
//    .catch(err => console.error(err));
// };


var message1 = 'VAPE Tẩu Điện Tử xin chào!';
var message2 = 'Shop là nơi uy tín hàng đầu dành cho vaper tại Việt nam với nguyên tắc \"Nói không với clone!\"';
var message3 = 'Đây là một số VAPE & tinh dầu mới về tại shop. Xin mời bạn xem qua nhé';

var info = 'Bạn cần được tư vấn? Hãy bắt đầu chat ngay tại đây hoặc gọi số 0981.654.090 để gặp tư vấn viên nhiệt tình của cửa hàng 🏪 \n\nBạn có thể đăng ký tài khoản tại webiste khi thanh toán để được tự động cập nhật đơn hàng & tình trạng vận chuyển qua Facebook.';

var messageOption = {
   "type":"template",
   "payload":{
      "template_type":"button",
      "text":"Bắt đầu chat với chúng tôi hoặc lựa chọn các menu tư vấn nhanh dưới đây",
      "buttons":[
         {
            "type":"postback",
            "title":"Mua sắm",
            "payload":"SHOPPING_INFO_PAYLOAD"
         },
         {
            "title":"Hotline",
            "type":"phone_number",
            "payload":"+83908666651",
         },
         {
            "title":"Bắt đầu chat",
            "type":"postback",
            "payload":"CHAT_PAYLOAD"
         }
      ]
   }
};

var messageData = {
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
};

//Helper functions
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

function addCollection(input) {
   var elements = [];
   var images = getImage(input);
   for (i = 0; i < 3; i++) {
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

function addProduct(input) {
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
                  "type": "web_url",
                  "url": `https://www.taudientu.com/products/${input[i].handle}`,
                  "title": "Xem chi tiết"
               },
               {
                  "type": "postback",
                  "payload": `P${input[i].id}`,
                  "title": `Chọn ${input[i].options[0].name.toLowerCase()}`
               }
            ]
         };
         elements.push(element);
      }
   }

   return elements;
};

function addProductVariant(input, url) {
   var elements = [];
   var images = getImage(input);
   for (i = 0; i < 10; i++) {
      if (_.isEmpty(input[i])) { break; }
      else {
         var element = {
            "title": input[i].title,
            "subtitle": `${parseInt(input[i].price).toLocaleString()}đ`,
            "image_url": images[i],
            "buttons": [
               {
                  "type": "element_share"
               },
               {
                  "type": "web_url",
                  "url" : url[i],
                  "title": "Đặt hàng"
               }
            ]
         };
         elements.push(element);
      }
   }
   return elements;
};


function display(source, argv, url) {
   function addedElements(argv) {
      if (argv) {
         switch (argv) {
            case "C":
            return addCollection(source);
            case "P":
            return addProduct(source);
            default:
            break;
         }
      }
      else {
         return addProductVariant(source, url);
      }
   };
   var addedElements = addedElements(argv);

   function quick_replies(array) {
      if (array.length > 3) { return [
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

   // console.log(JSON.stringify(data, undefined, 2));
   return data;
};


module.exports = {
   message1,
   message2,
   message3,
   messageOption,
   messageData,
   info,
   getImage,
   addCollection,
   display,
   addProduct,
   addProductVariant
}
