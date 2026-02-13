import { Task } from "../models/Tasks.js";

//create task

const addTask = async(req,res) => {
    try {
        let { title, description, status, user } = req.body;

    if (!title || !description || !user) {
      return res.status(400).json({ message: "Title, description, and user are required" });
    }
    if (
      title.trim() === "" ||
      description.trim() === "" 
      
    ) {
      return res.status(400).json({ message: "Title and description cannot be empty" });
    }

    const validStatus = ["pending" , "in-progress" ,"completed"];
    if(status && !validStatus.includes(status)){
         return res.status(400).json({ message: `Status must be one of: ${validStatus.join(", ")}` });
    }

    const task = await Task.create({
          title,
      description,
      status: status || "pending",
      user,
    });
     return res.status(201).json({message:"task is created successfully",task});
    } catch (error) {
        return res
      .status(500)
      .json({ message: "something went wrong ", error: error.message });
    }

}

//delete task
const deleteTask = async (req,res)=> {
    try {
         const {id} = req.body;
        const isTaskDeleted = await Task.findByIdAndDelete(id);
    if (!isTaskDeleted) {
      return res.status(404).json({ message: "issue in del the task " });
    }
    return res.status(200).json({message:'task deleted successfully'})
    
    } catch (error) {
        return res
      .status(500)
      .json({ message: "something went wrong ", error: error.message });
    }
}




const updateTask = async (req,res)=> {
    try {
         const {id , title , description , status} = req.body;
          if (!id) return res.status(400).json({ message: "Task ID is required" });
           if (title && title.trim()==="") {
      return res.status(400).json({ message: "Title are required" });
    }

        if (description && description.trim()==="") {
      return res.status(400).json({ message: "description are required" });
    }

      const validStatus = ["pending", "in-progress", "completed"];
      if(status && !validStatus.includes(status)){
          return res.status(400).json({ message:  `must be from ${validStatus.join(',')}`});

      }
      const updatedTask = {}
      if(title) updatedTask.title= title;
      if(description) updatedTask.description= description;
      if(status) updatedTask.status= status;


        const isTaskupdated = await Task.findByIdAndUpdate(id ,updatedTask , {new:true, runValidators:true});
        if(!isTaskupdated){
              
        }
    if (!isTaskupdated) {
      return res.status(404).json({ message: "issue in updating the task " });
    }
    return res.status(200).json({message:'task updated successfully'})
    
    } catch (error) {
        return res
      .status(500)
      .json({ message: "something went wrong ", error: error.message });
    }
}


//get tasks
const getTasks = async(req,res) => {
    try {
        const {user , status} = req.query;
        const filter = {};
        if(user) filter.user = user;
        if(status) {
             const validStatus = ["pending", "in-progress", "completed"];
              if (!validStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: `Status must be one of: ${validStatus.join(", ")}` });
      }
        
      filter.status = status;
        }
        const tasks = await Task.find(filter).sort({createdAt: -1})
         return res.status(200).json({ message: "Tasks fetched successfully", tasks });
    } catch (error) {
        return res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
    }



export {addTask, deleteTask, updateTask, getTasks} 