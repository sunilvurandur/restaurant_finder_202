require('dotenv').config();
const express = require('express');
const app = express();
const router = express.Router();
app.use(express.json())
const { sequelize } = require('./models');


// Sync the database and start the server
const startServer = async () => {
    try {
        await sequelize.sync(); // Ensure all models are synced
    } catch (error) {
        console.error('Unable to start the server:', error);
    }
};

startServer();

//importing routes
require('./routes/routes')(app,router)
app.use('/',router);
app.get('/health',(req,res)=>{
    res.send({"msg": "Applicaiton is working !!" ,  "date" : `${new Date()}`})
})

// running the server
app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
