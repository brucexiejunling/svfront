'use strict';

var path = require('path');
var express = require('express');
var webpack = require('webpack');

var app = express();
var config = require('./webpack.config.js');

config.entry = {
  demo: ['webpack-hot-middleware/client', './demo/index.js'],
  'front-home_page': [
    'webpack-hot-middleware/client',
    './src/front/pages/home-page/index.js'
  ],
  'front-mobile_office': [
    'webpack-hot-middleware/client',
    './src/front/pages/mobile-office/index.js'
  ],
  'front-contact_book': [
    'webpack-hot-middleware/client',
    './src/front/pages/contact-book/index.js'
  ],
  'front-notice': [
    'webpack-hot-middleware/client',
    './src/front/pages/notice/index.js'
  ],
  'front-townsmen': [
    'webpack-hot-middleware/client',
    './src/front/pages/townsmen/index.js'
  ],
  'front-write_article': [
    'webpack-hot-middleware/client',
    './src/front/pages/write-article/index.js'
  ],
  'front-publish_notice': [
    'webpack-hot-middleware/client',
    './src/front/pages/publish-notice/index.js'
  ],
  'front-issue_detail': [
    'webpack-hot-middleware/client',
    './src/front/pages/issue-detail/index.js'
  ],
  'front-disaster_list': [
    'webpack-hot-middleware/client',
    './src/front/pages/disaster-list/index.js'
  ],
  'front-question_list': [
    'webpack-hot-middleware/client',
    './src/front/pages/question-list/index.js'
  ],
  'front-consult_list': [
    'webpack-hot-middleware/client',
    './src/front/pages/consult-list/index.js'
  ],
  'front-publish_plan': [
    'webpack-hot-middleware/client',
    './src/front/pages/publish-plan/index.js'
  ],
  'front-work_plan': [
    'webpack-hot-middleware/client',
    './src/front/pages/work-plan/index.js'
  ],
  'front-work_diary': [
    'webpack-hot-middleware/client',
    './src/front/pages/work-diary/index.js'
  ],
  'front-write_diary': [
    'webpack-hot-middleware/client',
    './src/front/pages/write-diary/index.js'
  ],
  'front-signin': [
    'webpack-hot-middleware/client',
    './src/front/pages/signin/index.js'
  ],
  'front-signin_detail': [
    'webpack-hot-middleware/client',
    './src/front/pages/signin-detail/index.js'
  ],
  'front-accurate_poor': [
    'webpack-hot-middleware/client',
    './src/front/pages/accurate-poor/index.js'
  ],
  'front-affair_deal': [
    'webpack-hot-middleware/client',
    './src/front/pages/affair-deal/index.js'
  ],
  'front-life_question': [
    'webpack-hot-middleware/client',
    './src/front/pages/life-question/index.js'
  ],
  'front-online_consult': [
    'webpack-hot-middleware/client',
    './src/front/pages/online-consult/index.js'
  ],
  'front-online_technique': [
    'webpack-hot-middleware/client',
    './src/front/pages/online-technique/index.js'
  ],
  'front-party_build': [
    'webpack-hot-middleware/client',
    './src/front/pages/party-build/index.js'
  ],
  'front-personal_center': [
    'webpack-hot-middleware/client',
    './src/front/pages/personal-center/index.js'
  ],
  'front-science_rich': [
    'webpack-hot-middleware/client',
    './src/front/pages/science-rich/index.js'
  ],
  'front-publish_consult': [
    'webpack-hot-middleware/client',
    './src/front/pages/publish-consult/index.js'
  ],
  'front-publish_disaster': [
    'webpack-hot-middleware/client',
    './src/front/pages/publish-disaster/index.js'
  ],
  'front-article_detail': [
    'webpack-hot-middleware/client',
    './src/front/pages/article-detail/index.js'
  ],
  'front-login': [
    'webpack-hot-middleware/client',
    './src/front/pages/login/index.js'
  ],
  'front-register': [
    'webpack-hot-middleware/client',
    './src/front/pages/register/index.js'
  ],
  'front-edit_profile': [
    'webpack-hot-middleware/client',
    './src/front/pages/edit-profile/index.js'
  ],
  'front-realname_identify': [
    'webpack-hot-middleware/client',
    './src/front/pages/realname-identify/index.js'
  ],
  'admin-home_page': [
    'webpack-hot-middleware/client',
    './src/admin/pages/home-page/index.js'
  ],
  'admin-signin_manage': [
    'webpack-hot-middleware/client',
    './src/admin/pages/signin-manage/index.js'
  ],
  'admin-townsmen_online': [
    'webpack-hot-middleware/client',
    './src/admin/pages/townsmen-online/index.js'
  ],
  'admin-accurate_poor': [
    'webpack-hot-middleware/client',
    './src/admin/pages/accurate-poor/index.js'
  ],
  'admin-party_build': [
    'webpack-hot-middleware/client',
    './src/admin/pages/party-build/index.js'
  ],
  'admin-edit_article': [
    'webpack-hot-middleware/client',
    './src/admin/pages/edit-article/index.js'
  ],
  'admin-affair_deal': [
    'webpack-hot-middleware/client',
    './src/admin/pages/affair-deal/index.js'
  ],
  'admin-department_manage': [
    'webpack-hot-middleware/client',
    './src/admin/pages/department-manage/index.js'
  ],
  'admin-image_manage': [
    'webpack-hot-middleware/client',
    './src/admin/pages/image-manage/index.js'
  ],
  'admin-user_manage': [
    'webpack-hot-middleware/client',
    './src/admin/pages/user-manage/index.js'
  ],
  'admin-online_consult': [
    'webpack-hot-middleware/client',
    './src/admin/pages/online-consult/index.js'
  ],
  'admin-life_question': [
    'webpack-hot-middleware/client',
    './src/admin/pages/life-question/index.js'
  ],
  'admin-realname_identify': [
    'webpack-hot-middleware/client',
    './src/admin/pages/realname-identify/index.js'
  ],
  'admin-online_technique': [
    'webpack-hot-middleware/client',
    './src/admin/pages/online-technique/index.js'
  ],
  'admin-science_rich': [
    'webpack-hot-middleware/client',
    './src/admin/pages/science-rich/index.js'
  ]
};

config.module.loaders.push({
  test: /\.jsx?$/,
  loader: 'babel',
  query: {
    presets: ['react', 'es2015', 'react-hmre'],
    plugins: ['transform-object-rest-spread']
  }
});
config.plugins = [new webpack.HotModuleReplacementPlugin()];
var compiler = webpack(config);

app.use(express.static(path.join(__dirname, 'assets')));

app.use(
  require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: '/'
  })
);

app.use(require('webpack-hot-middleware')(compiler));

app.get('/demo', function(req, res) {
  res.sendFile(path.join(__dirname, 'demo/index.html'));
});

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'demo/front/home-page/index.html'));
});

//事物详情, 答疑，任务，上报等
app.get('/swxq', function(req, res) {
  res.sendFile(path.join(__dirname, 'demo/front/issue-detail/index.html'));
});

app.get('/txl', function(req, res) {
  res.sendFile(path.join(__dirname, 'demo/front/contact-book/index.html'));
});

app.get('/xxzx', function(req, res) {
  res.sendFile(path.join(__dirname, 'demo/front/townsmen/index.html'));
});

app.get('/fbjh', function(req, res) {
  res.sendFile(path.join(__dirname, 'demo/front/publish-plan/index.html'));
});

app.get('/fbtz', function(req, res) {
  res.sendFile(path.join(__dirname, 'demo/front/publish-notice/index.html'));
});

app.get('/jzfp', function(req, res) {
  res.sendFile(path.join(__dirname, 'demo/front/accurate-poor/index.html'));
});

app.get('/ydbg', function(req, res) {
  res.sendFile(path.join(__dirname, 'demo/front/mobile-office/index.html'));
});

app.get('/tzgg', function(req, res) {
  res.sendFile(path.join(__dirname, 'demo/front/notice/index.html'));
});

app.get('/gzjh', function(req, res) {
  res.sendFile(path.join(__dirname, 'demo/front/work-plan/index.html'));
});

app.get('/ddjs', function(req, res) {
  res.sendFile(path.join(__dirname, 'demo/front/party-build/index.html'));
});

app.get('/kqqd', function(req, res) {
  res.sendFile(path.join(__dirname, 'demo/front/signin/index.html'));
});

app.get('/qdxq', function(req, res) {
  res.sendFile(path.join(__dirname, 'demo/front/signin-detail/index.html'));
});

app.get('/zxxf', function(req, res) {
  res.sendFile(path.join(__dirname, 'demo/front/online-consult/index.html'));
});

app.get('/fbxf', function(req, res) {
  res.sendFile(path.join(__dirname, 'demo/front/publish-consult/index.html'));
});

app.get('/wybs', function(req, res) {
  res.sendFile(path.join(__dirname, 'demo/front/affair-deal/index.html'));
});

app.get('/msdy', function(req, res) {
  res.sendFile(path.join(__dirname, 'demo/front/life-question/index.html'));
});

app.get('/kjzf', function(req, res) {
  res.sendFile(path.join(__dirname, 'demo/front/science-rich/index.html'));
});

app.get('/wddy', function(req, res) {
  res.sendFile(path.join(__dirname, 'demo/front/question-list/index.html'));
});

app.get('/wdbch', function(req, res) {
  res.sendFile(path.join(__dirname, 'demo/front/disaster-list/index.html'));
});

app.get('/wdxf', function(req, res) {
  res.sendFile(path.join(__dirname, 'demo/front/consult-list/index.html'));
});

app.get('/njzx', function(req, res) {
  res.sendFile(path.join(__dirname, 'demo/front/online-technique/index.html'));
});

app.get('/grzx', function(req, res) {
  res.sendFile(path.join(__dirname, 'demo/front/personal-center/index.html'));
});

app.get('/bchsb', function(req, res) {
  res.sendFile(path.join(__dirname, 'demo/front/publish-disaster/index.html'));
});

app.get('/wzxq', function(req, res) {
  res.sendFile(path.join(__dirname, 'demo/front/article-detail/index.html'));
});

app.get('/gzrz', function(req, res) {
  res.sendFile(path.join(__dirname, 'demo/front/work-diary/index.html'));
});

app.get('/xrz', function(req, res) {
  res.sendFile(path.join(__dirname, 'demo/front/write-diary/index.html'));
});

app.get('/xwz', function(req, res) {
  res.sendFile(path.join(__dirname, 'demo/front/write-article/index.html'));
});

app.get('/smrz', function(req, res) {
  res.sendFile(path.join(__dirname, 'demo/front/realname-identify/index.html'));
});

app.get('/xgzl', function(req, res) {
  res.sendFile(path.join(__dirname, 'demo/front/edit-profile/index.html'));
});

app.get('/login', function(req, res) {
  res.sendFile(path.join(__dirname, 'demo/front/login/index.html'));
});

app.get('/register', function(req, res) {
  res.sendFile(path.join(__dirname, 'demo/front/register/index.html'));
});

app.get('/admin/home', function(req, res) {
  res.sendFile(path.join(__dirname, 'demo/admin/home-page/index.html'));
});

app.get('/admin/jzfp', function(req, res) {
  res.sendFile(path.join(__dirname, 'demo/admin/accurate-poor/index.html'));
});

app.get('/admin/ddjs', function(req, res) {
  res.sendFile(path.join(__dirname, 'demo/admin/party-build/index.html'));
});

app.get('/admin/kqgl', function(req, res) {
  res.sendFile(path.join(__dirname, 'demo/admin/signin-manage/index.html'));
});

app.get('/admin/wybs', function(req, res) {
  res.sendFile(path.join(__dirname, 'demo/admin/affair-deal/index.html'));
});

app.get('/admin/xxzx', function(req, res) {
  res.sendFile(path.join(__dirname, 'demo/admin/townsmen-online/index.html'));
});

app.get('/admin/zxxf', function(req, res) {
  res.sendFile(path.join(__dirname, 'demo/admin/online-consult/index.html'));
});

app.get('/admin/bmgl', function(req, res) {
  res.sendFile(path.join(__dirname, 'demo/admin/department-manage/index.html'));
});

app.get('/admin/tpgl', function(req, res) {
  res.sendFile(path.join(__dirname, 'demo/admin/image-manage/index.html'));
});

app.get('/admin/yhgl', function(req, res) {
  res.sendFile(path.join(__dirname, 'demo/admin/user-manage/index.html'));
});

app.get('/admin/msdy', function(req, res) {
  res.sendFile(path.join(__dirname, 'demo/admin/life-question/index.html'));
});

app.get('/admin/smsh', function(req, res) {
  res.sendFile(path.join(__dirname, 'demo/admin/realname-identify/index.html'));
});

app.get('/admin/kjzf', function(req, res) {
  res.sendFile(path.join(__dirname, 'demo/admin/science-rich/index.html'));
});

app.get('/admin/njzx', function(req, res) {
  res.sendFile(path.join(__dirname, 'demo/admin/online-technique/index.html'));
});

app.get('/admin/bjwz', function(req, res) {
  res.sendFile(path.join(__dirname, 'demo/admin/edit-article/index.html'));
});

app.listen(3002, 'localhost', function(err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Listening at http://localhost:3002');
});
