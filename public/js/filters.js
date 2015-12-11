$(document).ready(function($) {
	$activeFilters = [];

	$('a.filter').click(function(){
		$(this).toggleClass('active');
		filterToggle($(this).attr('data-filter'));
		refreshFilters();
	});

	function filterToggle(name) {
		if ($activeFilters[name] == undefined || $activeFilters[name] == 'inactif') {
			 $activeFilters[name] = 'actif';
		} else {
			$activeFilters[name] = 'inactif';
		}
	}

	function refreshFilters() {
		$i = 0;
		for ($filter in $activeFilters) {
			if ($activeFilters[$filter] == 'actif') $i++;
		}
		$i ? filter() : showAll();
	}

	function showAll() {
		$('a.filter').removeClass('active');
		$('.title').fadeIn('fast');
		$('.content.active').slideDown('fast');
	}
	function filter() {
		$('.title').hide();
		$('.content').hide();
		for ($filter in $activeFilters) {
			if ($activeFilters[$filter] == 'actif') {
				$('.label[data-label="'+$filter+'"]').parent('.title').fadeIn('fast');
				$('.label[data-label="'+$filter+'"]').parent('.title').next('.content.active').slideDown('fast');
			}
		}
	}
});