var laypage = layui.laypage; //加载分页模块
var data = {
    pagenum: 1, //当前页码
    pagesize: 2 //每页显示多少条
};
/*******渲染到页面数据**********/
function getRender() {
    $.ajax({
        url: '/my/article/list',
        data: data,
        success: function(res) {
            // console.log(res);
            template.defaults.imports.formDate = function(d) {
                var date = new Date(d);
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var day = date.getDate();
                var h = date.getHours();
                h = h < 10 ? '0' + h : h;
                var m = date.getMinutes();
                m = m < 10 ? '0' + m : m;
                var s = date.getSeconds();
                s = s < 10 ? '0' + s : s;
                return year + '-' + month + '-' + day + ' ' + h + ':' + m + ':' + s;
            };
            //和分类不一样，只能自己看自己发布的文章
            // 把结果渲染到页面
            var html = template('tpl-render', res);
            $('.layui-card-body tbody').html(html);
            // console.log(res);
            // 因为ajax是异步的，所以要等ajax请求成功之后再调用实现分页效果的函数
            page(res.total);
        }
    });
}
getRender();

/*******分页**********/
// 1、分页页码简单效果实现
// 2、数据和分页结合到一起
// 当前页码、数据总数、每页显示多少条是动态的
function page(d) {
    //执行一个laypage实例
    laypage.render({
        elem: 'page', //注意，这里的 page 是 ID，不用加 # 号
        count: d, //数据总数，从服务端得到
        limit: data.pagesize, //每页显示条数
        curr: data.pagenum, //当前页码值
        limits: [2, 3, 5], //每页条数的选择项
        layout: ['count', 'limit', 'prev', 'page', 'next'], //自定义排版，显示到分页区的小区域
        jump: function(obj, first) { // 切换分页的回调函数
            // console.log(obj); //当前分页的所有选项值
            // console.log(first); //是否首次调用，首次调用为true
            // 加判断，是否不是首次调用，不是，执行以下代码
            if (!first) {
                data.pagenum = obj.curr; //修改显示的页码值
                data.pagesize = obj.limit; //修改当前页显示条数
                // 重新渲染
                getRender();
            }
        }
    });
}


/*******表单筛选**********/
// 1、 获取从服务器返回的文章分类列表的数据，渲染都下拉选择框
$.ajax({
    url: '/my/article/cates',
    success: function(res) {
        var html = template('tpl-category', res);
        $('#list').append(html);
        // 因为表单元素下拉框是动态插入的。这时 form 模块 的自动化渲染是会对其失效的
        // 需要执行 form.render('select/checkbox/radio', filter);方法才会生效
        // filter是表单的lay-filter属性值
        var form = layui.form;
        form.render('select', 'test');
    }
});

//表单提交，获取分类
$('form').on('submit', function(e) {
    e.preventDefault();
    var cate_id = $('#list').val();
    var state = $('select[name=state]').val();
    data.cate_id = cate_id;
    data.state = state;
    data.pagenum = 1; //修改显示的页码值
    // 重新渲染页面
    getRender();
});

/*******删除功能**********/
$('tbody').on('click', '.btndel', function() {
    // 获取当前点击按钮的自定义属性
    var id = $(this).data('id');
    // console.log(id);
    layer.confirm('确认删除吗?', { icon: 3, title: '提示' }, function(index) {
        // 调用接口删除
        $.ajax({
            url: '/my/article/delete/' + id,
            success: function(res) {
                layer.msg(res.message);
                if (res.status == 0) {
                    getRender();
                }
            }
        });
        layer.close(index);
    });
});

/*******编辑功能**********/
// 点击编辑页面跳转到编辑页面
$('tbody').on('click', '.btnedit', function() {
    // 获取当前点击按钮的自定义属性
    var id = $(this).data('id');
    // 页面跳转
    location.href = 'edit.html';
    // 当前获取到的id值保存到本地
    sessionStorage.setItem('id', id);
});