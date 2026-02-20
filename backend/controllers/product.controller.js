import { Product } from "../models/Product.js";
import { User } from "../models/Users.js";

//create product

const addProduct = async (req, res) => {
    try {
        let { title, price, description, image } = req.body;

        if (!title || !description || price === undefined) {
            return res.status(400).json({ message: "Title, description, and price are required" });
        }
        if (
            title.trim() === "" ||
            description.trim() === ""

        ) {
            return res.status(400).json({ message: "Title and description cannot be empty" });
        }
        if (typeof price !== "number" || price < 0) {
            return res.status(400).json({ message: "Price must be a non-negative number" });
        }

        const product = await Product.create({
            title,
            description,
            price,
            image: image || "",
        });
        return res.status(201).json({ message: "product is created successfully", product });
    } catch (error) {
        return res
            .status(500)
            .json({ message: "something went wrong ", error: error.message });
    }

}

//delete product
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) return res.status(400).json({ message: "Product ID is required" });
        const isProductDeleted = await Product.findByIdAndDelete(id);

        if (!isProductDeleted) {
            return res.status(404).json({ message: "issue in del the product " });
        }
        return res.status(200).json({ message: 'product deleted successfully' })

    } catch (error) {
        return res
            .status(500)
            .json({ message: "something went wrong ", error: error.message });
    }
}




const updateProduct = async (req, res) => {
    try {
        const { id, title, description, price, image } = req.body;
        if (!id) return res.status(400).json({ message: "Product ID is required" });
        if (title && title.trim() === "") {
            return res.status(400).json({ message: "Title are required" });
        }

        if (description && description.trim() === "") {
            return res.status(400).json({ message: "description are required" });
        }
        if (price !== undefined && (typeof price !== "number" || price < 0)) {
            return res.status(400).json({ message: "Price must be a non-negative number" });
        }

        const updatedProduct = {}
        if (title) updatedProduct.title = title;
        if (description) updatedProduct.description = description;
        if (price !== undefined) updatedProduct.price = price;
        if (image !== undefined) updatedProduct.image = image;


        const isProductupdated = await Product.findByIdAndUpdate(id, updatedProduct, { new: true, runValidators: true });
        if (!isProductupdated) {

        }
        if (!isProductupdated) {
            return res.status(404).json({ message: "issue in updating the product " });
        }
        return res.status(200).json({ message: 'product updated successfully' })

    } catch (error) {
        return res
            .status(500)
            .json({ message: "something went wrong ", error: error.message });
    }
}


//get products
const getProducts = async (req, res) => {
    try {

        const { search, page, limit } = req.query;
        const pageNum = Math.max(1, (parseInt(page, 10) || 1));
        const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 5))

        const filter = {};
        if (search && search.trim() !== "") {
            filter.$or = [
                { title: { $regex: search.trim(), $options: 'i' } },
                { description: { $regex: search.trim(), $options: 'i' } }
            ];
        }

        const skip = (pageNum - 1) * limitNum;
        const products = await Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum);

        const total = await Product.countDocuments(filter);
        return res.status(200).json({ message: "Products fetched successfully", products, total, page: pageNum, limit: limitNum });
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Something went wrong", error: error.message });
    }
}


//getting single product details
const getSingleProduct = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: "Product ID is required" });
        const isProductExist = await Product.findById(id);

        if (!isProductExist) {
            return res.status(404).json({ message: " product not found!" });
        }
        return res.status(200).json({ message: 'product fetched successfully', product: isProductExist })
    } catch (error) {
        return res
            .status(500)
            .json({ message: "something went wrong ", error: error.message });
    }
};

// add product to user favorites (requires auth)
const addFavoriteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const userId = req.user.id;
        if (!productId || !userId) return res.status(400).json({ message: "Product ID and User ID are required" });
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "product not found!" });
        const updatedUser = await User.findByIdAndUpdate(userId, { $addToSet: { favorites: productId } }, { new: true });
        return res.status(200).json({
            message: "Added to favorites",
            favorites: updatedUser.favorites
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};

// remove product from user favorites (requires auth)
const removeFavoriteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const userId = req.user.id;
        if (!productId || !userId) return res.status(400).json({ message: "Product ID and User ID are required" });
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $pull: { favorites: productId } },
            { new: true }
        );
        if (!updatedUser) return res.status(404).json({ message: "User not found" });
        return res.status(200).json({
            message: "Removed from favorites",
            favorites: updatedUser.favorites
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};

export { addProduct, deleteProduct, updateProduct, getProducts, getSingleProduct, addFavoriteProduct, removeFavoriteProduct }
