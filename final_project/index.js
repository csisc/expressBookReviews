const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).send("Access Denied: No Token Provided!");
    }
    
    try {
        const verified = jwt.verify(token, "your_jwt_secret"); // Replace "your_jwt_secret" with your actual secret
        req.user = verified; // Add user info to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        return res.status(400).send("Invalid Token");
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
