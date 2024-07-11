const express = require('express');
const router = express.Router();

router.get(
  '/',
  function (req, res, next) {
    res.render('index', { title: 'Express' });
  },
  /**
   * #swagger.ignore = true
   */
);

// 交易成功：Return （可直接解密，將資料呈現在畫面上）
router.post('/newebpay_return', function (req, res, next) {
  console.log('req.body return data', req.body);
  // res.render('success', { title: 'Express' });
});

// 確認交易：Notify
router.post('/newebpay_notify', function (req, res, next) {
  console.log('req.body notify data', req.body);
  // const response = req.body;
  // // 解密交易內容
  // const data = createSesDecrypt(response.TradeInfo);
  // console.log('data:', data);
  // // 取得交易內容，並查詢本地端資料庫是否有相符的訂單
  // console.log(orders[data?.Result?.MerchantOrderNo]);
  // if (!orders[data?.Result?.MerchantOrderNo]) {
  //   console.log('找不到訂單');
  //   return res.end();
  // }
  // // 使用 HASH 再次 SHA 加密字串，確保比對一致（確保不正確的請求觸發交易成功）
  // const thisShaEncrypt = createShaEncrypt(response.TradeInfo);
  // if (!thisShaEncrypt === response.TradeSha) {
  //   console.log('付款失敗：TradeSha 不一致');
  //   return res.end();
  // }
  // // 交易完成，將成功資訊儲存於資料庫
  // console.log('付款完成，訂單：', orders[data?.Result?.MerchantOrderNo]);
  // return res.end();
});

module.exports = router;
