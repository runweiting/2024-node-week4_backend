const {
  handleResponse,
  handleAppError,
} = require('../middlewares/handleResponses');
const Order = require('../models/ordersModel');
const User = require('../models/usersModel');

const orders = {
  async createOrder(req, res, next) {
    const { userId, amt, itemDesc } = req.body;
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return handleAppError(404, '用戶不存在', next);
    }
    const targetOrder = await Order.create({
      user: userId,
      amt,
      itemDesc,
    });
    handleResponse(res, 201, '新增成功', targetOrder._id);
  },
};

module.exports = orders;
