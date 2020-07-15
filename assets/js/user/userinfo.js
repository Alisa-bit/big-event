$(function() {
    function renderUser() {
        // 服务器获取到的数据渲染到页面
        $.get('/my/userinfo', function(res) {
            var form = layui.form;
            // 数据回填
            // form.val('表单的lay-filter属性值',表单元素对应的 name 和 value)
            // 注意点，要保证input的name属性值 === 对象的键，就可以完成表单赋值
            form.val('userform', res.data);
        });
    }
    renderUser();

    /****表单提交的时候更新数据*****/
    $('form').submit(function(e) {
        e.preventDefault();
        var data = $(this).serialize();
        // 因为登录名称设置的是只读属性， 因此获取到的值包含username的
        // 解决1：输入框name属性值为usernamae，设置为disabled禁用
        $.ajax({
            type: 'POST',
            url: '/my/userinfo',
            data: data,
            success: function(res) {
                layer.msg(res.message);
                if (res.status == 0) {
                    // window:当前窗口，parent：父页面
                    // 调用父页面中的函数，
                    window.parent.getLoad();
                }
            }
        });
    });


    /****点击重置恢复为原来的****/
    $('button:contains("重置")').click(function(e) {
        e.preventDefault();
        // 重新将原来的数据回填到页面
        renderUser();
    });
})