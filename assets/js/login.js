$(function() {
    /***点击切换登录和注册界面****/
    $('#goto-register').click(function() {
        $('#login').hide().siblings('#register').show();
    });
    $('#goto-login').click(function() {
        $('#register').hide().siblings('#login').show();
    });

    /***点击注册调用接口完成注册功能***/
    $('#register form').submit(function(e) {
        // 阻止默认行为
        e.preventDefault();
        // 获取表单输入值,只需要获取用户名和一个密码就行
        var data = $(this).serialize();
        // console.log(data);//username=a&password=a
        // 调用接口
        $.ajax({
            type: 'POST',
            url: 'http://ajax.frontend.itheima.net/api/reguser',
            data: data,
            success: function(res) {
                // ajax请求成功后的提示信息
                layer.msg(res.message);
                // 如果注册成功，注册盒子隐藏，登录盒子显示
                if (res.status == 0) {
                    $('#login').show().next().hide();
                }
            }
        });
    });

    /****表单验证****/
    // 分析: a:密码必须6到12位，且不能出现空格
    //       b:两次输入密码不一致的话，提示输入不一致
    // 1、加载form模块
    var form = layui.form;
    // 2、自定义验证规则
    form.verify({
        // 使用：键：验证规则，值：可以是函数或者数组
        // 只需要把key赋值给输入框的 lay-verify 属性
        // validatePwd: function(val, item) {
        //     // val：表单的值(此时的输入框输入的值),item：表单的DOM对象
        //     // 如果密码不是6-12为，且出现了空格，
        //     if (!(/^\S{6,12}$/.test(val))) {
        //         return '密码必须6到12位，且不能出现空格';
        //     }
        // },
        validatePwd: [/^\S{6,12}$/, '密码必须6到12位，且不能出现空格'],
        isFit: function(val) {
            var txt = $('input[name=password]').eq(1).val();
            if (val != txt) {
                return '两次密码输入不一致'
            }
        }
    });

    /***完成登录功能****/
    $('#login form').submit(function(e) {
        // 阻止表单默认提交
        e.preventDefault();
        var data = $(this).serialize();
        // 把账号密码提交给接口
        $.ajax({
            type: 'POST',
            url: 'http://ajax.frontend.itheima.net/api/login',
            data: data,
            success: function(res) {
                // 无论成功与否都弹出提示信息
                layer.msg(res.message);
                if (res.status == 0) {
                    // 把token保存到本地存储
                    localStorage.setItem('token', res.token);
                    // 登录成功，页面跳转到首页
                    location.href = '/index.html'
                }
            }
        });
    });

});