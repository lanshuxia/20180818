
var map;
var infoWindow;//消息窗口
var point1;
var devideNumber = 1; //设备台数
var p_value = 90;

var times = 1;//天数
var timeType = 1;
//var deviceId = sessionStorage.deviceNumber; //设备编号
var deviceId = 867223025154659;
var checkedDevices=[]; //存放设备号

$(function(){
    videoCon()
    getLocation()
    extracted();
    getIndexData()
    orderBtn()
})

function videoCon(){
        document.addEventListener("WeixinJSBridgeReady",function() {
            document.getElementById('video-img').play()
        }, false);
        var u = navigator.userAgent;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
        //var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        if(isAndroid){
            $('#video-img').attr('controls','controls')
            var video = document.querySelector('#video-img');
            var videobox = document.querySelector('.video');
            //播放时改变外层包裹的宽度，使video宽度增加，
            //相应高度也增加了,播放器控件被挤下去，配合overflow：hidden
            //控件看不见也触摸不到了
            function  setVideoStyle(){
                videobox.style.width = '50%';
                video.style.width = '100%';
                videobox.style.display = 'block';
            }
            setVideoStyle()
        }
        $('#video').attr('src',sessionStorage.videoPath);
}

/*切换*/
function extracted() {
    var timeList = $('.time-list li');
    var timeItem = $('.time-item li');

    timeList.click(function () {
        var index = $(this).index();
        timeList.removeClass('list-active').eq(index).addClass('list-active');
        timeItem.removeClass('item-active').eq(index).addClass('item-active');

        var time = $(this).html();
        if(time == '按天'){
            timeType = 1;
            p_value=90;
            total()
        }else{
            timeType = 2;
            p_value=280;
            total()
        }
    })
}


//计算总价格
function total(){
    $('.total-price').html(p_value*devideNumber*times);
}

$(function(){
    $('.add').click(function(){
        addClick();
    });
    $('.minus').click(function(){
        minusClick();
    })
})

//增加数量
function addClick(){
    if(devideNumber > 0 ){
        var number = $('.number').val($('.number').val()*1+1).val();
        times = number;
        total()
    }else{
        alert('请选择设备！')
    }

}

//减少数量
function minusClick(){
    var number = $('.number').val($('.number').val()*1-1).val();
    if(number<1){
        var number = $('.number').val(1);
    }else{
        times = number;
        total()
    }
}

/*设备编号*/
function EquipmentNumber(data){
    var installNumber = $('.install-number ul');
    $.each(data,function(index,item){
        //默认选中设备
        var install;
        if(item.device_number == deviceId){
            install = '<li id=' + item.device_name + ' class="active devideName">' + item.device_name + '</li>';
            checkedDevices.push(item.device_number);
        }else{
            install = '<li id=' + item.device_name + '>' + item.device_name + '</li>';
        }
        installNumber.append(install);
    })
    listLi(data)
}

//点击获取信息框
function showInfo(thisMarker,point) {
    var obj = sessionStorage.getItem('point1');
    var pointObj = JSON.parse(obj);
    var pointA = new BMap.Point(pointObj.lng,pointObj.lat);
    var pointB = new BMap.Point(thisMarker.point.lng,thisMarker.point.lat);
    var polyline = new BMap.Polyline([pointA,pointB], {strokeColor:"#0FC1DB", strokeWeight:1, strokeStyle:'dashed', strokeOpacity:0.6});  //定义折线
    map.addOverlay(polyline);     //添加折线到地图上

    var sContent =
        '<ul style="margin:0 0 5px 0;padding:0.2em 0;">'
        +'<li style="line-height: 15px;font-size: 12px;">'
        +'<span style="width: 50px;display: inline-block;">编号：</span><span id="numberingname" style="display: inline-block;">'+ + point.device_name + '</span></li>'
        +'<li style="line-height: 15px;font-size: 12px;">'
        +'<span style="width: 50px;display: inline-block;">名称：</span>' + point.address + '</li>'
        +'<li style="line-height: 15px;font-size: 12px;">'
        +'<span style="width: 50px;display: inline-block;">距离：</span>' + ((map.getDistance(pointA,pointB).toFixed(2))/1000) + '千米</li>'
        +'<li style="display: none">'
        +'<span style="width: 50px;display: inline-block;">编号：</span><span id="number" style="display: inline-block;">'+ point.device_number + '</span></li>'
        +'</ul>';
    infoWindow = new BMap.InfoWindow(sContent); //创建信息窗口对象
    thisMarker.openInfoWindow(infoWindow); //图片加载完后重绘infoWindow
    document.getElementById("r-result").innerHTML = infoWindow.getContent();
    numberingNum();
    total();
}

//获取信息窗中的编码信息
function numberingNum(){
    var numberNum  = $('#numberingname').html();
    //如果是默认选中的
    if($("#" + numberNum).hasClass('active')){
        $("#" + numberNum).addClass('devideName');
    }else{ //如果不是默认选中的
        if (!$("#" + numberNum).hasClass('devideName')) {
            $("#" + numberNum).addClass('devideName');
            checkedDevices.push($('#number').html());
        } else {
            $("#" + numberNum).removeClass('devideName');
            //同时移除消息窗口
            infoWindow.close();
            checkedDevices = $.grep(checkedDevices,function(value){
                return value != $('#number').html()
            })
        }
    }
    devideNumber = $('.install-number li.devideName').length;
}

//点击设备编号对应地图标注点
function listLi(data) {
    $('.install-number ul li').click(function () {
        total();
        var installNumber = $(this).html();
        $.each(data, function (index, item) {
            if (item.device_name == installNumber) {
                var point = new BMap.Point(item.lon, item.lat)
                var marker1 = new BMap.Marker(point); //将点转化成标注点
                map.addOverlay(marker1); //将标注点添加到地图上
                showInfo(marker1, item)
            }
        })
    })
}

//定位
function getLocation(){
    var url ='https://api.map.baidu.com/location/ip?ip&ak=4qMufTkWyNaIWPCSMI1g4tkHWqwW4uRG&coor=bd09ll'
    $.ajax({
        type: "GET",
        dataType: "jsonp",
        url: url,
        success:function(data){
            if(data.status == 0){
                sessionStorage.lon = data.content.point.x;
                sessionStorage.lat = data.content.point.y;
            }else{
                alert('定位失败！')
            }
        },
        error:function(){
            alert("服务请求失败");
        }
    })
}


//创建地图
function createMap(){
    map = new BMap.Map("container");
    map.addControl(new BMap.MapTypeControl());
    map.enableScrollWheelZoom(true);
    map.centerAndZoom( "深圳");
    map.setCurrentCity("深圳");
    return map;
}

//创建标注点并添加到地图中
function addMarker(points) {
    var map = createMap();
    point1 = new BMap.Point(sessionStorage.lon,sessionStorage.lat);
    var last=JSON.stringify(point1)
    map.centerAndZoom(point1, 0);
    map = Icon(map,point1,0);
    sessionStorage.setItem("point1", last);

    //循环建立标注点
    for(var i=0, pointsLen = points.length; i<pointsLen; i++) {
        var point = new BMap.Point(points[i].lon, points[i].lat); //将标注点转化成地图上的点
        var marker = new BMap.Marker(point); //将点转化成标注点
        map.addOverlay(marker);  //将标注点添加到地图上
        //添加监听事件
        (function() {
            var thePoint = points[i];
            marker.addEventListener("click",
                function() {
                    showInfo(this,thePoint);
                });
        })();
    }
}

//创建自定义标注点   中心点
function Icon(map, point, index){  // 创建图标对象
    var myIcon = new BMap.Icon("http://api.map.baidu.com/img/markers.png", new BMap.Size(23, 25), {
        // 指定定位位置。
        // 当标注显示在地图上时，其所指向的地理位置距离图标左上
        // 角各偏移10像素和25像素。您可以看到在本例中该位置即是
        // 图标中央下端的尖角位置。
        anchor: new BMap.Size(10, 25),
        // 设置图片偏移。
        // 当您需要从一幅较大的图片中截取某部分作为标注图标时，您
        // 需要指定大图的偏移位置，此做法与css sprites技术类似。
        imageOffset: new BMap.Size(0, 0 - index * 25)   // 设置图片偏移
    });
    // 创建标注对象并添加到地图
    var marker = new BMap.Marker(point, {icon: myIcon});
    map.addOverlay(marker);
    return map;
}

//请求后台 周边设备
function getIndexData() {
    var sendData = {};
    sendData.lon = sessionStorage.lon;
    sendData.lat = sessionStorage.lat;
    $.ajax({
        type: 'post',
        url: host + 'weixin/video/suroundDevices',
        data:sendData,
        cache: true,
        success: function (data) {
            EquipmentNumber(data.data)
            if (data.status == 1) {//信息获取成功
                addMarker(data.data)
            } else {
                alert('信息获取失败')
            }
        },
        error: function () {
            alert("服务请求失败");
        }
    })
}


//请求后台 确认订单
function confirmOrder(){
    var sendData = {};

    sendData.deviceNumber = 867223025154659; //设备编号
    //sendData.deviceNumber = sessionStorage.deviceNumber; //设备编号
    //sendData.userId = sessionStorage.userId*1; //上传用户
    sendData.userId = 1; //上传用户
    sendData.ip = returnCitySN.cip; //用户ip
    sendData.videoPath = sessionStorage.videoPath; //视频路径
    sendData.checkedDevices = checkedDevices; //选择投放的设备
    sendData.checkedDevices = sendData.checkedDevices.join(',');
    sendData.timeType = timeType; //时间类型 1-天  2-周
    sendData.playDuration = times; //投放时长
    sendData.videoDuration = sessionStorage.videoDuration; //视频时长 15-15s 30-30s
    $.ajax({
        type: 'post',
        url: host + '/weixin/video/saveVideoOrder',
        data:sendData,
        cache: true,
        success: function (data) {
            if (data.status == 1) {//信息获取成功
                pay(data.data.prepayId)
            } else {
                alert(data.msg);
            }
        },
        error: function (data) {
            alert("服务请求失败");
        }
    })
}

function orderBtn(){
    $('.orderBtn').click(function(){
        if(checkedDevices === undefined || checkedDevices.length == 0){
            alert('请选择设备！')
        }else{
            confirmOrder()
        }
    })
}
//支付
function pay(prepayid){
    var index = layer.load(2,{
        shade:0.5,
    })
    setTimeout(function () {
        layer.close( index );
        wxpay(prepayid);
    }, 1200);
}
