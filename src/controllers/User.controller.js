const { User, PurchaseCart, PurchaseOrder,ShippingAddress,Review } = require("../db");
const {Op} = require("sequelize");

const newPage=(req,res)=>{
  res.render('registrations/new')
}

const getAllUsers = async (req, res) => {
  try {
    const user = await User.findAll({
      include: [
        {
          model: PurchaseCart,
        },
        { model: PurchaseOrder },
        { model: ShippingAddress },
        { model: Review },
      ],
    });
    return res.json(user);
  } catch (error) {
    res.status(404).json({ error:error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({
        where: {
            id
        },
        include: [
            {
              model: PurchaseCart,
            },
            { model: PurchaseOrder },
            { model: ShippingAddress },
            { model: Review },
          ]
    });
    res.json(user);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const getUserByName = async (req, res) => {
  try {
    const { firstName } = req.query;
    const user = await User.findAll({
      where: {
        firstName: {
          [Op.iLike]: `%${firstName}%`
        }
      },
    });
    if(!user.length) throw new Error('The user does not exist');
    res.json(user);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const newUser = async (req, res) => {
  try {
    const { email, password, firstName, lastName, role, phone } = req.body;
    Object.keys(req.body).forEach(key=>{
      if(!req.body[key]){
        throw new Error(`Empty ${key} field`)
      }
    })
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      role,
      phone,
    });
    res.json(user);
  } catch (error) {
    res.status(404).json(error.message);
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    user.set(req.body);
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    await user.destroy();
    res.json({ success: true });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  getUserByName,
  newUser,
  updateUser,
  deleteUser,
  newPage
};
