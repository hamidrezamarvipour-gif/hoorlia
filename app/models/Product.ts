import mongoose, { Schema, models } from "mongoose";

const ProductSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  enName: { type: String },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  size: { type: String },
  price: { type: Number, required: true },
  oldPrice: { type: Number },
  discount: { type: Number },
  image: { type: String },
  galleryImages: [{ type: String }],
  colors: [{ type: String }],
  description: { type: String },
  features: { type: String },
  specs: {
    skinType: String,
    concern: String,
    targetArea: String,
    texture: String,
    ingredients: String,
    brandOrigin: String,
    ageRange: String,
  },
  rating: { type: Number, default: 4.8 },
  inStock: { type: Boolean, default: true },
}, { timestamps: true });

const Product = models.Product || mongoose.model("Product", ProductSchema);
export default Product;