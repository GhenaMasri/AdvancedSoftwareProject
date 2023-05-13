const express = require("express");
const router = express.Router();
const { upload, con} = require("../config/myConn");
const jwt = require('jsonwebtoken');


router.post('/login', (req, res) => {

    const { name , password } = req.body; 

    //const name = req.body.name;
    //const password = req.body.password;

    const secretKey = '1234';

    // Find the user in the database
    const query = 'SELECT * FROM users WHERE name = ?';
    con.query(query, [name], (err, results) => {
      if (err) {
        console.error('Error executing query', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
  
      // Check if the user exists
      if (results.length === 0) {
        res.status(401).json({ error: 'Invalid username or password' }); // invalid username 
        return;
      }
  
      const user = results[0];
  
      // Compare the provided password with the password in the database
      if (password != user.password) {
        res.status(401).json({ error: 'Invalid username or password' }); // invalid password 
        return;
      }
  
      // Create a JWT token
      const token = jwt.sign({ id: user.id, username: user.name }, secretKey);
  
      // Send the token back to the client
      res.json({ token });
    });
  });
  
  module.exports = router;