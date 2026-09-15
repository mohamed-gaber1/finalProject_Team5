const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/productModel'); 

dotenv.config();

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('DB Connected for Seeding...'))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

const sampleProducts = [
  {
    title: "Wireless Bluetooth Headphones",
    description: "High quality sound with active noise cancellation and long battery life.",
    price: 1200,
    stock: 15,
    category: "Electronics",
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e"]
  },
  {
    title: "Smart Watch Series 5",
    description: "Track your fitness, heart rate, and notifications on the go.",
    price: 2500,
    stock: 10,
    category: "Electronics",
    images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30"]
  },
  {
    title: "Classic Casual Sneakers",
    description: "Comfortable everyday wear sneakers made with breathable material.",
    price: 650,
    stock: 25,
    category: "Fashion",
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff"]
  }
];

const importData = async () => {
  try {
    await Product.deleteMany(); 
    await Product.insertMany(sampleProducts);
    console.log('Data Imported Successfully! ');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();