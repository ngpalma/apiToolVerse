const {Task,User}=require('../db')

const getAllTask=async(req,res)=>{
    try {
        const tasks =await Task.findAll({
            where:{
                userId: req.user.id
            },
            include:{
                model: User
            }
        })
        res.status(200).json(tasks)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

const getTask=async(req,res)=>{
    const {id}=req.params
    try {
        const tasks = await Task.findOne({
            where:{
                id
            },
            include:{
              model:User
            }
        })
        res.json(tasks)
    } catch (error) {
       res.status(500).json({error: error.message}) 
    }
}

const createTask=async(req,res)=>{
    const {title}=req.body
    try {
        const tasks = await Task.create({title,userId:req.user.id})
        const taskSaved=await tasks.save()
        res.json({
           title:taskSaved.title,
        })
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
const updateTask=async(req,res)=>{
    try {
        const tasks = await Task.findByPk(req.params.id)
        tasks.set(req.body)
        await tasks.save()
        res.json(tasks)
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

const deleteTask=async(req,res)=>{
    try {
        const tasks = await Task.findByPk(req.params.id)
        await tasks.detroy()
        res.json({sucess:true})
    } catch (error) {
        res.status(500).json({error:error.message})        
    }
}


module.exports={
    getAllTask,
    getTask,
    createTask,
    deleteTask,
    updateTask
}