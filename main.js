// electron 的唯一主进程

const { app, BrowserWindow, BrowserView, dialog } = require('electron')
const path = require('path')

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    // frame: false, // 是否有边框，一般提示框，都会设置为 false
    show: false, // 默认不显示
    backgroundColor: '#ffffff', // 窗口背景色
    // 打开的位置
    // x: 0,
    // y: 0,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      // 下面这两个可以让 renderer.js 文件中支持 node 语法和 process 对象
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
      // electron 5 之后默认时禁止的，要使用 webview 需要这里配置打开
      webviewTag: true
    }
  })
  require('@electron/remote/main').initialize()
  require("@electron/remote/main").enable(mainWindow.webContents)

  mainWindow.loadFile('./html/index.html')

  // webContents 的 did-finish-load 事件：导航完成时触发
  mainWindow.webContents.on('did-finish-load', () => {
    console.log('webContents 的 did-finish-load 事件：导航完成时触发')
  })

  // webContents 的 dom-ready 的事件：一个框架中的文本加载完成后触发
  mainWindow.webContents.on('dom-ready', () => {
    console.log('webContents 的 dom-ready 的事件：一个框架中的文本加载完成后触发')
  })

  // BrowserWindow 的 closed 事件：窗口关闭的时候触发
  mainWindow.on('closed', () => {
    console.log('BrowserWindow 的 closed 事件：窗口关闭的时候触发');
    mainWindow = null
  })

  // 上面的配置项设置 show 为 false，知道加载完才执行 show() 方法显示，避免空白页面
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  // ----------------------------- window 中加载子 window 窗口 --------------------------------
  // let childWindow = new BrowserWindow({
  //   parent: mainWindow, // 指定父窗口，拖动父窗口，子窗口会一起动，关闭父窗口，子窗口也会关闭
  //   // modal: true // 是否开启为模态窗口，永远置顶，其他窗口不可以操作
  // })

  // -------------------------------- window 中加载 view 窗口 --------------------------------
  // let windowView = new BrowserView()
  // windowView.setBounds({
  //   x: 10,
  //   y: 10,
  //   width: 200,
  //   height: 200
  // })
  // windowView.webContents.loadURL('https://www.baidu.com')
  // mainWindow.setBrowserView(windowView)

  // ------------------------------- window 中打开系统弹出框 dialog ----------------------------
  // dialog.showOpenDialog({
  //   properties: ['openFile', 'openDirectory', 'multiSelections']
  // })


}

// app 的 ready 事件：electron 完成初始化的时候触发
app.whenReady().then(() => {
  console.log('app 的 ready 事件：electron 完成初始化触发')

  // 创建窗口
  createWindow()

  // app 的 activate 事件：窗口激活的时候触发
  app.on('activate', function () {
    console.log('app 的 activate 事件：窗口激活的时候触发')
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// app 的 window-all-closed 事件：所有的窗口被关闭的时候触发
app.on('window-all-closed', function () {
  console.log('app 的 window-all-closed 事件：所有的窗口被关闭的时候触发')
  if (process.platform !== 'darwin') app.quit()
})
