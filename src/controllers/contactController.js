const Contact = require('../models/contactModel');

exports.createContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Please fill in all fields' });
    }

    const newContact = await Contact.create({
      name,
      email,
      message
    });

    res.status(201).json({
      message: "Message sent successfully"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getContactMessages = async (req, res) => {
  try {
    const messages = await Contact.find({}).sort({ createdAt: -1 });
    
    res.status(200).json({
      messages: messages.map(msg => ({
        id: msg._id,
        name: msg.name,
        email: msg.email,
        message: msg.message,
        createdAt: msg.createdAt.toISOString().split('T')[0]
      }))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};