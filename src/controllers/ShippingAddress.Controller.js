const {ShippingAddress,User}=require('../db')

const getAllAddress=async(req,res)=>{
    try {
        const address = await ShippingAddress.findAll({
            include:[{model:User}]
        })
        res.json(address)
    } catch (error) {
        res.status(404).json({error:error.message})
    }
}

const getAddressById=async(req,res)=>{
    try {
        const address = await ShippingAddress.findByPk(req.params.id)
        res.json(address)
    } catch (error) {
        res.status(404).json({error:error.message})
    }
}

const newAddress =async(req,res)=>{
    try {
        const {country,state,city,address,postalCode,userId}=req.body
        const newAddress = await ShippingAddress.create({country,state,city,address,postalCode,userId})
        res.json(newAddress)
    } catch (error) {
        res.status(404).json({error:error.message})
    }
}

const updateAddress=async(req,res)=>{
    try {
        const updateAddress=await ShippingAddress.findByPk(id)
        updateAddress.set(req.body)
        await updateAddress.save()
        res.json(updateAddress)
    } catch (error) {
        res.status(404).json({error:error.message})
    }
}

const deleteAddress=async(req,res)=>{
    try {
        const {id}=req.params
        const address=await ShippingAddress.findByPk(id)
        await address.destroy()
        res.json({success:true})
    } catch (error) {
        res.status(404).json({error:error.message})
    }
}


module.exports={
    getAllAddress,
    getAddressById,
    newAddress,
    updateAddress,
    deleteAddress
}


