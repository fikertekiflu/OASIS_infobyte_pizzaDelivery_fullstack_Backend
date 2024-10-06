const express = require('express');
const stripe = require('stripe')('your-secret-key-here');
const app = express();

app.use(express.json());

app.post('/create-payment-intent', async (req, res) => {
  try {
    const { paymentMethodId, amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
    });

    res.json({ success: true, paymentIntent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


