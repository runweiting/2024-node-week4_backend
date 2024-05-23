const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/usersModel');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CLIENT_CALLBACKURL,
    },
    async (accessToken, refreshToken, profile, cb) => {
      // 判斷使用者是否曾以 google 登入
      const targetUser = await User.findOne({ googleId: profile.id });
      if (targetUser) {
        console.log('使用者已存在');
        return cb(null, targetUser);
      }
      // 幫未曾以 google 登入的使用者生成加密密碼來註冊
      const password = await bcrypt.hash(
        process.env.GOOGLE_RESOURCE_OWNER_SECRET,
        12,
      );
      const newUser = await User.create({
        name: profile.displayName,
        email: profile.emails[0].value,
        password,
        googleId: profile.id,
      });
      return cb(null, newUser);
    },
  ),
);
