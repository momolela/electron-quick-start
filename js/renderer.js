// 渲染进程相关的 js 写到这里，也就是页面相关的 js

// 导入 electron
const { electron } = require('electron')
const remote = require("@electron/remote")
// 导入文件系统
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
    // 获取到拖拽的文件
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


// webview 相关
// 通过查看页面的元素发现，webview 底层还是用了 iframe 去嵌入 src 的网址
// 但是 webview 是单独进程进行渲染，功能要比 iframe 强大的多
// 1.preload 可以往嵌入的网页中添加脚本
// 2.insertCSS 可以往嵌入的网页中添加 css 样式
// 3.openDevTools 可以打开嵌入网页的 devTools
// 4.executeJavaScript 可以在嵌入网页中执行脚本
// ...
const web = document.querySelector('#webview-con')
const webSpan = document.querySelector('#webview-span')
web.addEventListener('did-start-loading', () => {
    webSpan.innerHTML = 'webview 加载中'
})
web.addEventListener('did-stop-loading', () => {
    webSpan.innerHTML = 'webview 加载完成'
    web.insertCSS(`
        #su {
            background: red !important;
        }
    `)
    web.openDevTools()
    web.executeJavaScript(`
        alert(document.getElementById('su').value)
    `)
})

// window.open 打开子页面并且做父子之间的传递数据
let browserWindowProxy;
document.getElementById('window-open').addEventListener('click', () => {
    browserWindowProxy = window.open('child.html', 'child')
    browserWindowProxy.postMessage({
        from: 'index',
        data: '这是来自父窗口的数据'
    })
})
window.addEventListener('message', (msg) => {
    console.log('接收到的数据', msg)
})
document.getElementById('window-close').addEventListener('click', () => {
    browserWindowProxy.close()
})

// dialog 系统弹框
document.getElementById('dialog-select').addEventListener('click', () => {
    remote.dialog.showOpenDialog({
        title: '请选择你要的文件',
        buttonLabel: '选好了',
        filters: [
            { name: 'custom file type', extensions: ['js', 'html', 'json'] }
        ]
    }).then(res => {
        console.log(res)
    })
})
document.getElementById('dialog-save').addEventListener('click', () => {
    remote.dialog.showOpenDialog({
        title: '请选择你要保存的文件名',
        buttonLabel: '保存吧',
        filters: [
            { name: 'custom file type', extensions: ['js', 'html', 'json'] }
        ]
    }).then(res => {
        console.log(res)
        fs.writeFileSync(res.filePaths[0], '这里把内容保存到文件里面了')
    })
})
document.getElementById('dialog-message').addEventListener('click', () => {
    remote.dialog.showMessageBox({
        type: 'warning',
        title: '你确定么？',
        message: '你真的想要删除这条数据么？',
        buttons: ['OK', 'CANCEL']
    }).then(res => {
        console.log(res)
    })
})