var request = require('request')
const Shopify = require('shopify-api-node');

const shopify = new Shopify({
  shopName: 'caphetau', // MYSHOP.myshopify.com
  apiKey: '17cfdde2fcd7945875e0fe6c2', // Your API key
  password: '81baa2ea778b271889789e10581e8979'
});
//

var url = 'https://17cfdde2fcd7945875e0d1acf50fe6c2:81baa2ea778b271889789e10581e8979@caphetau.myshopify.com/admin/smart_collections.json'

request({
  url: url,
  json: true
}, (err, response, body) => {
  console.log(body);
});

// shopify.smartCollection.list()
// .then(collection => console.log(collection))
// .catch(err => console.error(err));
