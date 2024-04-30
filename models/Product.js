import mongoose, { model, Schema, models } from "mongoose";

const ProductSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  fullDescription: {
    type: String,
    required: true,
  },
  cardImage: {
    type: String,
    required: true,
  },
  categories: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Category'
    }
  ],
  price: {
    type: Number,
    required: true
  },
  discountedPrice: {
    type: Number,
    default: ""
  },
  hasDiscount: {
    type: Boolean,
    default: false, // Default value is false (no discount)
  },
}, {
  timestamps: true,
});

export const Product = models.Product || model('Product', ProductSchema);