const express = require('express');
const router = express.Router();

// Define routes
router.get('/change_color', (req, res) => {
  res.sendFile('/change_color.html', {root:'./static'});
});

router.get('/dig_map', (req, res) => {
  res.sendFile('/dig_map.html', {root:'./static'});
});

module.exports = router;
