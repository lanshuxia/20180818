
//微信浏览器判断
function wxpay(prepay_id){
	alert(prepay_id)
	if (typeof WeixinJSBridge == "undefined"){
	   if( document.addEventListener ){
	       document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
	   }else if (document.attachEvent){
	       document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
	       document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
	   }
	}else{
	   onBridgeReady(prepay_id);
	}
}
var count=0;
//调起微信支付
function onBridgeReady(prepay_id){
	count++;
	//var  time = Date.parse(new Date());
//	var time=new Date().getTime();
	var timeStamp=Math.round(new Date().getTime()/1000).toString();
	var noceStr = Math.random().toString(36).substr(2);
	
	parm={
			"appId":"wx354c6df39bc7e275",//换成自己的appid
			"timeStamp":timeStamp,
			"nonceStr":noceStr,
			"package":"prepay_id="+prepay_id,
			"signType":"MD5"
	}
	
	var sign = getsign(parm);
  
	WeixinJSBridge.invoke(
       'getBrandWCPayRequest', {
           "timeStamp":timeStamp,//时间戳，自1970年以来的秒数     
           "appId":"wx354c6df39bc7e275",//公众号名称，由商户传入 //换成自己的appid
           "nonceStr":noceStr,//随机串     
           "package":"prepay_id="+prepay_id,     
           "signType":"MD5",//微信签名方式  
           "paySign":sign //微信签名 
       },
       function(res){  
           if(res.err_msg == "get_brand_wcpay_request:ok" ) {
               alert("支付成功")
        	   // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
        	   var a= Math.random() * 100;
        	   window.location.href = window.location.href+"?id="+a;
        	   window.location = "orderDetail.html";
           } else if(res.err_msg =="get_brand_wcpay_request:cancel"){
        	   alert("取消支付")
        	   var a= Math.random() * 100;
//        	   window.location.href = window.location.href+"?id="+a;
        	   
//        	   window.location = "orderList.html";
           } else{
        	   alert("支付失败")
        	   var a= Math.random() * 100;
        	   
//        	   window.location.href = window.location.href+"?id="+a;
//        	   window.location = "orderList.html";
           }    
       }
   ); 
}

//签名
function getsign(param){
	
	var array = new Array();
    for(var key in param) {
        array.push(key);
    }
     array.sort();
     
     // 拼接有序的参数名-值串
    var paramArray = new Array();
   
    for(var index in array) {
        var key = array[index];
        paramArray.push(key +'='+ param[key]);
    }
    paramArray.push("key=jieguikejiUTV3602014jiegui360201");//换成自己的key
    
    var md5Source = paramArray.join("&");
    console.log(md5Source);
    var digestString =md5(md5Source).toUpperCase();
       
    return digestString;
}

