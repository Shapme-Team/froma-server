import axios from 'axios'
import express, { Request, response } from 'express'

const router = express.Router()

router.post('/initiateTransaction', async (req: Request, res) => {
  const appId = process.env.APP_ID
  const appSecret = process.env.SECRET_ID
  const sandboxUrl = 'https://sandbox.cashfree.com/pg/orders'
  const headers = {
    'Content-Type': 'application/json',
    'x-api-version': '2021-05-21',
    'x-client-id': appId,
    'x-client-secret': appSecret,
  }

  console.log('req body : ', req.body)


  const customerData = {
    order_id: req.body.orderId,
    order_amount: req.body.amount,
    order_currency: 'INR',
    customer_details: {
      customer_id: req.body.customerId,
      customer_email: req.body.customerEmail,
      customer_phone: req.body.cusotmerPhoneNumber,
    },
    order_meta: {
      return_url: req.body.returnUrl,
    },
  }
  const response = await axios.post(sandboxUrl, customerData, {
    headers,
  })
  console.log('cashfree response : ', response)
  res.json(response.data)
})

router.get('/verifyPayment', async (req: Request, res) => {
  try {
    
  const orderId = req.query.orderId
  const appId = process.env.APP_ID
  const appSecret = process.env.SECRET_ID
  const sandboxUrl = 'https://sandbox.cashfree.com/pg/orders/' + orderId
  const reqHeader = {
    'Content-Type': 'application/json',
    'x-api-version': '2021-05-21',
    'x-client-id': appId,
    'x-client-secret': appSecret,
  }
  const response = await axios.get(sandboxUrl, {
    headers:reqHeader
  })
  console.log('response is : ',response)
  res.json(response.data)
} catch (error) {
 console.log('error on verifing payment request : ',error)   
 res.status(404).send({
   error,
   message:"server error !"
 })
}
})

export = router
