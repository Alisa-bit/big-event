var form = layui.form; //加载form模块
var id = sessionStorage.getItem('id');
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
        form.render('select', 'edit');
    }
});
/*******获取服务器返回的数据，数据回填*********/

// 下拉列表的默认选项为此时选中的id
var image = $('#image');
$.ajax({
    url: '/my/article/' + id,
    success: function(res) {
        form.val('edit', {
            Id: res.data.Id,
            title: res.data.title,
            content: res.data.content,
            cate_id: res.data.cate_id
        });
        // 不能这样写，文件域不能value赋值，以下是错误写法
        // form.val('edit', res.data)
        // 修改图片得到地址
        image.attr('src', 'http://ajax.frontend.itheima.net' + res.data.cover_img);

        /*******剪裁，选择图片上传*********/
        // 为什么实现裁剪效果要写到这里
        // 原因：ajax是异步的，只有写到这来，要剪裁的图片才会跟上面的一致
        image.cropper(option);
    }
});
// 全局的配置项
var option = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
};

/*******富文本编辑器初始化*********/
initEditor();


/*******选择文件上传*********/
// 点击选择封面按钮，自动触发文件域点击事件
$('button:contains("选择封面")').click(function() {
    $('input[type=file]').trigger('click');
});
// 选择的文件已发生改变，就更新剪裁区域图片
$('input[type=file]').change(function() {
    image.cropper('destroy'); //销毁之前的剪裁效果
    var file = this.files[0];
    var url = URL.createObjectURL(file);
    image.attr('src', url); //跟换图片路径
    image.cropper(option);
});

/*******修改数据*********/
var s;
// 1、根据点击得到按钮判断状态
$('button:contains("发布")').click(function() {
    s = "已发布";
});
$('button:contains("存为草稿")').click(function() {
    s = "草稿";
});
$('form').submit(function(e) {
    e.preventDefault();
    // 获取输入信息
    var data = new FormData(this);
    data.append('state', s);
    data.set('content', tinyMCE.activeEditor.getContent());
    // 剪裁图片
    var canvas = image.cropper('getCroppedCanvas', {
        width: 400,
        height: 280
    });
    // 转为blob对象形式
    canvas.toBlob(function(blob) {
        // console.log(blob);
        // 形参 blob 就是转换后的结果
        data.append('cover_img', blob);
        // 遍历data，检查data里面有哪些数据
        // data.forEach(function (value, key) {
        //     console.log(key, value);
        // });
        // return;
        // ajax提交给接口，从而完成添加
        $.ajax({
            type: 'POST',
            url: '/my/article/edit',
            data: data,
            // 提交FormData数据，必须加下面两项
            processData: false,
            contentType: false,
            success: function(res) {
                layer.msg(res.message);
                if (res.status === 0) {
                    // 如果添加成功，跳转到文章列表页面
                    location.href = '/article/article.html';
                }
            }
        });
    });
});