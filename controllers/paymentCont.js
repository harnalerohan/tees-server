const braintree = require("braintree");


const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: "w783n52kjfnsh7zs",
  publicKey: "kgn58wh3n52cs2r7",
  privateKey: "7b1cdae9feeda5123263d2cc34f461e3"
});

exports.getToken = (req, res) => {
  gateway.clientToken.generate({
    // customerId: aCustomerId
  }, (err, response) => {
    if(err){
      res.status(500).send(err)
    }else{
      res.send(response)
    }
  });
}

exports.processPayment = (req, res) => {

  let nonceFromTheClient = req.body.paymentMethodNonce

  let amountFromTheClient = req.body.amount

  gateway.transaction.sale({
    amount: amountFromTheClient,
    paymentMethodNonce: nonceFromTheClient,
    // deviceData: deviceDataFromTheClient,
    options: {
      submitForSettlement: true
    }
  }, (err, result) => {
    if(err){
      res.status(500).send(err)
    }else{
      res.send(result)
    }
  });
}