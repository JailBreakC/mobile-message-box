var API = {
    get: 'http://5.vgee.sinaapp.com/s1/jsonp.php?callback=?',
    post: 'http://5.vgee.sinaapp.com/s1/jsonpost.php?callback=?'
}



var getData = function() {
    var content = [];
    $.getJSON(API.get).success(function(data) {
        $.each(data, function(i, msg) {
            var htmlStr = [
            '<div class="container">',
                '<div class="pic-ct">',
                    '<img src="http://pic.sc.chinaz.com/files/pic/pic9/201402/apic229.jpg" alt="">',
                '</div>',
                '<div class="text-ct">',
                    '<i class="iconfont like">&#xe600;</i>   ',
                    '<pre>'+msg.wall_message+'</pre>',
                    '<p class="user">-- <span>'+msg.wall_author+'</span></p>',
                    '<div class="acts">',
                        '<div class="act">',
                            '<i class="iconfont">&#xe600;</i>    ',
                            '<p>'+msg.wall_weither+'</p>',
                        '</div>',
                        '<div class="act">',
                            '<i class="iconfont">&#xe600;</i>',
                            '<p>'+msg.wall_addtime+'</p>',
                        '</div>',
                        '<div class="act">',
                            '<i class="iconfont">&#xe600;</i>',
                            '<p>'+msg.wall_city+'</p>',
                        '</div>',
                    '</div>',
                '</div>',
            '</div>'
            ]
            htmlStr = htmlStr.join(' ');

            content.push(htmlStr)
        })
        console.log(content);
        $('.big-ct').html(content.join('\n'));
    })
}

$(function() {

    getData();

});