
const asyncHandler = (fn) => {
    return (req, res, next) => {
        // Nếu fn chạy gặp lỗi (reject), catch sẽ bắt được và gọi next(error)
        fn(req, res, next).catch(next);
    }
}

module.exports = asyncHandler