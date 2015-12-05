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

    data.text = $('.edit #msg').val() || ' ';
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
        $(this).addClass('circle')
        loadUserMsg(function(data) {
            console.log(data);
            $(this).removeClass('circle');
            $('.edit').toHide().one(transitionend, function(){
                $(this).hide();
                $('.preview').show().find('#prepre').text(data.text).end()
                    .find('#temp').text(data.weither).end()
                    .find('#time').text(data.time).end()
                    .find('#loc').text(data.location).end()
                    .toShow()

            });;
        }.bind(this))
    })
}

$(function() {

    FastClick.attach(document.body);

    init();
})