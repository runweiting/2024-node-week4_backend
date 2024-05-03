// handleErrorAsync 統一管理 catch 錯誤
const handleErrorAsync = function handleErrorAsync(func) {
  // 新增 middleware 接住資料
  return function (req, res, next) {
    // 執行 func 並加上 catch 統一捕捉錯誤
    func(req, res, next).catch((err) => {
      return next(err);
    });
  };
};

module.exports = handleErrorAsync;
