var weitherAPI = 'http://api.openweathermap.org/data/2.5/weather?appid=44db6a862fba0b067b1930da0d769e98&lang=zh&callback=?&q='
var transitionend = "transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd";

var API = {
    get: 'http://5.vgee.sinaapp.com/s1/jsonp.php?callback=?',
    post: 'http://5.vgee.sinaapp.com/s1/jsonpost.php?callback=?'
}

var icons = {
    '01': '&#xe604;',
    '02': '&#xe603;',
    '03': '&#xe606;',
    '04': '&#xe601;',
    '09': '&#xe600;',
    '10': '&#xe607;',
    '11': '&#xe602;',
    '13': '&#xe608;',
    '50': '&#xe605;'
}

var PICS = 20;

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
    data.time = date.getMonth() + 1 + '/' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes();
    var currentWeither = weitherAPI + data.location;

    $.getJSON(currentWeither).success(function(weither) {
        if(weither.cod == '404') {
            data.temp = 0;
            data.weither = '未知';
            return;
        }
        data.temp = (weither.main.temp - 273.15).toFixed(0);
        data.weither = weither.weather[0].description;
        data.w_icon = weither.weather[0].icon.slice(0,2);
        

    }).fail(function() {
        console.log('fail');
        data.temp = '未知'

    }).always(function() {
        console.log('done');
        data.img = $('.thumb').attr('src');
        if(data.img == "1pxgray.png") {
            data.img = 'http://7xp0x5.com1.z0.glb.clouddn.com/photo'+Math.ceil(PICS * Math.random())+'.png';
        }

        cb(data);

    });
}

var userData;

var postData = function(ele) {
    var wall_author = userData.user,
        wall_message = userData.text.replace(/\n/g, '/_rt/'),
        wall_weither = userData.weither,
        wall_city = userData.location;
        wall_w_icon = userData.w_icon;
        wall_img = userData.img;
    var param =  '&wall_author='+wall_author
                +'&wall_message='+wall_message
                +'&wall_weither='+wall_weither
                +'&wall_city='+wall_city
                +'&wall_w_icon='+wall_w_icon
                +'&wall_img='+wall_img;
    console.log(param);
    $.getJSON(API.post + param).success(function(data) {
        ele.waiting = false;
        if(data.success) {
            window.location.href="list.html"
        }else {
            alert(data);
        }
    })
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
            userData = data;
            console.log(data);
            $(this).removeClass('circle');
            $('.edit').toHide().one(transitionend, function(){
                $(this).unbind(transitionend).hide();
                $('.preview').show().find('#prepre').text(data.text).end()
                    .find('#picture').attr('src', data.img).end()
                    .find('#i-temp').html(icons[data.w_icon]).end()
                    .find('#temp').text(data.weither).end()
                    .find('#time').text(data.time).end()
                    .find('#loc').text(data.location).end()
                    .find('.user span').text(data.user).end();
                    setTimeout(function(){
                        $('.preview').toShow();
                    })

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

    $('.go').click(function() {
        if(this.waiting) {
          return;
        }
        this.waiting = true;
        postData(this);
    })

    // $('.mask').click(function() {
    //     alert('程序员大爷正在开发图片上传功能呢，敬请期待')
    // })

    $('#picture').click(function() {
        userData.img = 'http://7xp0x5.com1.z0.glb.clouddn.com/photo'+Math.ceil(PICS * Math.random())+'.png'
        $(this).attr('src', userData.img);
    })
}
//***************************
//
//sdf
//sdf
var guid = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

var previewImage = function(file, callback){

    //确保文件是图片
    if(!file || !/image\//.test(file.type)) return; 

    //gif使用FileReader进行预览,因为mOxie.Image只支持jpg和png
    if(file.type=='image/gif'){

        var fr = new mOxie.FileReader();
        fr.onload = function(){
            callback(fr.result);
            fr.destroy();
            fr = null;
        }

        fr.readAsDataURL(file.getSource());

    }else{

        var preloader = new mOxie.Image();

        preloader.onload = function() {
            preloader.downsize( 300, 300 );//先压缩一下要预览的图片,宽300，高300
            var imgsrc = preloader.type=='image/jpeg' ? preloader.getAsDataURL('image/jpeg', 80) : preloader.getAsDataURL(); //得到图片src,实质为一个base64编码的数据
            callback && callback(imgsrc); //callback传入的参数为预览图片的url
            preloader.destroy();
            preloader = null;
        };

        preloader.load( file.getSource() );
    }   
}


plupload.addFileFilter('limit_sharp', function(sharp, file, cb) {

    if(!sharp) {
        cb(true);
        return;
    }

    if( Object.prototype.toString.call( sharp ) !== '[object Array]' ) {
        cb(true);
        return;
    }

    var _width = sharp[0];
    var _height = sharp[1];
    var _minWidth = sharp[2];
    var _sharp = _width / _height;

    var that = this;
    var img = new mOxie.Image();

    img.load(file.getSource());

    img.onload = function() {
        finalize(img);
    };

    img.onerror = function() {
        finalize(false);
    };

    var finalize = function(img) {
        if(!img) { 
            cb(false);
            return; 
        };

        console.log(img.width);
        console.log(img.height);

        var _realSharp = img.width / img.height;
        var deltaSharp = Math.abs(_sharp - _realSharp);

        if(deltaSharp > 0.01) {
            that.trigger('Error', {
                code : -888,
                message : 'File sharp error.',
                file: file,
                img: {
                    width: _width,
                    height: _height
                }
            });
            cb(false)
        } else if(_minWidth && img.width < _minWidth) {
            that.trigger('Error', {
                code : -889,
                message : 'File size too small.',
                file: file,
                img: {
                    width: _width,
                    height: _height
                }
            });
            cb(false)
        }
        else {
            cb(true);
        }
    }
});

/**
 * @param  {DOM object} 初始化图片上传dom
 * @param  {JSON object} '签名数据'
 * @param  {string} size 图片大小 '200kb'
 * @param  {string/array} sharp 图片宽度/高度比例 false为不限制 为数组时：[比例，最小宽度]；
 * @param  {function} successCallBack 成功回调函数
 * @return {[type]}
 */

initUploader = function(ele, data, _size, _sharp, successCallBack) {
    var policy = data.policy;   

    var uploader = new plupload.Uploader({

        runtimes : 'html5,flash,silverlight,html4',

        browse_button : $(ele).find('.mask')[0],

        container: ele,

        flash_swf_url : 'plupload/Moxie.swf',

        silverlight_xap_url : 'plupload/Moxie.xap',

        url : policy.host,

        multi_selection: false,

        multipart_params: {

            'policy': policy.policyBase64,

            'OSSAccessKeyId': policy.accessid, 

            'success_action_status' : '200', //让服务端返回200,不然，默认会返回204

            'signature': policy.signature,
            
            'callback': policy.callback

        },

        filters: {
          mime_types : [
            { title : "Image files", extensions : "jpg,jpeg,png,gif" },
          ],
          max_file_size: _size,
          limit_sharp : _sharp
        },

        init: {
            PostInit: function() {
                this._$ele = $(ele);
                this._$imgCt = this._$ele.find('.img-ct');
                // this._$mask = this._$ele.find('.mask');
                this._$thumb = this._$ele.find('.thumb');
                this._$count = this._$ele.find('.iconfont');
            },

            FilesAdded: function(up, files) {

                //file为plupload事件监听函数参数中的file对象,callback为预览图片准备完成的回调函数
                this._$ele.addClass('uploading');
                this._filename = guid() + '.jpg';
                // this._$mask.show();

                up.setOption({
                    multipart_params: {

                        'Filename': this._filename,

                        'key' : this._filename,

                        'policy': policy.policyBase64,

                        'OSSAccessKeyId': policy.accessid, 

                        'success_action_status' : '200', //让服务端返回200,不然，默认会返回204

                        'signature': policy.signature,
                        
                        'callback': policy.callback
                    }
                });

                var that = this;

                plupload.each(files, function(file) {
                    //预览图片
                    previewImage(file, function(imgSrc) {
                        // that._$mask.show()
                        that._$thumb.attr('src', imgSrc);
                    })
                    uploader.start();
                });

            },

            UploadProgress: function(up, file) {
                this._$count.text(file.percent.toFixed(0) + '%');
                // this._$mask.height( (1 - file.percent / 100) * this._$imgCt.height() );
            },

            FileUploaded: function(up, file, info) {
                this._$ele.removeClass('uploading');
                this._$count.remove();
                // this._$mask.hide().height('100%');

                if (info.status >= 200 || info.status < 200)
                {
                    console.log('done');
                    this._$thumb.attr('src', policy.host + '/' + this._filename);
                    successCallBack(info);
                }
                else
                {
                    console.log(info.response);
                }
            },

            Error: function(up, err) {

                this._$ele.removeClass('uploading');

                var config = {}

                if(err.code == -888) {
                    config.text = '请选择分辨率为 '+err.img.width+' * '+err.img.height+' 的图片';
                } else if(err.code == -889) {
                    config.text = '请选择分辨率为 '+err.img.width+' * '+err.img.height+' 的图片';
                } else if(err.code == -600) {
                    config.text = '图片大小超出限制';
                } else if(err.code == -601) {
                    config.text = '文件格式错误';
                } else if(err.code == -200) {
                    config.text = '上传错误，请重试';
                } else {
                    config.text = err.message;
                }

                $.popup(config)._openPop();

                console.log(err);
            }
        }
    });
    uploader.init();

}




$(function() {

    FastClick.attach(document.body);

    init();

    $.get('http://api.vgee.cn:8080/policy').success(function(data) {

        initUploader($('.pic-ct')[0], data, '2048kb', false, function(info) {
            console.log('success');
        });

    });
})
