const express = require('express');
const cors = require('cors');
require('dotenv').config();

// ⚠️ Remplacez par votre clé secrète Stripe
const stripe = require('stripe')('sk_live_VOTRE_CLE_SECRETE_ICI');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Route pour créer un PaymentIntent
app.post('/create-payment-intent', async (req, res) => {
    try {
        const { amount, currency = 'eur' } = req.body;
        
        console.log(`💰 Création PaymentIntent: ${amount}€`);
        
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Stripe utilise les centimes
            currency: currency,
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                store: 'alien-store',
                timestamp: new Date().toISOString()
            }
        });

        res.send({
            clientSecret: paymentIntent.client_secret
        });
    } catch (error) {
        console.error('❌ Erreur Stripe:', error);
        res.status(400).send({
            error: {
                message: error.message
            }
        });
    }
});

// Route de test
app.get('/test', (req, res) => {
    res.json({ 
        message: '✅ Backend Stripe opérationnel !',
        timestamp: new Date().toISOString(),
        port: PORT
    });
});

// Route racine
app.get('/', (req, res) => {
    res.json({ 
        message: '🚀 Serveur Alien Store démarré !',
        endpoints: {
            test: '/test',
            payment: '/create-payment-intent'
        }
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Serveur Stripe démarré sur http://localhost:${PORT}`);
    console.log(`🧪 Test: http://localhost:${PORT}/test`);
    console.log(`💳 Paiements: http://localhost:${PORT}/create-payment-intent`);
});