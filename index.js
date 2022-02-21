var fs = require('fs')
var path = require('path')

/** 扫描路径 */
var filePath = 'D:/web/dahua-rwms/wms-front/packages';

/** 要忽略的文件夹 */
var blacklist = ['node_modules', 'dist'];

/** 匹配文件类型 */
var matching = ['.js', '.jsx', '.ts', '.tsx'];

/** 目标字符串 */
var target = ['WMDM.WHAREA', 'WMDM.OWNER', 'WMDM.LOCATION'];

/**
 * 文件遍历方法
 * @param {string} filePath 需要遍历的文件路径
 */
function fileDisplay(filePath) {
  //根据文件路径读取文件，返回文件列表
  fs.readdir(filePath, function (err, files) {
    if (err) {
      return console.warn(err);
    }

    //遍历读取到的文件列表
    files.forEach(function (filename) {
      //获取当前文件的绝对路径
      var filedir = path.join(filePath, filename);

      //根据文件路径获取文件信息，返回一个fs.Stats对象
      fs.stat(filedir, function (err, stats) {
        if (err) {
          return console.warn('获取文件stats失败');
        }

        var isFile = stats.isFile();	//文件
        var isDir = stats.isDirectory();	//文件夹

        if (isFile) {
          if (matching.includes('.' + filename.split('.')[filename.split('.').length - 1])) {

            var data = fs.readFileSync(filedir, 'utf8');
            var temData = data;

            target.forEach(function (item) {
              temData = temData.replace(new RegExp("'" + item + "'", 'g'), `'R${item}'`);
            })
            fs.writeFileSync(filedir, temData);
          }
        }
        if (isDir) {
          if (blacklist.includes(filename)) return
          fileDisplay(filedir);	//如果是文件夹，就继续遍历该文件夹下面的文件
        }
      })
    });
  });
}

//调用文件遍历方法
fileDisplay(filePath);
