$(document).ready(function($) {
	// activation des modules semanticUI
	$('.ui.accordion').accordion({exclusive:false});
	$('select.dropdown').dropdown();
	$('.main.menu	.ui.dropdown').dropdown({on: 'hover'});
	$('.ui.image img')
	  .visibility({
	    type       : 'image',
	    transition : 'fade in',
	    duration   : 1000
	  })
	;

	$('.deletePost').click(function(e){
		e.preventDefault();
		$('#categoryName').html($(this).attr('data-name'));
		$('.modal').attr('data-id', $(this).attr('data-id'));
		$('.modal').attr('data-type', $(this).attr('data-type'));

		$('.modal')
			.modal({
				onApprove: function(){
					$id = $(this).attr('data-id');
					$type = $(this).attr('data-type');
					$.ajax({
						type: 'DELETE',
						url: '/' + $type + '/edit/' + $id
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
		console.log($('#inputCategory'));
		if ($('#inputCategoryBot').val() != "")
			$('#formAddCategoryBot').submit();
		else if ($('#inputCategoryTop').val() != "")
			$('#formAddCategoryTop').submit();
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
		},
		callbacks: {
			onMixEnd: function(state) {
				state.$show.each(function(){
					if (state.activeFilter != '.mix')
						$('.accordion').accordion('open', $(this).index());
					else
						$('.accordion').accordion('close', $(this).index());
				});
			}
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
	$('#table-mixer').mixItUp({
		layout: {
			display: 'table-row'
		},
		load: {
			sort: 'date:desc'
		}
	});
});
