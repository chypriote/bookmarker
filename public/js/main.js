$(document).ready(function($) {
	// activation des modules semanticUI
	$('.ui.accordion').accordion({exclusive:false});
	$('select.dropdown').dropdown();
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

	$('.vertical.menu i.add.icon').click(function() {
		if ($('#inputCategory').val() != "")
			$('#formAddCategory').submit();
	});
	// Mobile: rotation du dropdown quand on affiche les filtres
	$('#filters').click(function() {
		$('.item.filter').slideToggle();
		$(this).find('.dropdown').toggleClass('rotated');
	});
	// Les filtres inutilisés sont cachés lors de l'activation d'un filtre
	$('.item.filter').click(function() {
		if ($(this).hasClass('reset'))
			$('.item.filter').slideDown();
		else
			$('.item.filter').not('.reset').not($(this)).removeClass('active').slideUp();
	});
	// Changement de l'affichage des cards
	$('#layout').click(function() {
		$(this).find('i').toggleClass('list layout sidebar');
		$('#post-cards .post-description').slideToggle();
		// $('#post-cards .extra').toggle();
	});

	//Activation du filtre
	$('#mixer').mixItUp	({
		layout: {
			display: 'block'
		// },
		// controls: {
		// 	toggleFilterButtons: true,
		// 	toggleLogic: 'and'
		},
		load: {
			sort: 'date:desc'
		}
	});
	$('#post-cards').mixItUp	({
		layout: {
			display: 'flex'
		},
		load: {
			sort: 'date:desc'
		}
	});
});
