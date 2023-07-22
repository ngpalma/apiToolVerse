const {Router}=require('express')
const { getAllTask, getTask, createTask, updateTask, deleteTask } = require('../controllers/tasks.controller')
const { authRequired } = require('../middlewares/validateToken')

const router=Router()

router.get('/task',authRequired,getAllTask)
router.get('/task/:id',authRequired,getTask)
router.post('/task',authRequired,createTask)
router.put('/task',authRequired,updateTask)
router.delete('/task/:id',authRequired,deleteTask)

module.exports = router