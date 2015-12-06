var weitherAPI = 'http://api.openweathermap.org/data/2.5/weather?appid=2de143494c0b295cca9337e1e96b00e0&lang=zh&callback=?&q='
var transitionend = "transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd";


$.fn.toShow = function() {
    return $(this).removeClass('hide').addClass('show');
}
$.fn.toHide = function() {
    return $(this).removeClass('show').addClass('hide');
}

var loadUserMsg = function(cb) {
    var data = {},
        date = new Date();
        ipLoc = window.remote_ip_info;

    data.text = $('.edit #msg').val();
    data.location = ipLoc.city || ipLoc.province || '北京';
    data.time = date.getMonth() + '/' + date.getDate();
    var currentWeither = weitherAPI + data.location;

    $.getJSON(currentWeither).success(function(weither) {
        if(weither.cod == '404') {
            data.temp = 0;
            data.weither = '未知';
            return;
        }
        data.temp = (weither.main.temp - 273.15).toFixed(0);
        data.weither = weither.weather[0].description;
        
    }).fail(function() {

        data.temp = 'null'

    }).done(function() {

        cb(data);

    });
}

var init = function() {

    $('#msg').textareaAutoSize().focus();

    $('.submit').click(function(e) {
        e.preventDefault();
        var user = Cookies.get('user');
        if(!user) {
            user = window.prompt('你叫什么呢？（小于10个字符)','');
            if(!user) {
                user = window.prompt('别淘气，你叫啥？','');
            }
            if(user.length > 10) {
                user = window.prompt('名字太非主流不好（小于10个字符)', user);
            }
            Cookies.set('user', user, { expires: 1000, path: '/' });
        }

        if(!$('.edit #msg').val()) {
            alert('总得说点什么吧');
            return;
        }

        $(this).addClass('circle')

        loadUserMsg(function(data) {

            data.user = user;
            console.log(data);
            $(this).removeClass('circle');
            $('.edit').toHide().one(transitionend, function(){
                $(this).unbind(transitionend).hide();
                $('.preview').show().find('#prepre').text(data.text).end()
                    .find('#temp').text(data.weither).end()
                    .find('#time').text(data.time).end()
                    .find('#loc').text(data.location).end()
                    .find('.user span').text(data.user);

                setTimeout(function(){
                    $('.preview').toShow(); 
                });

            });

        }.bind(this))
    })

    $('.ret').click(function() {
        $('.preview').toHide().one(transitionend, function() {
            $(this).unbind(transitionend).hide();
            $('.edit').show() 
            setTimeout(function(){
                $('.edit').toShow(); 
            })
        })
    })
}

$(function() {

    FastClick.attach(document.body);

    init();
})

// var test = function() {
//     var arr = [];
//     var str = 'http://openweathermap.org/img/w/';
//     var html = '';
//     for(i=1;i<999;i++) {
//         var num = '';
//         var ss = '';
//         if(i<10) {
//             num = '0' + i;
//         } else {
//             num = '' + i;
//         }
//         ss = str + num + 'd.png';
//         html += '<img src="' + ss + '">\n';
//     }
//     console.log(html);
//     $('#test').html(html);
// }
// test();