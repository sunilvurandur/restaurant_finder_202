const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

class businessOwnerHandler{
    constructor(){}
    async register(req, res){
        const { name, email, password, phone } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required.' });
          }
          try {
            // Check if the email is already registered
            const existingOwner = await req.app.get('models')['business_owners'].findOne({ where: { email } });
            if (existingOwner) {
              return res.status(409).json({ error: 'Email is already registered.' });
            }
        
            // Hash the password
            const saltRounds = 10;
            const passwordHash = await bcrypt.hash(password, saltRounds);
        
            // Create a new BusinessOwner
            const newOwner = await req.app.get('models')['business_owners'].create({
              name,
              email,
              password: passwordHash,
              phone
            });
        
            return res.status(201).json({
              message: 'Business owner registered successfully.',
              data: { id: newOwner.id, name: newOwner.name, email: newOwner.email },
            });
          } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error.' });
          }
    }

    async login(req, res){
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        try {
            // Find the business owner by email
            let BusinessOwner = req.app.get('models')['business_owners']
            const owner = await BusinessOwner.findOne({ where: { email } });
            if (!owner) {
            return res.status(404).json({ error: 'Invalid email or password.' });
            }

            // Compare the password with the stored hash
            const isPasswordValid = await bcrypt.compare(password, owner.password);
            if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password.' });
            }

            // Generate a JWT token
            const token = jwt.sign(
            { id: owner.owner_id, email: owner.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
            );

            return res.status(200).json({
            message: 'Login successful.',
            token,
            owner: { id: owner.owner_id, name: owner.name, email: owner.email },
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    }
}

module.exports = businessOwnerHandler;