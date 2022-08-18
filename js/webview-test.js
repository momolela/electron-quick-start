setTimeout(() => {
    alert('5 秒后的弹窗获取嵌入网站的 logo 图片地址：' + document.querySelector('#s_lg_img').src)
    // 给百度首页搜索按钮的点击事件加上自己的提示
    document.querySelector('#su').addEventListener('click', () => {
        alert('你点击了百度一下')
    })
}, 5000)

