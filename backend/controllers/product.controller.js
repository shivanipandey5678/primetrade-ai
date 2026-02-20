import { Product } from "../models/Product.js";

//create product

const addProduct = async(req,res) => {
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
     return res.status(201).json({message:"product is created successfully",product});
    } catch (error) {
        return res
      .status(500)
      .json({ message: "something went wrong ", error: error.message });
    }

}

//delete product
const deleteProduct = async (req,res)=> {
    try {
         const {id} = req.body;
         if (!id) return res.status(400).json({ message: "Product ID is required" });
        const isProductDeleted = await Product.findByIdAndDelete(id);
    
    if (!isProductDeleted) {
      return res.status(404).json({ message: "issue in del the product " });
    }
    return res.status(200).json({message:'product deleted successfully'})
    
    } catch (error) {
        return res
      .status(500)
      .json({ message: "something went wrong ", error: error.message });
    }
}




const updateProduct = async (req,res)=> {
    try {
         const {id , title , description , price , image} = req.body;
          if (!id) return res.status(400).json({ message: "Product ID is required" });
           if (title && title.trim()==="") {
      return res.status(400).json({ message: "Title are required" });
    }

        if (description && description.trim()==="") {
      return res.status(400).json({ message: "description are required" });
    }
    if (price !== undefined && (typeof price !== "number" || price < 0)) {
      return res.status(400).json({ message: "Price must be a non-negative number" });
    }

      const updatedProduct = {}
      if(title) updatedProduct.title= title;
      if(description) updatedProduct.description= description;
      if(price !== undefined) updatedProduct.price= price;
      if(image !== undefined) updatedProduct.image= image;


        const isProductupdated = await Product.findByIdAndUpdate(id ,updatedProduct , {new:true, runValidators:true});
        if(!isProductupdated){
              
        }
    if (!isProductupdated) {
      return res.status(404).json({ message: "issue in updating the product " });
    }
    return res.status(200).json({message:'product updated successfully'})
    
    } catch (error) {
        return res
      .status(500)
      .json({ message: "something went wrong ", error: error.message });
    }
}


//get products
const getProducts = async(req,res) => {
    try {
        const products = await Product.find().sort({createdAt: -1})
         return res.status(200).json({ message: "Products fetched successfully", products });
    } catch (error) {
        return res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
    }



export {addProduct, deleteProduct, updateProduct, getProducts}
