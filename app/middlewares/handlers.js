// Modules and dependencies
const fs = require('fs');
const path = require('path');

// Constants
const ERROR_PAGE = 'Error on loading index page.';

exports.handleSocket = () => {

}

exports.handlePage = (req, res) => {
  fs.readFile(
    './app/views/index.html',
    (err, data) => {
      if (err) {
        res.writeHead(500);
        return res.end(ERROR_PAGE);
      }

      res.writeHead(200, {
        "Content-Type": "text/html"
      });
      res.end(data);
    });
}