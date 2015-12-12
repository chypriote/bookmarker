$(document).ready(function($) {
	$('.main.menu').visibility({type: 'fixed'});
	$('.overlay').visibility({
		type: 'fixed',
		offset: 80
	});

	// show dropdown on hover
	$('.main.menu	.ui.dropdown').dropdown({on: 'hover'});

	$('.delete').click(function(e){
		e.preventDefault();
		$('#categoryName').html($(this).attr('data-name'));
		$('.modal').attr('data-id', $(this).attr('data-id'));
		$('.modal')
			.modal({
				onApprove: function(){
					$id = $(this).attr('data-id');
					$.ajax({
						type: 'DELETE',
						url: window.location.pathname + '/' + $id
					}).done(function(response){
						console.log(response);
						if (response.msg != '') {
							alert('Error: ' + response.msg);
						} else {
							$('#'+$id).remove();
						}
					});
				}
			})
			.modal('show');
	});

	$('.ui.accordion').accordion();
	$('select.dropdown').dropdown();
	$('#mixer').mixItUp	({
		layout: {
			display: 'block'
		},
		controls: {
			toggleFilterButtons: true,
			toggleLogic: 'and'
		}
	});
});
