const {Router}=require('express')
const { getAllReviews, createReview, getReviewById, deleteReview, updateReviewComments } = require('../controllers/Review.controller')

const router=Router()

router.route('/review').get(getAllReviews).post(createReview)

router.route('/review/:id').get(getReviewById).delete(deleteReview).put(updateReviewComments)

module.exports=router