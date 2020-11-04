const ora = require('ora')
const open = require('open')
const clear = require('clear')
const chalk = require('chalk')
const inquirer = require("inquirer") //命令行答询
const { promisify } = require('util')
const { clone } = require('./download')
const figlet = promisify(require('figlet'))

//获得命令运行时的路径
const getCwd = () => process.cwd() + '/'
const spawn = async (...args) => {
    const { spawn } = require('child_process')
    const options = args[args.length - 1]
    if (process.platform === 'win32') {
        options.shell = true
    } else {
        return
    }
    return new Promise(resolve => {
        const proc = spawn(...args)
        proc.stdout.pipe(process.stdout)
        proc.stderr.pipe(process.stderr)
        proc.on('close', () => {
            resolve()
        })
    })
}
const log = content => console.log(chalk.green(content))

/**
 * 🚀📦🌠
 * @param {*} name 获取当前用户初始化项目的名称
 */

module.exports = async name => {
    clear()
    const data = await figlet('Private CLI')
    // log(data)
    const USER = 'user'; //填写你自己的用户名
    const PASS = 'pass'; //填写你自己的密码
    const REPO = '192.168.32.160/web-front/template';  //填写你自己的模板项目git地址
    const remote = `http://${USER}:${PASS}@${REPO}`;
    log(`开始创建项目:` + name)
    await clone(remote)
    const process = ora(`开始安装依赖`)
    process.start()
    await spawn('npm', ['install'], { cwd: `${getCwd()}${name}` })
    process.succeed();
    log(`
'✔'安装完成：
To get Start:
===========================
    cd ${getCwd()}${name}
    npm run serve
===========================
            `)
    inquirer
        .prompt([
            {
                type: "input",
                name: "projectPort",
                message: "请输入项目运行端口",
                // default: "",
            }
        ])
        .then((answers) => {
            open(`http://localhost:${answers.projectPort}`)
            spawn('npm', ['run', 'serve'], { cwd: `${getCwd()}${name}` })
        })
}