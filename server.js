require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Stripe = require('stripe');

// Utilise la clé secrète depuis .env
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(cors());
app.use(express.json());

// Route pour créer une session Stripe Checkout
app.post('/create-checkout-session', async(req, res) => {
    try {
        const { amount, currency } = req.body;

        // Stripe demande le montant en centimes
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: currency || 'eur',
                    product_data: {
                        name: 'Commande Alien 👽',
                    },
                    unit_amount: Math.round(Number(amount) * 100), // Convertit en centimes
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: 'http://localhost:3000/index.html?success=true',
            cancel_url: 'http://localhost:3000/payment.html?canceled=true',
        });

        res.json({ id: session.id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur Stripe' });
    }
});

// Lance le serveur sur le port 4242
app.listen(4242, () => console.log('Serveur Stripe en écoute sur http://localhost:4242'));