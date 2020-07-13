$(function() {
    /*****获取用户信息，渲染到页面*****/
    function getLoad() {
        $.ajax({
            type: 'GET',
            url: 'http://ajax.frontend.itheima.net/my/userinfo',
            complete: function(r) {
                // 无论请求成功与否都会触发
                // r.responseJSON: {status: 1, message: "身份认证失败！"}
                if (r.responseJSON.status == 1 && r.responseJSON.message == "身份认证失败！") {
                    // 跳转到登录页面
                    location.href = '/login.html';
                }
            },
            success: function(res) {
                // 判断一下，如果身份认证成功，才会把获取到的用户信息渲染到页面
                if (res.status == 0) {
                    // 1、设置欢迎语 用户名
                    // 有昵称优先使用昵称，没有使用登录的用户名
                    var name = res.data.nickname || res.data.username;
                    $('#user-name').text(name);
                    $('.layui-nav-img').hide();
                    // 2、设置头像
                    // 如果服务器返回的头像为null， 则把昵称的第一个字符作为头像
                    if (!res.data.user_pic) {
                        // 获取昵称或者登录名的第一个首字符,并且转为大写
                        var first = name.substring(0, 1).toUpperCase();
                        $('.txt-avater').text(first).css({ display: 'inline-block' });
                        $('.layui-nav-img').hide();
                    }
                }
            },
            headers: {
                Authorization: localStorage.getItem('token')
            }
        })
    }
    getLoad();

})