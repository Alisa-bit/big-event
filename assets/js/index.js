/*****获取用户信息，渲染到页面*****/
// 之所以要用函数封装起来是因为后面会多次用到
function getLoad() {
    $.ajax({
        type: 'GET',
        url: '/my/userinfo',
        success: function(res) {
            // 判断一下，如果身份认证成功，才会把获取到的用户信息渲染到页面
            if (res.status == 0) {
                // 1、设置欢迎语 用户名
                // 有昵称优先使用昵称，没有使用登录的用户名
                var name = res.data.nickname || res.data.username;
                $('#user-name').html('&nbsp;&nbsp;欢迎你&nbsp;&nbsp;' + name);
                $('.layui-nav-img').hide();
                // 2、设置头像
                // 如果服务器返回的头像为null， 则把昵称的第一个字符作为头像
                if (res.data.user_pic) {
                    $('.layui-nav-img').attr('src', res.data.user_pic).show();
                    $('.txt-avater').css({ display: 'none' });
                } else {
                    // 获取昵称或者登录名的第一个首字符,并且转为大写
                    var first = name.substring(0, 1).toUpperCase();
                    $('.txt-avater').text(first).css({ display: 'inline-block' });
                    $('.layui-nav-img').hide();
                }
            }
        }
    })
}
getLoad();
/****完成退出功能*****/
// 思路：弹出提示框，如果确定退出,删除本地存储的token,跳转到登录界面
$('#exit').click(function() {
    layer.confirm('确定退出吗?', { icon: 3, title: '提示' }, function(index) {
        // 回调函数，点击确定之后触发
        //1、 删除本地存储的token
        localStorage.removeItem('token');
        // 2、跳转到登录页面
        location.href = '/login.html';
        layer.close(index);
    });
});