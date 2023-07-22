const {Review}=require('../db')


const getAllReviews =async(req,res)=>{
    try {
        const review=await Review.findAll()
        res.json(review)
    } catch (error) {
        res.status(404).json({error: error.message})
    }
}

const getReviewById=async(req,res)=>{
    try {
        const review=await Review.findByPk(req.params.id)
        res.json(review)
    } catch (error) {
        res.status(404).json({error: error.message})
    }
}


const createReview=async(req,res)=>{
    try {
        const {score,userId,productId}=req.body;

        const [review, created] = await Review.findOrCreate({
            where: { score },
            defaults: { score,userId,productId }
          });
        res.json(review)
    } catch (error) {
        res.status(404).json({error: error.message})
    }
}

const deleteReview=async(req,res)=>{
    try {
        const review=await Review.destroy({
            where:{
                id:req.params.id
            }
        })
        res.json(review)
    } catch (error) {
        res.status(404).json({error: error.message})
    }
}

module.exports={
    getAllReviews,
    getReviewById,
    createReview,
    deleteReview
}