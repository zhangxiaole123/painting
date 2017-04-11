jQuery(document).ready(function($) {
	//sign validata
	(function(){
		var bind = function(){
			$('.register').click(function(event) {
				validata($(this));
			});
			$('.signbtn').click(function(event) {
				validata($(this));
			});
			$('.J_set_btn').click(function(event) {
				validata($(this));
			});
			$('form').delegate('inpit', 'blur', function(event) {
				validata($(this));
			});
		};
		bind();
		var validata = function(element){
			var form = element.parents('form');
			form.validate({
			 	errorElement: "i",
			 	errorPlacement: function(error, element) {   
				   if (element.is(':input')) {
						element.parent().append('<i class="ero"></i>');
						element.css('border-color','red');
						element.parent('.form-radio').css('border-color','red');
						var ero = element.parent().find('.ero');
						ero.html(error);
					}
				},			
			 	rules: {
			 		//sign tishi
			 		email: {
			 	    required: true,
			 	    email: true
			 	   },
			 	   password: {
			 	    required: true,
			 	    minlength: 6
			 	   },
			 	   //New Account tishi
			 	   email2: {
			 	    required: true,
			 	    email: true
			 	   },
			 	   password2: {
			 	    required: true,
			 	    minlength: 6
			 	   },
			 	   confirm_password: {
			 	    required: true,
			 	    equalTo: "#password2"
			 	    },
			 	    //setting
			 	    name:{
			 	    	required: true,
			 	    },
			 	    tel:{
			 	    	required: true,
			 	    	minlength: 6
			 	    },
			 	    //chg-email
			 	    chg_emai:{
			 	    	required: true,
			 	   		email: true
			 	    },
			 	    confirm_chg_emai:{
			 	    	required: true,
			 	    	equalTo: "#email1"
			 	    },
			 	    //chg-password
			 	    old_password:{
			 	    	required: true,
			 	    	minlength: 6
			 	    },
			 	    new_password:{
			 	    	required: true,
			 	    	minlength: 6
			 	    },
			 	    confirm_passworded:{
			 	    	required: true,
			 	    	minlength: 6,
			 	    	equalTo: "#new_password"
			 	    },
			 	},
			 	messages: {
			 		new_password:"Password  format error, plese try again",
			 		confirm_passworded:"Password  Inconsistent, plese try again",
			 		chg_emai:"Mailboxes  incorrect, plese try again",
			 		confirm_chg_emai:"Mailboxes Inconsistent, plese try again",
			 		tel:"Phone format error, plese try again",
			 		name:"Nickname format error, plese try again",
			 		email:"Please enter a valid email address",
			 		password:" Password  input error,plese try again",
			 		email2: "The Email has been used,plese try again",
			 		password2:" Password  format error,plese try again",
			 		confirm_password: "Password  Inconsistent",
			 	},
			 	submitHandler :function (element){
			 		$.ajax({
			 			url: form.attr('data-url'),
			 			type: 'POST',
			 			dataType: 'JSON',
			 			data: form.serialize(),
			 		})			 		
			 	},
			});
		};
	})();
});
