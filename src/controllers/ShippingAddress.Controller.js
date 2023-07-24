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

const newAddress = async (req, res) => {
    try {
        const { country, state, city, address, postalCode, userId } = req.body;

        // Validar Campos
        if (!country || !state || !city || !address || !postalCode || !userId) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        const newAddress = await ShippingAddress.create({ country, state, city, address, postalCode, userId });
        return res.status(200).json(newAddress);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};


const updateAddress=async(req,res)=>{
    try {
        const {id}=req.params;
        const updateAddress=await ShippingAddress.findByPk(id)
        updateAddress.set(req.body)
        await updateAddress.save()
        return res.status(200).json(updateAddress)
    } catch (error) {
        res.status(404).json({error:error.message})
    }
}

const deleteAddress=async(req,res)=>{
    try {
        const {id}=req.params
        const address=await ShippingAddress.findByPk(id)
        await address.destroy()
        res.status(201).json({ message: 'Address deleted successfully' })
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


