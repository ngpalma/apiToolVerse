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


const createReview = async (req, res) => {
    try {
      const { userId, productId, score, comments } = req.body;
  
      // Verificar si los comentarios exceden los 150 caracteres
      if (comments && comments.length > 150) {
        return res.status(400).json({ error: "comments 150 max permitted" });
      }
  
      // Crear la revisión si pasa la validación
      const review = await Review.create({
        userId,
        productId,
        score,
        comments,
      });
  
      return res.status(201).json(review);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

const deleteReview=async(req,res)=>{
    try {
        const review=await Review.destroy({
            where:{
                id:req.params.id
            }
        })
        res.status(200).json({message:'Review successfully removed'})
    } catch (error) {
        res.status(404).json({error: error.message})
    }
}

const updateReviewComments = async (req, res) => {
    try {
      const reviewId = req.params.id;
      const { comments } = req.body;
  
      // Verificar si los comentarios exceden los 150 caracteres
      if (comments && comments.length > 150) {
        return res.status(400).json({ error: "comments 150 max permitted" });
      }
  
      // Buscar la revisión por su ID
      const review = await Review.findByPk(reviewId);
  
      // Verificar si se encontró la revisión
      if (!review) {
        return res.status(404).json({ error: "Review not found" });
      }
  
      // Actualizar solo los comentarios
      review.comments = comments;
      await review.save();
  
      return res.status(200).json({ message: 'Review comments successfully updated' });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

module.exports={
    getAllReviews,
    getReviewById,
    createReview,
    deleteReview,
    updateReviewComments
}