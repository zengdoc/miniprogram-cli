const child_process = require('child_process')
const argvs = process.argv.slice(2)
const cmd = argvs.length > 0
  ? `cd miniprogram && npm install ${argvs.join(' ')}`
  : `cd miniprogram_npm && npm install`
// 使用npm安装依赖
try {
  child_process.execSync(cmd)
} catch (err) {
  console.log(err.stack)
}
