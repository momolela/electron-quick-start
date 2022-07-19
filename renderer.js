// 渲染进程相关的 js 写到这里，也就是页面相关的 js

const electron = require('electron')
const fs = require('fs')


// process 对象相关
document.getElementById('process-info-btn').addEventListener('click', () => {
    console.log('process CPUUsage: ', process.getCPUUsage())
    console.log('process platform: ', process.platform)
    console.log('process arch: ', process.arch)
    console.log('process env: ', process.env)
})


// file 对象相关
document.getElementById('drag-test').addEventListener('drop', (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files
    if (files && files.length > 0) {
        const path = files[0].path
        console.log('drag file path: ', path)
        const fileContent = fs.readFileSync(path)
        console.log('drag file content: ', fileContent.toString())
    }
})
document.getElementById('drag-test').addEventListener('dragover', (e) => {
    e.preventDefault();
})