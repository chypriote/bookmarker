$(document).ready(function($) {
	$('.main.menu').visibility({type: 'fixed'});
	$('.overlay').visibility({
		type: 'fixed',
		offset: 80
	});

	// show dropdown on hover
	$('.main.menu	.ui.dropdown').dropdown({on: 'hover'});


	$('.deleteUser').click(function(e){
		e.preventDefault();
		var confirmdel = confirm('Are you sure ?');
		var id =$(this).attr('rel');
		if (confirmdel) {
			$.ajax({
				type: 'DELETE',
				url: '/users/'+ id
			}).done(function(response){
				if (response.msg != '') {
					alert('Error: ' + response.msg);
				} else {
					$('#'+id).remove();
				}
			});
		} else {return false;}
	});
	$('.deleteCategory').click(function(e){
		e.preventDefault();
		$('form').addClass('loading');
		var confirmdel = confirm('Are you sure ?');
		var id =$(this).attr('rel');
		if (confirmdel) {
			$.ajax({
				type: 'DELETE',
				url: '/category/'+ id
			}).done(function(response){
				if (response.msg != '') {
					alert('Error: ' + response.msg);
				} else {
					$('#'+id).remove();
				}
			});
		}
		$('form').removeClass('loading');
	});
	$('.deletePost').click(function(e){
		e.preventDefault();
		$('form').addClass('loading');
		var confirmdel = confirm('Are you sure ?');
		var id =$(this).attr('rel');
		if (confirmdel) {
			$.ajax({
				type: 'DELETE',
				url: '/posts/'+ id
			}).done(function(response){
				if (response.msg != '') {
					alert('Error: ' + response.msg);
				} else {
					$('#'+id).remove();
				}
			});
		}
		$('form').removeClass('loading');
	});


	$('.ui.accordion').accordion();
	$('select.dropdown').dropdown();
});
