/**********渲染下拉选项**************/
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

/**********文章内容，调用富文本编辑器中的方法**************/
initEditor();

/**********剪裁功能，选择封面**************/
//1、 初始化剪裁区域
var image = $('#image');
var option = {
    aspectRatio: 400 / 280, //图片宽高比
    preview: '.img-preview', //预览区域
};
image.cropper(option);
//2、点击选择封面按钮，选择文件
// 思路：点击按钮自动触发文件域的点击事件即可事件
$('button:contains("选择封面")').click(function() {
    $('input[type=file]').trigger('click');
});
// 3、选择的文件已发生改变，更新剪裁区域图片
$('input[type=file]').change(function() {
    // 销毁原来的裁剪效果
    image.cropper('destroy');
    // 获取选择的文件对象
    var file = this.files[0];
    // console.dir(file);
    // 文件对象创建一个临时的地址
    var url = URL.createObjectURL(file);
    // 更换图片路径
    image.attr('src', url);
    // 重新创建剪裁区域
    image.cropper(option);
});

/**********添加文章**************/
var s;
// 根据点击的按钮添加对应的状态
$('button:contains("发布")').click(function() {
    s = '已发布'
});
$('button:contains("存为草稿")').click(function() {
    s = '草稿';
});
$('form').submit(function(e) {
    e.preventDefault();
    // 因为有文件，所以要用formData
    var data = new FormData(this);
    data.append('state', s);
    // 遍历formData对象，才能看到数据
    // 有的时候可能会获取不到值，调用富文本编辑器中内置方法获取内容
    // 这里不能有追加append（append会有两个content），要用set修改值
    data.set('content', tinyMCE.activeEditor.getContent());
    // data.forEach(function(val, key) {
    //     console.log(key, val);
    // });
    // 发送ajax请求
    $.ajax({
        type: 'POST',
        url: '/my/article/add',
        data: data,
        processData: false,
        contentType: false,
        success: function(res) {
            // 如果添加成功后，跳转到文章列表页面
            if (res.status == 0) {
                location.href = 'article.html';
            }
        }
    });
});