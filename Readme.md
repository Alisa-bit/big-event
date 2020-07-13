## 回顾

### 本地存储

- 浏览器提供了一套API，可以让我们在计算机中存储一些数据
- API
    - `localStorage.setItem(键, 值)` -- 向本地存储中存一些数据
    - `localStorage.getItem(键)` -- 从本地存储中取一个数据
    - `localStorage.removeItem(键)` -- 从本地存储中删除一个数据
- 特点
    - 本地存储中，只能存字符串，如果希望存一个对象，必须把对象转成字符串
    - 本地存储中的数据会永久保存

### layui的表单验证

layui内置模块（form）模块，提供了表单验证功能。

- 如何使用layui的内置模块

    - 使用之前，需要先加载模块
    - `var form = layui.form` -- 加载form模块
    - `var laypage = layui.laypage` -- 加载分页模块
    - .......

- HTML中使用验证规则

    - `<input type="text" lay-verify="验证规则|验证规则|验证规则" />`

- 验证规则

    - 内置验证规则（required、email、number.......）

    - 自定义验证规则 

        ```js
        form.verify({
            键（验证规则）：值（验证方法）
        })
        ```

- 注意事项

    - form标签，必须有layui-form类。`<form class="layui-form">`
    - 按钮必须有 `lay-submit` 属性

## 登录和注册

### 登录

- 监听表单的提交事件
- 阻止默认行为
- 收集表单数据（一定要检查input的name）
- ajax提交给接口
- 登录成功
    - 把token保存到本地存储
    - 跳转到后台首页 index.html

```js
// -----------------------  登录功能 ----------------------
// 监听表单的提交事件 -> 阻止默认行为 -> 收集表单数据 -> ajax提交给接口
$('#login form').on('submit', function (e) {
    e.preventDefault();
    // 做到这一步，必须检查input的name属性值
    // 检查input的name属性值，是否和接口要求的请求参数名一致，必须一致才行
    var data = $(this).serialize();
    $.ajax({
        type: 'POST',
        url: 'http://www.liulongbin.top:3007/api/login',
        data: data,
        success: function (res) {
            // 无论登录成功还是失败，给出提示
            layer.msg(res.message);
            if (res.status === 0) {
                // 把token保存到本地存储中
                localStorage.setItem('token', res.token);
                // 登录成功，跳转到首页
                // 表示跳转到根目录中的index.html
                location.href = '/index.html';
            }
        }
    }); 
})
```



### token身份认证机制

![image-20200713095928018](大事件-02.assets/image-20200713095928018.png)

### 合并login分支到master

```bash
# 提交login分支的全部代码
git add .
git commit -m '完成了登录'

# 切换到master分支
git checkout master

# 把login分支合并到master分支
git merge login

# 如果合并成功，那么login分支可以删除（留着也行）
```



## 后台首页

### 创建新分支

> 首先要保证已经把login分支合并到了master分支

从master分支上，创建新分支 index

```bash
##########   一定先把login分支合并到master分支

# 切换到master分支
git checkout master

# 创建并切换到index分支
git checkout -b index
```

### 创建文件，加载css和js

- 创建了 /index.html
- 创建了 /assets/css/index.css
- 创建了 /assets/js/index.js

### 页面布局

- 到layui官网，文档-->页面元素-->布局-->后台布局。
- 复制后台布局全部的代码，粘贴到你的 index.html 中。
- 修改layui.css 和 layui.all.js 的路径
- 至此，index.html 页面布局基本上就实现了。

> 做完之后，浏览器打开页面，页面的效果能不能实现。

### 头部处理

- 不对的换掉
- 不要的删除

### 侧边栏导航处理

- 自行调整成和线上效果一样的结构
- 给“首页” 添加 `layui-this` 类，表示默认该项选中
- 去掉 文章管理 的 “`layui-nav-itemed`” 类，刷新后，该项为收缩状态
- 给 ul 添加 `lay-shrink="all"` 属性，则会出现排他(手风琴)效果。

### 使用字体图标

略

### 头像处理

- 头部的头像和侧边栏的头像一样
- 复制头部区域的 a 标签，放到侧边栏开始的位置，修改a标签为div

- 自定义类。并添加样式，完成最终的效果。

```html
<!-- 侧边栏代码 -->
<div id="user" href="javascript:;">
    <img src="http://t.cn/RCzsdCq" class="layui-nav-img">
    个人中心
</div>

```

```css
/* 侧边栏的头像位置 div */
#user {
    height: 60px;
    text-align: center;
    line-height: 60px;
}
```

- 设置欢迎语

```html
<div id="user">
    <span class="text-avatar">A</span>
    <img src="http://t.cn/RCzsdCq" class="layui-nav-img">
    欢迎你<span class="username">老汤</span>
</div>
```

- 设置文字头像

    因为新注册的账号没有图片类型的头像，所以取用户名的第一个字符当做头像。

    如果后续，用户更换了图片头像，那么就显示图片头像。

    ```html
    <!--    头部  --- 添加 span.text-avatar 标签    -->
    <a href="javascript:;">
        <span class="text-avatar">A</span>
        <img src="http://t.cn/RCzsdCq" class="layui-nav-img">
        个人中心
    </a>
    <!--    侧边栏 --- 添加 span.text-avatar 标签   -->
    <div id="user">
        <span class="text-avatar">A</span>
        <img src="http://t.cn/RCzsdCq" class="layui-nav-img">
        欢迎你<span class="username">老汤</span>
    </div>
    ```
    
```css
    /*处理文字头像*/
    .text-avatar {
        display: inline-block;
        height: 32px;
        width: 32px;
        background-color: #419488;
        border-radius: 50%;
        text-align: center;
        line-height: 32px;
    
        display: none; /* 字体头像，先隐藏 */
    }
    ```
    



### 内容区

使用iframe标签

- iframe标签是HTML标签
- iframe在整个页面（父页面）中，占用一个区域，这个区域可以引入其他（子）页面
- src属性用于引入默认的子页面
- 侧边栏的 a 标签，href属性正常挂链接
- 侧边栏的 a 标签，通过指定 `target=“iframe的name值”` ，可以在iframe区域打开链接的页面

![image-20200713120721501](大事件-02.assets/image-20200713120721501.png)



### 登录之后，获取用户信息并渲染

> 开发之前，记得把jQuery和自己的js先加载好

- 封装一个函数 `getUserInfo()`，完成ajax请求，获取用户信息并渲染
-  `getUserInfo()` 函数要放到入口函数外部
    - 封装成函数，后续，其他页面会使用
- 发送请求的时候，必须在请求头中，携带token
- 渲染
    - 设置欢迎语
        - 优先使用昵称，没有昵称则使用登录账号
    - 设置头像
        - 优先使用图片，没有图片，则使用名字的第一个字符
        - 设置字体头像的时候，不要用show()方法，要自己设置css样式

```js
// 入库函数外面封装，全局函数，方便在其他位置调用
function getUserInfo() {
    $.ajax({
        // type: 'GET', // type不填，默认就是GET
        url: 'http://www.liulongbin.top:3007/my/userinfo',
        success: function (res) {
            if (res.status === 0) {
                // 1、设置欢迎语（有昵称，就使用昵称，没有昵称，使用用户名）
                var myname = res.data.nickname || res.data.username;
                $('.myname').text(myname);
                // 2、设置头像（有图片，使用图片；没有图片，使用名字的首字母）
                if (res.data.user_pic) {
                    // 使用图片
                    $('.layui-nav-img').attr('src', res.data.user_pic).show();
                    $('.text-avatar').hide();
                } else {
                    var t = myname.substr(0, 1).toUpperCase();
                    // jQuery中的show方法，会设置元素 display:inline;
                    $('.text-avatar').text(t).css('display', 'inline-block');
                    $('.layui-nav-img').hide();
                }
            }
        },
        // jQuery中ajax选项，有一个headers，通过他，可以设置请求头
        headers: {
            'Authorization': localStorage.getItem('token')
        }
    });
}
```

入库函数中，调用该方法

```js
$(function () {
    // --------------  获取用户信息，并渲染到页面中 ----------
    getUserInfo();
});
```



### 退出功能

- 退出超链接
    - 加入 id="logout"
    - href="javascript:;"    这点一定要注意
- 点击退出
    - 询问
    - 删除token
    - 跳转到 login.html

```js
// --------------  退出功能 ---------------------
// 退出的时候，两个操作
// - 删除token
// - 页面跳转到登录页面
$('#logout').click(function () {
    // 弹出层，询问是否要退出
    layer.confirm('你确定退出吗？你退出了还得登录，你想好了吗？', function (index) {
        //do something
        // 如果点击了确定，删除token，页面跳转
        localStorage.removeItem('token');
        location.href = '/login.html';
        layer.close(index); // 关闭当前弹出层
    });

});
```



### 控制用户必须登录才能访问index.html

- 思路

    - 根据token来判断（没有token，则跳转到login.html）

        - 在 `index.html` 中，加入如下判断

            ```html
            <script>
              if (!localStorage.getItem('token')) {
                location.href = '/login.html';
              }
            </script>
            ```

            > 这种判断，适用于控制大部分用户

    - 根据ajax请求结果来判断

        - 获取用户信息之后，根据服务器返回的结果，判断

        ```js
        // complete函数，在ajax请求完成（无论成功还是失败）之后触发
        complete: function (xhr) {
            // 这里判断身份认证是否成功
            // console.log(xhr);
            if (xhr.responseJSON.status === 1 && xhr.responseJSON.message === '身份认证失败！') {
                // 删除假token
                localStorage.removeItem('token');
                // 跳转到登录页面
                location.href = '/login.html';
            }
        },
        ```
        
        

![image-20200608165320957](大事件-02.assets/image-20200608165320957.png)

## 合并分支到master

- 之前做的怎么样无所谓
- 如果现在的分支有全部的代码，那么全部提交。
    - 提交之后，保证了至少有一个分支有全部的代码
    - 查看一下这个分支是哪个分支，我的是 index 分支
- 切换到master分支
- 把 index 分支合并到 master分支，这样的话，master 分支就有全部的代码了