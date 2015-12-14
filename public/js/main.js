$(document).ready(function($) {
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

	$('.vertical.menu h3.header').click(function(e) {
			$check = $(this).find('.dropdown');
			$check.toggleClass('rotated');
			if ($check.hasClass('rotated')) {
				$('.item.filter').slideUp()
			} else {
				if ($('.item.filter.active').length > 1){
					$('.item.filter.active').slideDown();
					$('.item.filter.reset').slideDown();
				} else {
					$('.item.filter').not('.reset').slideDown();
				}
			}
	});
	$('.item.filter').click(function() {
		$a = $('.item.filter').not($(this)).not('.reset');
		$(this).hasClass('active')?$a.slideDown():$a.slideUp();
		$(this).hasClass('active')?$('.item.reset').slideUp():$('.item.reset').slideDown();
	});

	$('.ui.accordion').accordion();
	$('select.dropdown').dropdown();
	$('#mixer').mixItUp	({
		layout: {
			display: 'block'
		// },
		// controls: {
		// 	toggleFilterButtons: true,
		// 	toggleLogic: 'and'
		}
	});
});
