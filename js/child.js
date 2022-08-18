document.getElementById('post-message-btn').addEventListener('click', () => {
    window.opener.postMessage({
        from: 'child',
        data: '这是来自子窗口的数据'
    })
})
window.addEventListener('message', (msg) => {
    console.log('接收到的数据', msg)
})