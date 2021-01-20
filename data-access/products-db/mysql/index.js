let connection = require('../../../db/mysql/connection') // DB
let serialize = require('./serializer') // serializer custom to db
let makeProduct = require('../../../models/product/index'); // model

let listproducts = () => {
  return new Promise(function (resolve, reject) {
    connection.query("SELECT * FROM products", function (err, result, fields) {
      if (!err) {
        resolve(Promise.resolve(serialize(JSON.parse(JSON.stringify(result)))))
      }
      else reject(err);
    });
  });
}

let findProduct = (prop, val) => {
  return new Promise(function (resolve, reject) {
    connection.query("SELECT * FROM products WHERE productID=" + val, function (err, result, fields) {
      if (!err) {
        let getVal = {
          "productID": result[0].productID,
          "productName": result[0].productName,
          "productDescription": result[0].productDescription,
          "productType": result[0].productType,
          "productBarcode": result[0].productBarcode
        }
        resolve(Promise.resolve(serialize(JSON.parse(JSON.stringify(getVal)))))
      }
      else reject(err);
    });
  });
}

let addProduct = (productInfo) => {
  let productGet = makeProduct(productInfo)
  pName = productGet.getProductName()
  pDescription = productGet.getProductDescription()
  pType = productGet.getProductType()
  pBarcode = productGet.getProductBarcode()
  let insertQuery = "INSERT INTO products (productName,productDescription,productType,productBarcode) VALUES ('" + pName + "','" + pDescription + "','" + pType + "','" + pBarcode + "')"
  return new Promise(function (resolve, reject) {
    connection.query(insertQuery, (error, result) => {
      if (!error) {
        resolve(findProduct('productID', result.insertId))
      }
      else return error
    })
  })
}

module.exports = {
  listproducts,
  findProduct,
  addProduct
}
