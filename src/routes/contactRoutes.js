const express = require('express');
const router = express.Router();
const {
  createContactMessage,
  getContactMessages
} = require('../controllers/contactController');
router.route('/')
  .post(createContactMessage) 
  .get(getContactMessages);   

module.exports = router;