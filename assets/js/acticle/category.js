 /*********获取服务器的信息渲染到页面************/
 function render() {
     // 清空原来的表格里的内容
     $('tbody').html('');
     $.ajax({
         url: '/my/article/cates',
         success: function(res) {
             var html = template('tpl-render', res);
             $('tbody').append(html);
         }
     });
 }
 render();


 /*********点击添加类别************/
 // 1、调用layui内置模块，弹出层，
 var addIndex;
 $('#add').click(function() {
     addIndex = layer.open({
         type: 1,
         title: '添加文章分类',
         content: $('#tpl-add').html(), //这里content是一个普通的String，
         area: ['500px', '300px']
     });
 });
 //  2、点击确认提交，往服务器新增加一条数据，重新渲染页面
 //  因为是动态创建的，用事件委托
 $(document).on('submit', '#form-add', function(e) {
     // 阻止默认跳转
     e.preventDefault();
     //  获取表单各项的数据
     var data = $(this).serialize();
     $.post('/my/article/addcates', data, function(res) {
         layer.msg(res.message);
         if (res.status == 0) {
             layer.close(addIndex);
             render();
         }
     })
 });

 /*********点击删除************/
 //到模板中给删除按钮添加自定义属性，值为从服务器获取过来的id值
 $('tbody').on('click', '.btndel', function() {
     var id = $(this).data('id');
     layer.confirm('确定删除吗?', { icon: 3, title: '提示' }, function(index) {
         $.ajax({
             url: '/my/article/deletecate/' + id,
             success: function(res) {
                 layer.msg(res.message);
                 if (res.status == 0) {
                     render();
                 }
             }
         });
         layer.close(index);
     });
 });

 /*********点击编辑************/
 //1、获取从服务器返回的数据，回填给弹出层
 var editIndex;
 $('tbody').on('click', '.btnedit', function() {
     var id = $(this).data('id');
     $.ajax({
         url: '/my/article/cates/' + id,
         success: function(res) {
             var html = template('tpl-edit', res);
             editIndex = layer.open({
                 type: 1,
                 title: '编辑类别',
                 content: html, // 内容在HTML中
                 area: ['500px', '250px']
             });
         }
     });
 });
 //2、点击确认修改，更新数据
 $(document).on('submit', '#form-edit', function(e) {
     e.preventDefault();
     // 获取表单数据
     var data = $(this).serialize();
     console.log(data);
     $.ajax({
         type: 'POST',
         url: '/my/article/updatecate',
         data: data,
         success: function(res) {
             layer.msg(res.message);
             if (res.status == 0) {
                 render();
                 layer.close(editIndex);
             }
         }
     });
 });