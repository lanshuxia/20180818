var title;
var based,basem;//限制时长和文件大小

var file; //视频文件
var fileSize; //视频大小
var duration; //视频的时长
var videoDuration = 15; //选择的视频时15s 还是30s

$(function(){
    Init(); //初始化设置时长和大小
    tab(); //绑定tab切换
    button(); //绑定下一步
    sessionStorage.videoDuration = videoDuration;
    video(); //上传文件

    weixin()
});

/**初始化*/
function Init(){
    filePrevImg(15,30);
}

//判断是否在微信
function weixin(){
    document.addEventListener("WeixinJSBridgeReady",function() {
        document.getElementById('video').play()
    }, false);
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    //var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if(isAndroid){
        var video = document.querySelector('#video');
        var videobox = document.querySelector('.video-con');
        //播放时改变外层包裹的宽度，使video宽度增加，
        //相应高度也增加了,播放器控件被挤下去，配合overflow：hidden
        //控件看不见也触摸不到了
        function  setVideoStyle(){
            videobox.style.width = '80%';
            video.style.width = '100%';
            videobox.style.display = 'block';
        }
        setVideoStyle()
    }
}

/**上传文件*/
function video() {
    $('#videoForm').on('change',function(){//绑定videoForm文件选择事件
        file = $('#videoForm')[0].files[0];

        fileSize = this.files[0].size;
        var bases = fileSize/1024/1024;
        var objURL = getObjectURL(this.files[0]);//这里的objURL就是input file的真实路径
        sessionStorage.videoPath = objURL;
        $('.video-img').css('display', 'none');
        $('#video').attr('src',objURL);
        setTimeout(function () {
            if (document.getElementById('video')) {
                duration = Math.floor(document.getElementById('video').duration);
            }
            if(duration > based || bases > basem){
                $('#video').attr('src', '');
                alert("视频的时间不能超过"+based+"s视频大小不能超过"+ basem +"M");
                $('.video-img').css('display', 'block');
            }else{
                $('.video-img').css('display', 'none');
            }
            //清空file的值
            var fileVal = document.getElementById('videoForm');
            fileVal.value = ''; //虽然file的value不能设为有字符的值，但是可以设置为空值
        },500)


    });
}

//点击15s还是30s
function tab(){
    var tabTitle = $('.tab-title li');
    var tabDescribe = $('.tab-describe li');
    tabTitle.click(function(){

        $('#video').attr('src','');
        $('.video-img').css('display', 'block');
        video();
        var index = $(this).index();
        tabTitle.removeClass('tab-title-active').eq(index).addClass('tab-title-active');
        tabDescribe.removeClass('tab-describe-active').eq(index).addClass('tab-describe-active');
        title = $('.tab-title-active').html();
        if(title == '15s'){
            videoDuration = 15;
            filePrevImg(15,30);
        }else{
            videoDuration = 30;
            filePrevImg(30,60);
        }
        sessionStorage.videoDuration = videoDuration;
    })
}

//上传视频
function filePrevImg(d,m) {//只改变设置的参数大小,事件不需要重新绑定  ( videoForm change)
    based=d;
	basem=m;
}

//建立一個可存取到該file的url
function getObjectURL(file) {
    var url = null;
    if (window.createObjcectURL != undefined) {
        url = window.createOjcectURL(file);
    } else if (window.URL != undefined) {
        url = window.URL.createObjectURL(file);
    } else if (window.webkitURL != undefined) {
        url = window.webkitURL.createObjectURL(file);
    }
    return url;
}

//获取后台数据
function getIndexData() {
    var sendData = new FormData();
    //sendData.append("deviceNumber",sessionStorage.deviceNumber); //设备编号
    sendData.append("deviceNumber",867223025154659); //设备编号
    sendData.append("ip",returnCitySN.cip); //ip
    //sendData.append("userId",sessionStorage.userId*1); //上传用户
    sendData.append("userId",1); //上传用户
    sendData.append("file",file); //视频文件
    sendData.append("fileSize",fileSize); //视频大小
    sendData.append("videoDuration",sessionStorage.videoDuration); //视频时长 15s 30s

    $.ajax({
        type: 'post',
        url: host + 'weixin/video/upload',
        data:sendData,
        cache: true,
        contentType: false,
        processData: false,
        beforeSend:function(){
            index = layer.load(2,{
                shade:0.5,
            })
        },
        success: function (data) {
            console.log(data)
            if (data.status == 1) {//信息获取成功
                layer.close( index );
                //sessionStorage.setItem('videoPath',data.data.videoPath);
                //sessionStorage.videoPath = data.data.videoPath;
                window.location.href = "message.html"
            } else {
                layer.close( index );
                alert(data.msg);
            }
        },
        error: function (data) {
            alert("服务请求失败");
        }
    })
}
function button(){
    $('.ad-button').click(function(){
        if($('#video').attr('src') == ''){
            alert('您还没有上传视频，请上传视频！')
        }else{
            window.location.href = "message.html"
            //alert(1)
            //getIndexData();
        }
    })
}

