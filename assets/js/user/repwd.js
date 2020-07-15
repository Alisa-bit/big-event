/****表单验证****/
// 加载form模块
var form = layui.form;
// 表单验证规则
/* 长度必须是6 - 12 位，且内容不能有空格
 *  原密码和新密码不能一致
 *  确认密码和新密码要一致
 */
form.verify({
    len: [/^\S{6,12}$/, '密码必须是6到12位， 且不能出现空格'],
    isSame: function(val) {
        var oldPwd = $('.oldPwd').val();
        if (oldPwd === val) {
            return '原密码和新密码不能一致'
        }
    },
    isSure: function(val) {
        var newPwd = $('.newPwd').val();
        if (newPwd !== val) {
            return '两次密码输入不一致'
        }
    }
});
/*****表单提交调用接口发送请求，重置密码******/
$('form').submit(function(e) {
    e.preventDefault();
    var data = $(this).serialize();
    $.post('/my/updatepwd', data, function(res) {
        layer.msg(res.message);
        // 如果修改成功，清空表单的值
        if (res.status == 0) {
            $('form')[0].reset();
        }
    })
});