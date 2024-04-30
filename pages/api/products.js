import { Product } from "@/models/Product";
import { Category } from "@/models/Category";
import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "@/pages/api/auth/[...nextauth]";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();

  if (method === 'GET') {
    if (req.query?.category) {
      const categoryQuery = req.query.category; // Assuming the category name is passed as a query parameter

      // Find the category by its name (if it exists)
      const category = await Category.findOne({ name: categoryQuery });
      if (category) {
        // If the category exists, filter products by that category
        const filter = { categories: category._id };
        const products = await Product.find(filter).populate('categories');
        res.json(products);
      } else {
        // Handle the case where the specified category doesn't exist
        res.status(404).json({ error: 'Category not found' });
      }
    } else {
      // If no category name is specified, return all products
      const products = await Product.find().populate("categories");
      res.json(products);
    }
  }


  if (method === 'POST') {
    const { title, fullDescription, categories, cardImage, price, discountedPrice, hasDiscount } = req.body;

    const productDoc = await Product.create({
      title, fullDescription, categories, cardImage, price, discountedPrice, hasDiscount
    });
    res.json(productDoc);
  }

  if (method === 'PUT') {
    const { title, fullDescription, categories, cardImage, price, discountedPrice, hasDiscount, _id } = req.body;

    await Product.updateOne({ _id }, { title, fullDescription, categories, cardImage, price, discountedPrice, hasDiscount });
    res.json(true);
  }

  if (method === 'DELETE') {
    if (req.query?.id) {
      await Product.deleteOne({ _id: req.query?.id });
      res.json(true);
    }
  }
}