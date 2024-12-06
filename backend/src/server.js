require('dotenv').config();
const express = require('express');
const app = express();
const router = express.Router();
const cors = require('cors');

app.use(cors({
    origin: '*', // Allow only your frontend origin
    methods: 'GET,POST,PUT,DELETE', // Specify allowed HTTP methods
    credentials: true, // Include cookies if required
}));


app.use(express.json())
const { models,sequelize, initializeDatabase } = require('./models');
app.set('models', models)
const cors = require('cors');
app.use(cors());



app.use(cors({
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
}));


//importing routesd
require('./routes/routes')(app,router)
const businessRoutes = require('./routes/business_owner_routes')
const userRoutes = require('./routes/users')
const adminRoutes = require('./routes/admin')
app.use('/',router);

app.use('/business-owner', businessRoutes)
app.use('/users', userRoutes)
app.use('/admin', adminRoutes)
app.use
app.get('/health',(req,res)=>{
    res.send({"msg": "Applicaiton is working !!" ,  "date" : `${new Date()}`})
})
const multer = require('multer');

const storage = multer.memoryStorage(); // Store files in memory as buffer
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});
app.use(multer)
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
app.listen(process.env.PORT || 3000, '0.0.0.0',() => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
