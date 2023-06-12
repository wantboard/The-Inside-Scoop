const express = require('express');
const helmet = require('helmet');
const path = require('path');
const app = express();

// Add helmet middleware for security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"], // Allows inline styles
      scriptSrc: ["'self'", "'unsafe-inline'"], // Allows inline scripts
      imgSrc: ["'self'", "data:", "https://images.example.com"],
      // Add other sources you want to allow
    },
  },
}));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Server listening on ${port}`);

