var userIdnotSession=0;
$(function(){
	
	window.onpageshow = function(event){
		   if (event.persisted) {
		       window.location.reload();
		   }
		};
	
	 //getIndexData('abaf5d21d136a329');
		
    getIndexData( getUrlParams('deviceNumber'),getUrlParams('code'),getUrlParams('state') );
	
    
    increment();
    
    decrement();

    bottomAdaptation();

    addPic();

    goodsCommit();

    batteryCommit();

    imgCommit();
    
    maxMap();

    back();

})

var imgUrl; //图片路径
var batteryPrice; //充电宝价格

//底部适应
function bottomAdaptation(){
    var w = $('.weui-footer').height();
    $('#tab1,#tab2,#tab3').css({
        marginBottom:w
    })
};
//商品-增加数量
function increment() {
    $('.goodsList').delegate(".increment", "click", function () {
        clearTimeout( timer1 );
        $('#tab1 .total_mount span').children().remove();
        var count = $(this).parents( '.weui-media-box__desc' ).find('.mount').find('.mount_mount').text()*1
//        count=4;
        if ($(this).parent('.computer').children('input').val() >= count) {
            //$(this).parent('.computer').children('input').val(count);
            layer.msg("已达到购买最高量",{
                icon:5,
                time:1000
            });
        } else {
            $(this).parent('.computer').children('input').val($(this).parent('.computer').children('input').val() * 1 + 1)
            //总数量
            $('.weui-tab__bd-item--active').find('.total_mount').children('span').text( $('.weui-tab__bd-item--active').find('.total_mount').children('span').text()*1 + 1 )

            $('#tab1 .total_mount span').append( $('<span></span>').text('+1').css({
                color:'red'
            }).attr('class','fadeOutRight animated') );

            var timer1 =  setTimeout(function(){
                $('#tab1 .total_mount span').children().remove();
            },1000)

            //总价格
            var nowPrice =  $(this).parent().parent().find('.price_mount').text()*1
            $('.weui-tab__bd-item--active').find('.total_price').children('span').text(  ($('.weui-tab__bd-item--active').find('.total_price').children('span').text()*1 + nowPrice).toFixed(2) )
        }
    })
};

//商品-减少数量
function decrement() {
    $('.goodsList').delegate(".decrement", "click", function () {
        clearTimeout( timer2 );
        $('#tab1 .total_mount span').children().remove();

        if ($(this).parent('.computer').children('input').val() < 1) {
            $(this).parent('.computer').children('input').val(0);
        } else {
            $(this).parent('.computer').children('input').val($(this).parent('.computer').children('input').val() * 1 - 1)            //总数量
            //总数量
            $('.weui-tab__bd-item--active').find('.total_mount').children('span').text( $('.weui-tab__bd-item--active').find('.total_mount').children('span').text()*1 - 1 )

            $('#tab1 .total_mount span').append( $('<span></span>').text('-1').css({
                color:'red'
            }).attr('class','fadeOutRight animated') );

            var timer2 =  setTimeout(function(){
                $('#tab1 .total_mount span').children().remove();
            },1000)

            //总价格
            var nowPrice =  ($(this).parent().parent().find('.price_mount').text()*1).toFixed(2)
            $('.weui-tab__bd-item--active').find('.total_price').children('span').text(   ( $('.weui-tab__bd-item--active').find('.total_price').children('span').text()*1 - nowPrice).toFixed(2) )

        }
    })
};

//充电宝-数据线-数量增加/减少
function ba_increment(nowPrice){
    $('.weui-cells.weui-cells_checkbox').delegate("label","click",function(event){

        if($(this).find('.mount_mount').text()*1 != 0) {

            var boolean = $(this).find('input').prop('checked');
            var mount = $('.weui-tab__bd-item.weui-tab__bd-item--active').find('.total_mount').children().text() * 1;
            // var totalPrice = $('.weui-tab__bd-item.weui-tab__bd-item--active').find('.total_price').children().text() * 1;
            var currentPrice = $(this).find('.price_mount').text() * 1;
            switch (boolean) {
                case true:
                    // $('.weui-tab__bd-item.weui-tab__bd-item--active').find('.total_mount').children().text(mount + 1)
                    $('.weui-tab__bd-item.weui-tab__bd-item--active').find('.total_mount').children().text(2)
                    // $('.weui-tab__bd-item.weui-tab__bd-item--active').find('.total_price').children().text( (totalPrice + currentPrice).toFixed(2) )
                    $('.weui-tab__bd-item.weui-tab__bd-item--active').find('.total_price').children().text( (nowPrice*1 + currentPrice).toFixed(2) )
                    $(this).find('input').attr('checked',true);
                    break;
                case false:
                	$(this).find('input').attr('checked',false);
            }
        }else{
            $(this).find('input').attr('checked',false);
        }
    })


}

//添加图片
function addPic(){
    $("#uploaderInput").on("change",function(){
       
//    	imgUrl = this.files[0];
    	
       // if( imgUrl != undefined ){
        	
            var css=function(t,s){
                s=document.createElement('style');
                s.innerText=t;
                document.body.appendChild(s);
            };

            css('.weui-uploader__input-box:before{width:0}');
            css('.weui-uploader__input-box:after{width:0}');
                   
//            var objUrl = getObjectURL(imgUrl) ; //获取图片的路径，该路径不是图片在本地的路径
//            
//            $("#pic").attr("src", objUrl) ; //将图片路径存入src中，显示出图片
            
        //}
        imgUrl = this.files[0];
        
        $(this).val('');
        
        var objUrl = getObjectURL(imgUrl) ; //获取图片的路径，该路径不是图片在本地的路径
        if (objUrl) {
            $("#pic").attr("src", objUrl) ; //将图片路径存入src中，显示出图片
        }
    });

}



/**
 * 校验图片转换后大小并上传
 */
function checkAndHandleUpload(file) {
	
    imgBase64(file, function (image, canvas) {
        var maxSize = 2*1024*1024; // 2M
        var fileSize = file.size; // 图片大小

        if(fileSize > maxSize) { // 如果图片大小大于2m，进行压缩
            uploadSrc = canvas.toDataURL(file.type, fileSize/maxSize );
           // alert( uploadSrc )
           uploadFile = convertBase64UrlToFile(uploadSrc, file.name.split('.')[0]); // 转成file文件
        } else {
            //uploadSrc = image.src; //canvas.toDataURL(file.type,0.5);
            uploadFile = file;
        }
        
        var sendData = new FormData();
        if(sessionStorage.userId){
        	sendData.append('userId', sessionStorage.userId*1);//sessionStorage.userId
        }else{
        	sendData.append('userId', userIdnotSession*1);//sessionStorage.userId
        }
        sendData.append('deviceNumber',sessionStorage.deviceNumber);
        sendData.append('ip',returnCitySN.cip);
        sendData.append('file',uploadFile);
        $.ajax({
            type:'POST',
            url:host+'weixin/user/imgPrint',
            data:sendData,
            processData:false,
            contentType:false,
            dataType:"json",
            beforeSend:function(){
                index = layer.load(2,{
                    shade:0.5,
                })
            },
            success:function(data){ 
            	
                if(data.status == 1){
                    sessionStorage.orderId = data.data.orderId;
                    sessionStorage.prepay_id = data.data.prepayId;
//                    setTimeout(function(){
                        //清空已选图片
                        $('#tab3 #pic').attr('src','')
                    	window.location.href = 'imgOrderList.html';
                        layer.close( index );
//                    },3000);
                }else{
                    alert(data.msg);
                    layer.close( index );
                }

            },
            error:function(data){
                alert('网络错误');
                layer.close( index );
            }
        })        
        
        
        
        
       // var compressedSize = uploadFile.size / 1024 / 1024;
        //if(compressedSize.toFixed(2) > 2.00) {
           // checkAndHandleUpload(uploadFile);
       // } else {
            //document.getElementById('pic').src = uploadSrc;
        //}
    });
}

/**
 * 将图片转化为base64
 */
function imgBase64(file, callback) {
    var self = this;
    // 看支持不支持FileReader
    if (!file || !window.FileReader) return;
    // 创建一个 Image 对象
    var image = new Image();
    // 绑定 load 事件处理器，加载完成后执行
    image.onload = function(){
        // 获取 canvas DOM 对象
        var canvas = document.createElement('canvas');
        // 返回一个用于在画布上绘图的环境, '2d' 指定了您想要在画布上绘制的类型
        var ctx = canvas.getContext('2d');
        // 如果高度超标 // 参数，最大高度
        var MAX_HEIGHT = 2000; //6寸1440以上
        if(image.height > MAX_HEIGHT) {
            // 宽度等比例缩放 *=
            image.width *= MAX_HEIGHT / image.height;
            image.height = MAX_HEIGHT;
        }
        // 获取 canvas的 2d 环境对象,
        // 可以理解Context是管理员，canvas是房子
        // canvas清屏
        console.log('canvas.width:', canvas.width);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // 重置canvas宽高
        canvas.width = image.width;
        canvas.height = image.height;
        // 将图像绘制到canvas上
        ctx.drawImage(image, 0, 0, image.width, image.height);
        // !!! 注意，image 没有加入到 dom之中
        console.log(file.type);
        // console.log(canvas.toDataURL('image/jpeg',0.5));
        //----------//
        callback(image, canvas);
        //--------//
    };
    if (/^image/.test(file.type)) {
        // 创建一个reader
        var reader = new FileReader();
        // 将图片将转成 base64 格式
        reader.readAsDataURL(file);
        // 读取成功后的回调
        reader.onload = function () {
            // self.imgUrls.push(this.result);
            // 设置src属性，浏览器会自动加载。
            // 记住必须先绑定事件，才能设置src属性，否则会出同步问题。
            image.src = this.result;
        }
    }
}


/**
 * 将以base64的图片url数据转换为Blob
 * @param urlData
 *            用url方式表示的base64图片数据
 */
function convertBase64UrlToFile(urlData){

    var bytes=window.atob(urlData.split(',')[1]);        //去掉url的头，并转换为byte

    //处理异常,将ascii码小于0的转换为大于0
    var ab = new ArrayBuffer(bytes.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i);
    }

    return new Blob( [ab] , {type : 'image/png'});
}

//提交商品订单
function goodsCommit(){

    $('#tab1').delegate('.weui-btn.weui-btn_primary','click',function(){
        var mount = $('#tab1').find('.total_mount').children().text()*1;
        if( mount == 0 ){
            alert('请先选定商品')
        }else{

            var sendData = {};
            sendData.goodsCounts = [];
            sendData.goodsIds = [];
            sendData.userId = sessionStorage.userId*1;
            sendData.deviceNumber = sessionStorage.deviceNumber;
            sendData.ip = returnCitySN.cip
            $('#tab1 input').each(function(){
                if( $(this).val() != 0 ){
                    sendData.goodsCounts.push( $(this).val()*1 );
                    sendData.goodsIds.push( $(this).attr('data-goodsId')*1 )
                }

            })
            sendData.goodsCounts =  JSON.stringify( sendData.goodsCounts );

            sendData.goodsIds = JSON.stringify( sendData.goodsIds );
            $.ajax({
                type:'POST',
                url:host+'weixin/user/saveGoodsOrder',
                data: sendData,
                beforeSend:function(){
                    index = layer.load(2,{
                        shade:0.5,
                    })
                },
                success:function(data){
                	
                    if( data.status == 1 ){
                        sessionStorage.orderId = data.data.orderId;
                        sessionStorage.prepay_id = data.data.prepayId;
//                        setTimeout(function(){
                            //各商品数量清零
                            $('#tab1 input').val( 0 );

                            //商品总数量清零
                            $('.weui-tab__bd-item--active').find('.total_mount').children('span').text( 0 );

                            //商品价格清零
                            $('.weui-tab__bd-item--active').find('.total_price').children('span').text( 0 );
                        	
                            //跳转	
                        	window.location.href = "goodList.html"
                        	
                        	layer.close( index ); 
//                        },3000)
                    }else{
                       alert(data.msg)
                       window.location.reload();
                    }
                },
                error:function(data){
                    alert('提交失败')
                }
            })
        }
    })
}

//提交充电宝订单
function batteryCommit(){
    $('#tab2').delegate('.weui-btn.weui-btn_primary','click',function(){

        var sendData = {};

        sendData.userId = sessionStorage.userId*1;
        sendData.deviceNumber = sessionStorage.deviceNumber;
        sendData.ip = returnCitySN.cip;
        sendData.fgoods = [];
        $('#tab2 input[type=radio]').each(function(){

            if( $(this).prop('checked') ){
                sendData.fgoods.push( $(this).attr('data-fgoodsid')*1 )
            }
        })

        sendData.fgoods = sendData.fgoods.join(',');

        $.ajax({
            type:'POST',
            url:host+'weixin/user/toBatteryOrder',
            data:sendData,
            beforeSend:function(){
                index = layer.load(2,{
                    shade:0.5,
                })
            },
            success:function(data){
            	
                if( data.status == 1 ) {
	                      
                        sessionStorage.orderId = data.data.orderId;
                        sessionStorage.prepay_id = data.data.prepayId;
//                        setTimeout(function(){
    	                    //充电宝数据线选项清零
                            $('#tab2 input[type=radio]').attr('checked',false);

                            //充电宝商品总数量归1
                            $('.weui-tab__bd-item.weui-tab__bd-item--active').find('.total_mount').children().text(1);

                            //充电宝商品总价格还原
                            $('.weui-tab__bd-item.weui-tab__bd-item--active').find('.total_price').children().text( batteryPrice );
    	                  
                        	
                        	window.location.href = 'batteryList.html';
                        	
                        	layer.close( index ); 
//                        },3000);
                }else {
                    alert('提交失败');
                }

            },
            error:function(data){
                alert('提交错误')
            }
        })
    })
}

//照片订单提交
function imgCommit(){
    $('#tab3').delegate('.weui-btn.weui-btn_primary','click',function(){

    	var img_src = $('#pic').attr('src');
    	
    	
        if( !img_src  ){
            alert( '请先选择照片' );
        }else{
        	checkAndHandleUpload(imgUrl);

        }
    })
}

//建立一個可存取到該file的url
function getObjectURL(file) {
    var url = null ;
    if (window.createObjectURL!=undefined) { // basic
        url = window.createObjectURL(file) ;
    } else if (window.URL!=undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file) ;
    } else if (window.webkitURL!=undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file) ;
    }
    return url ;
}

//=====================================================首页数据请求处理==========================
 function getIndexData(deviceN,codeN,stateN){
     var sendData = {};
     sendData.deviceNumber = deviceN;
     sendData.code = codeN;
     sendData.state = stateN;
//     console.log("设备编号"+deviceN+"\n;code"+codeN+"\stateN"+stateN);
     
     $.ajax({
         type:'GET',
         url:host+'weixin/user/index',
         data:sendData,
         cache:true,
         success:function(data){
        	 if(data.status == 1){
        		 commodityCollection(data.data)
        		 console.log(data.data.deviceSetting);
        		 if(data.data.deviceSetting&&data.data.deviceSetting.isBatteryFunction==1){
        			 notBattery();
        		 }
        		 if(data.data.deviceSetting&&data.data.deviceSetting.isPrintFunction==1){
        			 notprintImg();
        		 }
        		// $("#isBatteryFunction").val(data.data.deviceSetting.isBatteryFunction);
        	 }else{
        		 alert(data.msg);
        		 
        	 }
         },
         error:function(data){
             alert("服务请求失败");
         }
     })
 }

//function getIndexData(deviceN){
//    $.ajax({
//        type:'POST',
//        url:host+'weixin/user/index?deviceNumber='+deviceN,
//        success:function(data){
//            if(data.status == 1){
//                commodityCollection(data.data);
//            }else {
//                alert('请求错误');
//            }
//        },
//        error:function(data){
//            alert("服务请求失败")
//        }
//    })
//}


function commodityCollection(data){
    //商品合集
	
	
	data.goods.forEach(function(item,index){
		var countStr="";
		if(item.count==0){
			countStr="<span class='show_out'>(售罄)</span>"
		}
        var goods = '<div class="weui-media-box__hd"  style="width: 25%">\n' +
            '                                <img class="weui-media-box__thumb" src='+ item.thumbnailUrl + '>\n' +
            '                            </div>\n' +
            '                            <div class="weui-media-box__bd">\n' +
            '                                <h4 class="weui-media-box__title">' + item.goodsName+countStr + '</h4>\n' +
            '                                <p class="weui-media-box__desc">\n' +
            '                                    <span class="price">\n' +
            '                                        <span class="price_title">价格</span>: ￥<span class="price_mount">'+ item.price +'</span>\n' +
            '                                    </span>\n' +
            '                                    <span class="mount" style="visibility: hidden">\n' +
            '                                        <span class="mount_title">数量</span>: <span class="mount_mount">'+ item.count +'</span>\n' +
            '                                    </span>\n' +
            '\n' +
            '                                    <span class="computer">\n' +
            '                                        <img src="../img/decrement.png" alt="" class="decrement"><input type="number" disabled="disabled" value="0" data-goodsId="'+ item.goodsId +'" ><img\n' +
            '                                            src="../img/increment.png" alt="" class="increment">\n' +
            '                                    </span>\n' +
            '\n' +
            '                                </p>';
        
            var $div = $('<div></div>').attr('class','weui-media-box weui-media-box_appmsg').html(goods);
            $('.weui-panel__bd').append($div);
    } )

    //数据线商品
   /* $.each(data.fgs,function(index,item){
    	
        var fgs = '<div class="weui-cell__hd">\n' +
            '                            <input type="radio" class="weui-check" name="good"  data-fgoodsId="'+ item.goodsId +'" id="s1'+(index*1 + 1)+'">\n' +
            '                            <i class="weui-icon-checked"></i>\n' +
            '                        </div>\n' +
            '                        <div class="weui-media-box weui-media-box_appmsg">\n' +
            '                            <div class="weui-media-box__hd">\n' +
            '                                <img class="weui-media-box__thumb" src="'+ item.url +'">\n' +
            '                            </div>\n' +
            '                            <div class="weui-media-box__bd">\n' +
            '                                <h4 class="weui-media-box__title">'+ item.goodsName +'</h4>\n' +
            '                                <p class="weui-media-box__desc">\n' +
            '                                    <span class="price">\n' +
            '                                        <span class="price_title">价格</span>: ￥<span class="price_mount">'+ item.price +'</span>\n' +
            '                                    </span>\n' +
            '                                    <span class="mount">\n' +
            '                                        <span class="mount_title">数量</span>: <span class="mount_mount">'+ 2 +'</span>\n' +
            '                                    </span>\n' +
            '                                </p>\n' +
            '                            </div>\n' +
            '                        </div>';

        var $div = $('<label></label>').attr({
            'class':'weui-cell weui-check__label',
            'for':'s1'+(index*1 + 1)
        }).html(fgs);

        $('.weui-cells.weui-cells_checkbox').append($div);

    })*/

    //充电宝押金
    batteryPrice = data.deposit;
    $('#tab2').find('.weui-cells.weui-cells_checkbox').prev().find('.price_mount').text( data.deposit )

    ba_increment( data.deposit );

    //支付金额初始化
    $('#tab2').find('.total_price').children().text( data.deposit )

    //照片打印价格
    $('#tab3 .total_price').children().text(data.imgPrice)

    //用户id
    // $('.userInfo').attr('data-id',data.userId);
    userIdnotSession=data.userId
    sessionStorage.userId = data.userId;
    //设备编号
    sessionStorage.deviceNumber = data.deviceNumber;
}

function getUrlParams(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); //定义正则表达式
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}


//点击地图全屏
function maxMap(){

    map.addEventListener("click", function(e){   //点击事件
    	
        if(!e.overlay){

        	window.location.href="map.html"
        	
        }
        	
    })

}

//点击返回主页
function back(){
    $('.back').click(function(){
        
    	window.location.reload();
    })
} 
//当充电宝功能未开放时
function notBattery(){
	$("#tab2").text("抱歉该功能暂未开放");
}
function notprintImg(){
	$("#tab3").text("抱歉该功能暂不能使用");
}




