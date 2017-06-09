var path = require('path')
var webpack = require('webpack')
var autoprefixer = require('autoprefixer')
var precss = require('precss')
module.exports = {
  entry: {
    'front-home_page': './src/front/pages/home-page/index.js',
    'front-mobile_office': './src/front/pages/mobile-office/index.js',
    'front-townsmen': './src/front/pages/townsmen/index.js',
    'front-work_diary': './src/front/pages/work-diary/index.js',
    'front-write_diary': './src/front/pages/write-diary/index.js',
    'front-write_article': './src/front/pages/write-article/index.js',
    'front-notice': './src/front/pages/notice/index.js',
    'front-publish_notice': './src/front/pages/publish-notice/index.js',
    'front-signin': './src/front/pages/signin/index.js',
    'front-signin_detail': './src/front/pages/signin-detail/index.js',
    'front-contact_book': './src/front/pages/contact-book/index.js',
    'front-issue_detail': './src/front/pages/issue-detail/index.js',
    'front-work_plan': './src/front/pages/work-plan/index.js',
    'front-publish_plan': './src/front/pages/publish-plan/index.js',
    'front-accurate_poor': './src/front/pages/accurate-poor/index.js',
    'front-article_detail': './src/front/pages/article-detail/index.js',
    'front-affair_deal': './src/front/pages/affair-deal/index.js',
    'front-life_question': './src/front/pages/life-question/index.js',
    'front-consult_list': './src/front/pages/consult-list/index.js',
    'front-question_list': './src/front/pages/question-list/index.js',
    'front-disaster_list': './src/front/pages/disaster-list/index.js',
    'front-online_consult': './src/front/pages/online-consult/index.js',
    'front-online_technique': './src/front/pages/online-technique/index.js',
    'front-party_build': './src/front/pages/party-build/index.js',
    'front-personal_center': './src/front/pages/personal-center/index.js',
    'front-science_rich': './src/front/pages/science-rich/index.js',
    'front-publish_consult': './src/front/pages/publish-consult/index.js',
    'front-publish_disaster': './src/front/pages/publish-disaster/index.js',
    'front-login': './src/front/pages/login/index.js',
    'front-register': './src/front/pages/register/index.js',
    'front-realname_identify': './src/front/pages/realname-identify/index.js',
    'front-edit_profile': './src/front/pages/edit-profile/index.js',
    'admin-home_page': './src/admin/pages/home-page/index.js',
    'admin-signin_manage': './src/admin/pages/signin-manage/index.js',
    'admin-townsmen_online': './src/admin/pages/townsmen-online/index.js',
    'admin-accurate_poor': './src/admin/pages/accurate-poor/index.js',
    'admin-party_build': './src/admin/pages/party-build/index.js',
    'admin-affair_deal': './src/admin/pages/affair-deal/index.js',
    'admin-edit_article': './src/admin/pages/edit-article/index.js',
    'admin-online_consult': './src/admin/pages/online-consult/index.js',
    'admin-online_technique': './src/admin/pages/online-technique/index.js',
    'admin-science_rich': './src/admin/pages/science-rich/index.js',
    'admin-life_question': './src/admin/pages/life-question/index.js',
    'admin-department_manage': './src/admin/pages/department-manage/index.js',
    'admin-image_manage': './src/admin/pages/image-manage/index.js',
    'admin-user_manage': './src/admin/pages/user-manage/index.js',
    'admin-realname_identify': './src/admin/pages/realname-identify/index.js'
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js',
    chunkFilename: 'chunk/[name].js'
  },
  externals: {'react': 'React', 'react-dom': 'ReactDOM', 'react-router': 'ReactRouter'},
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    })
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015'],
          plugins: ['transform-object-rest-spread', 'react-require']
        }
      },
      {
        test: /\.(css|less)$/,
        loader: 'style-loader!css-loader!postcss-loader!less-loader'
      },
      {
        test: /\.scss$/,
        loaders: [
          'style-loader',
          'css-loader?modules&localIdentName=[hash:base64:8]',
          'postcss-loader',
          'sass-loader'
        ]
      },
      { test: /\.(png|jpg|jpeg|gif)$/,
        loader: 'url-loader?limit=10000&name=./images/[name].[ext]'
      }
    ]
  },
  postcss: function () {
    return [autoprefixer({ browsers: ['Firefox >= 3', 'Opera 12.1', 'Android > 1.5', 'Explorer >= 6', 'iOS >= 5'] }), precss]
  }
}
