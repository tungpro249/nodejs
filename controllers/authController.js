const { CREATED } = require("../utils/successResponse");
const authService = require('../services/authService');

class AuthController {
    // 1. Đăng ký tài khoản mới (Register)
    register = async (req, res) => {
        const { name, email, password } = req.body;
        const newUser = await authService.register({ name, email, password });
        new CREATED({
            message: 'Đăng ký tài khoản thành công',
            metadata: newUser
        }).send(res);
    };

    login = async () => {
        
    };

    refreshToken = async () => {

    };

    logout = async () => {

    };

}

module.exports = new AuthController();