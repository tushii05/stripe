const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const stripe = require('stripe')('sk_test_51JNDQmSDpWVjcbNTul6WAYaoUdXYq8zyinV0NgVpeOqwjNmKAi0DRDKqdzOt44qxKOhEbuDYUyQcN4KbLoN0QjDS00kqtVzSeM');
// require('dotenv').config();
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

// enable CORS
router.use(cors());
// parse application/json
router.use(bodyParser.json());
// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: true }));

// confirm the paymentIntent
router.post('/pay', async (request, response) => {
    try {
        // Create the PaymentIntent
        let intent = await stripe.paymentIntents.create({
            payment_method: request.body.payment_method_id,
            description: 'Test payment',
            amount: request.body.amount * 100,
            currency: 'inr',
            confirmation_method: 'manual',
            confirm: true,
        });
        // Send the response to the client
        response.send(generateResponse(intent));
    } catch (e) {
        // Display error on client
        return response.send({ error: e.message });
    }
});

const generateResponse = (intent) => {
    if (intent.status === 'succeeded') {
        // The payment didn’t need any additional actions and completed!
        // Handle post-payment fulfillment
        return {
            success: true,
        };
    } else {
        // Invalid status
        return {
            error: 'Invalid PaymentIntent status',
        };
    }
};

// request handlers
router.get('/', (req, res) => {
    res.send('Stripe Integration! - Clue Mediator');
});

module.exports = router;
