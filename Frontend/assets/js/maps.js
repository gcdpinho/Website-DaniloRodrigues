function initMap() {
	var template = "<div>\
						<p>Comitê de Campanha<br>\
							Participe!\
						</p>\
					</div>";

	var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -31.770191, lng: -52.342045},
        scrollwheel: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        streetViewControl: false,
        mapTypeControl: false,
        zoom: 17
    });

	var infoWindow = new google.maps.InfoWindow({
	    content: template,
	    maxWidth: 200
	});

	var marker = new google.maps.Marker({
        position: { lat: -31.770191, lng: -52.342045 },
        map: map,
        icon: "Content/img/logo_danilo.png",
        title: "Comitê de Daniel Rodrigues"
    });
    infoWindow.open(map, marker);
}
