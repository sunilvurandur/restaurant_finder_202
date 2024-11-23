require('dotenv').config();
const express = require('express');
const app = express();
const router = express.Router();
app.use(express.json())
const { models,sequelize, initializeDatabase } = require('./models');
app.set('models', models)




//importing routesd
require('./routes/routes')(app,router)
const businessRoutes = require('./routes/business_owner_routes')

app.use('/',router);
app.use('/bussiness_owner', businessRoutes)
app.get('/health',(req,res)=>{
    res.send({"msg": "Applicaiton is working !!" ,  "date" : `${new Date()}`})
})

// Sync the database and start the server
const startServer = async () => {
    try {
        await initializeDatabase(); // Ensure DB is connected
        await sequelize.sync();    // Synchronize models
        console.log('Database models synchronized.');
    } catch (error) {
        console.error('Unable to start the server:', error.message);
    }
};

startServer();
// running the server
app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
