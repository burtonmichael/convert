var formMask = document.formMask;

function generate () {
	var blanks = []
	for (var i = 0, countryLength = droplist["co"].length; i < countryLength; i++) {
		var country = droplist["co"][i];
		for (var j = 0, cityLength = droplist["co"][i]["ci"].length; j < cityLength; j++) {
			var city = country["ci"][j];
			if (city["l"].length === 0) {
				blanks.push([i,j]);
			} else {
				var locations = city["l"];
				for (var k = 0, locationsLength = locations.length; k < locationsLength; k++) {
					locations[k]["n"] = mask(city["n"], locations[k]["n"]);
				};
				city["l"] = locations;
			}
			country["ci"][j] = city;
		};
		droplist["co"][i] = country;
	};

	for (var i = blanks.length - 1; i >= 0; i--) {
		var indexCountry = blanks[i][0],
			indexCity = blanks[i][1];
		droplist["co"][indexCountry]["ci"].splice(indexCity, 1);
	};

	var vars =	"var isoLanguage = \"" + formMask.isoLanguage.value + "\"," +
					"\ncountry = \"" + formMask.country.value + "\"," +
					"\ncity = \"" + formMask.city.value + "\"," +
					"\nloc = \"" + formMask.loc.value + "\"," +
					"\nemptySelect = \"" + formMask.empty.value + "\"," +
					"\npickup = \"" + formMask.pickup.value + "\"," +
					"\npickupDate = \"" + formMask.pickupDate.value + "\"," +
					"\npickUpTime = \"" + formMask.pickupTime.value + "\"," +
					"\ndropoffDate = \"" + formMask.dropoffDate.value + "\"," +
					"\ndropOffTime = \"" + formMask.dropoffTime.value + "\"," +
					"\ndriverAgeBetween = \"" + formMask.driverAgeBetween.value + "\"," +
					"\ndriverAge = \"" + formMask.driverAge.value + "\"," +
					"\nsearch = \"" + formMask.search.value + "\"," +
					"\nerrorSelectCountry = \"" + formMask.errorSelectCountry.value + "\"," +
					"\nerrorSelectCity = \"" + formMask.errorSelectCity.value + "\"," +
					"\nerrorSelectLocation = \"" + formMask.errorSelectLocation.value + "\"," +
					"\nairportTranslation = \"Airport\"," +
					"\nairportTranslationLANG = \"" + formMask.airport.value + "\"," +
					"\ndownTownTranslation = \"Downtown\"," +
					"\ndownTownTranslationLANG = \"" + formMask.downtown.value + "\"," +
					"\ntrainStationTranslation = \"Train Station\"," +
					"\ntrainStationTranslationLANG = \"" + formMask.trainstation.value + "\"," +
					"\nterminalTranslation = \"Terminal\"," +
					"\nterminalTranslationLANG = \"" + formMask.terminal.value + "\"," +
					"\nhotelTranslation = \"Hotel\"," +
					"\nhotelTranslationLANG = \"" + formMask.hotel.value + "\"," +
					"\nallAreasTranslation = \" (All areas)\";";

	$('#result').val(vars + "\nvar droplist = " + JSON.stringify(droplist));
}

function loadLanguage () {
	delete window.droplist; 
	$.getScript('languages/dropList_' + formMask.language.value + '.js', function(data, textStatus) {
		if (textStatus === "success") {
			$('#warning').slideUp();
			formMask.language.disabled = true;
			$('#btnCompile').attr('disabled', false)
			$('#btnLanguage').text('loaded').attr('disabled', true)
		}
	}).fail(function(){
		alert('Failed to load language.');
		$('#warning').slideDown();
	});
}

function loadFields () {
	$.each($('input[type="text"]'), function(index, val) {
		if (!($(this).is(':disabled'))) {
			$(this).val($(this).prop('placeholder'));
		}
	});
}

function mask (argExp, argText) {
	var t = argText,
		c = argExp;
	t.indexOf(c) >= 0 && (t = t.replace(c, "#"));
	t.indexOf(airport) >= 0 && (t = t.replace(airport, "@"));
	t.indexOf("Airport") >= 0 && (t = t.replace("Airport", "!"));
	t.indexOf(downtown) >= 0 && (t = t.replace(downtown, "&"));
	t.indexOf("Downtown") >= 0 && (t = t.replace("Downtown", "$"));
	t.indexOf(trainstation) >= 0 && (t = t.replace(trainstation, "£"));
	t.indexOf("Train Station") >= 0 && (t = t.replace("Train Station", "*"));
	t.indexOf(terminal) >= 0 && (t = t.replace(terminal, "^"));
	t.indexOf("Terminal") >= 0 && (t = t.replace("Terminal", "~"));
	t.indexOf(hotel) >= 0 && (t = t.replace(hotel, "€"));
	t.indexOf("Hotel") >= 0 && (t = t.replace("Hotel", "¥"));
	return t;
}