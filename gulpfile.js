const { src, task, dest, series, parallel, watch } = require('gulp');
const gulpLess = require('gulp-less');
const cssnano = require('gulp-cssnano');
const rename = require('gulp-rename');
const del = require('del');
const imagemin = require('gulp-imagemin');
const path = require('path');
const fs = require('fs-extra');
const alias = require('gulp-wechat-weapp-src-alisa');

const distPath = './dist';

function resolve(...dirs) {
  args = typeof dir === 'string'
    ? [dirs]
    : dirs
  return path.join(process.cwd(), ...args);
}

// 引用路径别名配置
const aliasConfig = {
  'src': resolve('src'),
  'assets': resolve('src/assets'),
  'pages': resolve('src/pages'),
  'utils': resolve('src/utils'),
};
// 匹配文件路径
const pathArr = {
  lessPath: [
    'src/**.less',
    'src/**/**.less',
    'src/**/**/**.less',
  ],
  jsPath: [
    'src/app.js',
    'src/**/**.js',
    'src/**/**/**.js',
  ],
  copyPath: [
    'src/app.json',
    'src/project.config.json',
    'src/sitemap.json',
    'src/**/**.json',
    'src/**/**/**.json',
    'src/**/**.wxml',
    'src/**/**/**.wxml',
    'src/**/**.wxs',
    'src/**/**/**.wxs',
  ],
  imgPath: [
    'src/**/*(*.png|*.jpg|*.jpeg|*.svg|*.gif)',
    'src/**/**/*(*.png|*.jpg|*.jpeg|*.svg|*.gif)',
    'src/**/**/**/*(*.png|*.jpg|*.jpeg|*.svg|*.gif)',
  ],
};
// 设置.less转.wxss并拷贝到dist目录
const less = () => {
  return src(pathArr.lessPath)
    .pipe(alias(aliasConfig))
    .pipe(gulpLess())
    .pipe(cssnano())
    .pipe(rename(function (path) {
      path.extname = '.wxss';
    }))
    .pipe(dest(distPath))
};
task(less)

// 拷贝js到dist目录
const js = () => {
  return src(pathArr.jsPath)
    .pipe(alias(aliasConfig))
    .pipe(dest(distPath))
}
task(js)

// 针对wxs,wxml,json拷贝到dist目录
const copy = () => {
  return src(pathArr.copyPath)
    .pipe(dest(distPath))
}
task(copy)

// 图片资源直接拷贝到dist目录
const img = () => {
  return src(pathArr.imgPath)
    .pipe(imagemin())
    .pipe(dest(distPath));
}
task(img)

// 监听文件的变化
task('watch', function () {
  watch(pathArr.lessPath, less);
  watch(pathArr.jsPath, js);
  watch(pathArr.copyPath, copy);
  watch(pathArr.imgPath, img);
})

// 清除dist目录
task('clean', done => {
  del.sync([
    'dist/**',
    '!dist',
    '!dist/package.json',
    '!dist/package-lock.json',
    '!dist/node_modules',
    '!dist/miniprogram_npm/**',
  ]);
  done();
});

// 更新miniprogram
task('update', done => {
  const updateFiles = [
    'miniprogram/package.json',
    'miniprogram/package-lock.json',
    'miniprogram/node_modules'
  ]
  del.sync([
    'dist/node_modules/**',
  ]);
  updateFiles.forEach(fileName => {
    const filePath = resolve(fileName)
    const targetPath = resolve(distPath, fileName.replace('miniprogram/', ''))
    if (!fs.existsSync(fileName)) {
      return;
    }
    if (fs.lstatSync(filePath).isDirectory()) {
      if (!fs.existsSync(targetPath)) {
        fs.mkdirSync(targetPath)
      }
    }
    fs.copySync(filePath, targetPath)
  })
  done()
})

// 在命令行使用 gulp 启动任务
task('serve', series('clean', 'update', parallel('less', 'js', 'copy', 'img'), 'watch'))
task('build', series('clean', 'update', parallel('less', 'js', 'copy', 'img')))


