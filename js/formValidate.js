// JavaScript Document
(function($){
	$.fn.inputValidate = function(obj){
		var regular = {
			'email':  /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
			'url':  /^http(s?):\/\/(?:[A-za-z0-9-]+\.)+[A-za-z]{2,4}(:\d+)?(?:[\/\?#][\/=\?%\-&~`@[\]\':+!\.#\w]*)?$/,
			'currency':  /^\d+(\.\d+)?$/,
			'number':  /^\d+$/,
			'zip':/^\d{6}$/,
			'integer':/^[-\+]?\d+$/,
			'double':/^[-\+]?\d+(\.\d+)?$/,
			'english':/^[A-Za-z]+$/,
			'mobile':/^0?(1[3587][0-9]|14[57])[0-9]{8}$/,
			'passwd':/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/,
			'integer_nozero':/^[1-9]\d*$/,
			'price':/^(([0-9]|([1-9][0-9]{0,9}))((\.[0-9]{1,2})?))$/,
			'phone':/^(\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$/,
			'qq':/^[1-9]{1}[0-9]{4,10}$/,
			'idcard':/^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/,
			'bank_card':/^(\d{16}|\d{19})$/,
		};
		var formName = $(this).attr('name');
		if(obj){
			for(var i=0; i<obj.length;i++){
				error = true;
				if(obj[i].rule=='required'){
					if(!$(this).val()){
						_error(formName,obj[i].msg);
						break;
					}
				}else if(obj[i].type){
					//验证两个值对比
					if(obj[i].type == 'contrast'){
						var active = '';
						active = contrast(formName,obj[i].rule);
						if(!active){
							_error(formName,obj[i].msg);
							break;
						}
					}
					//验证自定义方法
					if(obj[i].type == 'function'){
						var active ='';
						active = eval(obj[i].rule+"()");
						if(active == false){
							_error(formName,obj[i].msg);
							break;
						}
					}
				}else if(obj[i].rule=='optional'){
					//验证选填内容
					if($(this).val() == null || $(this).val() == ''){
						error = false;
					}else{
						eval("var regularName = regular."+$(this).attr('name'));
						if(!regularName.test($(this).val())){
							_error(formName,obj[i].msg);
							break;
						}
					}
				}else{
					//默认验证
					eval("var regularName = regular."+obj[i].rule);
					if(!regularName.test($(this).val())){
						_error(formName,obj[i].msg);
						break;
					}
				}
			}
		}
		//对比两个对象的的值是否相同
		function contrast(a,b){
			if($('input[name='+ a +']').val()!=$('input[name='+ b +']').val()){
				return false;
			}else{
				return true;
			}
		}

		function _error(formNmae,msg){
			error = false;
			$('input[name='+formNmae+']').parent().siblings('.msg').text(msg).css({'color':'#ff0000'});
		}
		if(error){
			$('input[name='+formName+']').parent().siblings('.msg').text('').removeAttr('style');
		}
		return error;
	}
	
	$.fn.formValidate = function(object){
		var error = true;
		$(this).find('input').blur(function(){
			var formName = $(this).attr('name');
			
		    eval("var obj = object."+formName);
			error = $(this).inputValidate(obj);
		});
		$(this).find('input').focus(function(){
			var placeholder = $(this).attr('placeholder');
			$(this).parent().siblings('.msg').removeAttr('style').text(placeholder);
		})
		
		$(this).submit(function(){
			$(this).find("input").each(function(){
				var formName = $(this).attr('name');
				eval("var obj = object."+formName);
				error = $(this).inputValidate(obj);
			});
			if(error==false)
			{
				return false;
			}
			return true;
		})
	}
})(jQuery);

/*
* type:方法目前两个参数，一个对比方法，一个自定义方法
* 对比方法：contrast
* 自定义方法：function
*
* 调用自定方法：rule属性传入方法名称，并且必须返回是否执行成功：true，false
*
* 对比方法：rule属性传入方法名称传入对比值的name，目前必须是input
* */


