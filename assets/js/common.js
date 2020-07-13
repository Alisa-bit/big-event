$(function() {
    $.ajaxPrefilter(function(options) {
        options.url = 'http://ajax.frontend.itheima.net' + options.url;
        options.complete = function(r) {
            // 无论请求成功与否都会触发
            // r.responseJSON: {status: 1, message: "身份认证失败！"}
            if (r.responseJSON.status == 1 && r.responseJSON.message == "身份认证失败！") {
                // 跳转到登录页面
                location.href = '/login.html';
                localStorage.removeItem('token');
            }
        };
        options.headers = {
            Authorization: localStorage.getItem('token')
        }
    });
})