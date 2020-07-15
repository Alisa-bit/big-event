/**********初始化剪裁插件********/
// 1、获取剪裁图片
var image = $('#image');
// 2、剪裁插件设置配置项
var options = {
    // 默认值NaN。设置剪裁容器的比例
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
};
// 3、调用剪裁插件，实现剪裁效果
image.cropper(options);

/**********点击上传，实现选择图片********/
$('button:contains("上传")').click(function() {
    $('input[type=file]').click();
});

/**********文件域的一发生改变，就更新剪裁区域的图片********/
$('#file').change(function(e) {
    // 销毁原来的剪裁区域
    image.cropper('destroy');
    // 获取用户选择的文件对象
    var file = $(this)[0].files[0];
    // 为文件对象创建一个url(使用JS内置对象的方法，为文件对象创建一个用于访问它的临时的url)
    var newImgURL = URL.createObjectURL(file);
    // console.log(newImgURL);
    // 更新图片地址
    image.attr('src', newImgURL);
    // 重新创建剪裁区域
    image.cropper(options);
});

/**********点击确定，调用接口更新头像********/
$('button:contains("确定")').click(function() {
    // 返回了一个画有剪裁图片的canvas
    var dataurl = image.cropper('getCroppedCanvas', {
        width: 100, //canvns画布目标宽
        height: 100 //canvns画布目标高
    });

    // 将剪裁的图片转为base64的格式
    data = dataurl.toDataURL('img/png');

    // 调用接口
    $.ajax({
        type: 'POST',
        url: '/my/update/avatar',
        data: { avatar: data },
        success: function(res) {
            if (res.status === 0) {
                // 调用父页面中函数，重新渲染头像区域
                window.parent.getLoad();
            }
            layer.msg(res.message);
        }
    });
});