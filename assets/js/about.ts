let About = {
	initialize: () => {
		About.loadEvents();
	},
	loadEvents: () => {
		About.loadInstafeed();
		About.loadParallax();
		// About.loadGithubActivity();
	},
	loadParallax: () => {
		$(window).on('scroll', () => {
			window.requestAnimationFrame(() => {
				let scrolled = $(window).scrollTop();
				$('.splash-img').css({
					'transform': 'translate3d(0,' + scrolled * -0.3 + 'px, 0)'
				});
			});
		});
	},
	loadGoogleMaps: () => {
		google.maps.event.addDomListener(window, 'load', init);
		var map, markersArray = [];

		function bindInfoWindow(marker, map, location) {
			google.maps.event.addListener(marker, 'click', function () {
				function close(location) {
					location.ib.close();
					location.infoWindowVisible = false;
					location.ib = null;
				}

				if (location.infoWindowVisible === true) {
					close(location);
				} else {
					markersArray.forEach(function (loc, index) {
						if (loc.ib && loc.ib !== null) {
							close(loc);
						}
					});

					var boxText = document.createElement('div');
					boxText.style.cssText = 'background: #fff;';
					boxText.classList.add('md-whiteframe-2dp');

					function buildPieces(location, el, part, icon) {
						if (location[part] === '') {
							return '';
						} else if (location.iw[part]) {
							switch (el) {
								case 'photo':
									if (location.photo) {
										return '<div class="iw-photo" style="background-image: url(' + location.photo + ');"></div>';
									} else {
										return '';
									}
									break;
								case 'iw-toolbar':
									return '<div class="iw-toolbar"><h3 class="md-subhead">' + location.title + '</h3></div>';
									break;
								case 'div':
									switch (part) {
										case 'email':
											return '<div class="iw-details"><i class="material-icons" style="color:#4285f4;"><img src="//cdn.mapkit.io/v1/icons/' +
												icon + '.svg"/></i><span><a href="mailto:' + location.email + '" target="_blank">' +
												location.email + '</a></span></div>';
											break;
										case 'web':
											return '<div class="iw-details"><i class="material-icons" style="color:#4285f4;"><img src="//cdn.mapkit.io/v1/icons/' +
												icon + '.svg"/></i><span><a href="' + location.web + '" target="_blank">' + location.web_formatted +
												'</a></span></div>';
											break;
										case 'desc':
											return '<label class="iw-desc" for="cb_details"><input type="checkbox" id="cb_details"/><h3 class="iw-x-details">Details</h3><i class="material-icons toggle-open-details"><img src="//cdn.mapkit.io/v1/icons/' +
												icon + '.svg"/></i><p class="iw-x-details">' + location.desc + '</p></label>';
											break;
										default:
											return '<div class="iw-details"><i class="material-icons"><img src="//cdn.mapkit.io/v1/icons/' +
												icon + '.svg"/></i><span>' + location[part] + '</span></div>';
											break;
									}
									break;
								case 'open_hours':
									var items = '';
									for (var i = 0; i < location.open_hours.length; ++i) {
										if (i !== 0) {
											items += '<li><strong>' + location.open_hours[i].day + '</strong><strong>' + location.open_hours[
												i].hours + '</strong></li>';
										}
										var first = '<li><label for="cb_hours"><input type="checkbox" id="cb_hours"/><strong>' +
											location.open_hours[0].day + '</strong><strong>' + location.open_hours[0].hours +
											'</strong><i class="material-icons toggle-open-hours"><img src="//cdn.mapkit.io/v1/icons/keyboard_arrow_down.svg"/></i><ul>' +
											items + '</ul></label></li>';
									}
									return '<div class="iw-list"><i class="material-icons first-material-icons" style="color:#4285f4;"><img src="//cdn.mapkit.io/v1/icons/' +
										icon + '.svg"/></i><ul>' + first + '</ul></div>';
									break;
							}
						} else {
							return '';
						}
					}

					boxText.innerHTML =
						buildPieces(location, 'photo', 'photo', '') +
						buildPieces(location, 'iw-toolbar', 'title', '') +
						buildPieces(location, 'div', 'address', 'location_on') +
						buildPieces(location, 'div', 'web', 'public') +
						buildPieces(location, 'div', 'email', 'email') +
						buildPieces(location, 'div', 'tel', 'phone') +
						buildPieces(location, 'div', 'int_tel', 'phone') +
						buildPieces(location, 'open_hours', 'open_hours', 'access_time') +
						buildPieces(location, 'div', 'desc', 'keyboard_arrow_down');

					var myOptions = {
						alignBottom: true,
						content: boxText,
						disableAutoPan: true,
						maxWidth: 0,
						pixelOffset: new google.maps.Size(-140, -40),
						zIndex: null,
						boxStyle: {
							opacity: 1,
							width: '280px'
						},
						closeBoxMargin: '0px 0px 0px 0px',
						infoBoxClearance: new google.maps.Size(1, 1),
						isHidden: false,
						pane: 'floatPane',
						enableEventPropagation: false
					};

					location.ib = new InfoBox(myOptions);
					location.ib.open(map, marker);
					location.infoWindowVisible = true;
				}
			});
		}

		function init() {
			var mapOptions = {
				center: new google.maps.LatLng(35.29943588555779,-93.84887800000001),
				zoom: 3,
				gestureHandling: 'auto',
				fullscreenControl: false,
				zoomControl: true,
				disableDoubleClickZoom: true,
				mapTypeControl: false,
				scaleControl: true,
				scrollwheel: false,
				streetViewControl: false,
				draggable: true,
				clickableIcons: false,
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				styles: [{
					"stylers": [{
						"hue": "#ff1a00"
					}, {
						"invert_lightness": true
					}, {
						"saturation": -100
					}, {
						"lightness": 33
					}, {
						"gamma": 0.5
					}]
				}, {
					"featureType": "water",
					"elementType": "geometry",
					"stylers": [{
						"color": "#2D333C"
					}]
				}, {
					"featureType": "road",
					"elementType": "geometry",
					"stylers": [{
						"color": "#eeeeee"
					}, {
						"visibility": "simplified"
					}]
				}, {
					"featureType": "road",
					"elementType": "labels.text.stroke",
					"stylers": [{
						"visibility": "off"
					}]
				}, {
					"featureType": "administrative",
					"elementType": "labels.text.stroke",
					"stylers": [{
						"color": "#ffffff"
					}, {
						"weight": 3
					}]
				}, {
					"featureType": "administrative",
					"elementType": "labels.text.fill",
					"stylers": [{
						"color": "#2D333C"
					}]
				}]
			}
			var mapElement = document.getElementById('mapkit-google-map');
			var map = new google.maps.Map(mapElement, mapOptions);
			var locations = [
				{ "title": "Miami", "address": "Miami, FL, USA", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "", "lat": 25.7616798, "lng": -80.19179020000001, "vicinity": "Miami", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": true, "email": true, "enable": true, "int_tel": true, "open": true, "open_hours": true, "photo": true, "tel": true, "title": true, "web": true } }, { "title": "Reethi Beach Resort Maldives", "address": "Maldives", "desc": "", "tel": "660-2626", "int_tel": "+960 660-2626", "email": "", "web": "", "web_formatted": "", "open": "", "time": "", "lat": 5.25625, "lng": 73.163725, "vicinity": "Maldives", "open_hours": [{ "day": "Monday", "hours": "12am–12pm" }, { "day": "Tuesday", "hours": "12am–12pm" }, { "day": "Wednesday", "hours": "12am–12pm" }, { "day": "Thursday", "hours": "12am–12pm" }, { "day": "Friday", "hours": "12am–12pm" }, { "day": "Saturday", "hours": "12am–12pm" }, { "day": "Sunday", "hours": "12am–12pm" }], "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": true, "email": true, "enable": true, "int_tel": true, "open": true, "open_hours": true, "photo": true, "tel": true, "title": true, "web": true } }, { "title": "Cozumel", "address": "Cozumel, Quintana Roo, Mexico", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "", "lat": 20.4229839, "lng": -86.9223432, "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": true, "email": true, "enable": true, "int_tel": true, "open": true, "open_hours": true, "photo": true, "tel": true, "title": true, "web": true } }, { "title": "New York", "address": "New York, NY, USA", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "", "lat": 40.7127837, "lng": -74.00594130000002, "vicinity": "New York", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": true, "email": true, "enable": true, "int_tel": true, "open": true, "open_hours": true, "photo": true, "tel": true, "title": true, "web": true } }, { "title": "Portland", "address": "Portland, OR, USA", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "", "lat": 45.52306220000001, "lng": -122.67648159999999, "vicinity": "Portland", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": true, "email": true, "enable": true, "int_tel": true, "open": true, "open_hours": true, "photo": true, "tel": true, "title": true, "web": true } }, { "title": "Seattle", "address": "Seattle, WA, USA", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "", "lat": 47.6062095, "lng": -122.3320708, "vicinity": "Seattle", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": true, "email": true, "enable": true, "int_tel": true, "open": true, "open_hours": true, "photo": true, "tel": true, "title": true, "web": true } }, { "title": "Japan", "address": "Japan", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "", "lat": 36.204824, "lng": 138.252924, "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": true, "email": true, "enable": true, "int_tel": true, "open": true, "open_hours": true, "photo": true, "tel": true, "title": true, "web": true } }, { "title": "California", "address": "California, USA", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "", "lat": 36.778261, "lng": -119.41793239999998, "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": true, "email": true, "enable": true, "int_tel": true, "open": true, "open_hours": true, "photo": true, "tel": true, "title": true, "web": true } }, { "title": "Maldives", "address": "Maldives", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "", "lat": 1.9772276, "lng": 73.53610100000003, "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": true, "email": true, "enable": true, "int_tel": true, "open": true, "open_hours": true, "photo": true, "tel": true, "title": true, "web": true } }, { "title": "Paris", "address": "Paris, France", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "", "lat": 48.85661400000001, "lng": 2.3522219000000177, "vicinity": "Paris", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": true, "email": true, "enable": true, "int_tel": true, "open": true, "open_hours": true, "photo": true, "tel": true, "title": true, "web": true } }, { "title": "Vancouver", "address": "Vancouver, BC, Canada", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "", "lat": 49.2827291, "lng": -123.12073750000002, "vicinity": "Vancouver", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": true, "email": true, "enable": true, "int_tel": true, "open": true, "open_hours": true, "photo": true, "tel": true, "title": true, "web": true } }, { "title": "Cancún", "address": "Cancún, Quintana Roo, Mexico", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "", "lat": 21.161908, "lng": -86.85152790000001, "vicinity": "Cancún", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": true, "email": true, "enable": true, "int_tel": true, "open": true, "open_hours": true, "photo": true, "tel": true, "title": true, "web": true } }, { "title": "Soufriere Bay", "address": "Soufriere Bay", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "", "lat": 13.8492638, "lng": -61.067514700000004, "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": true, "email": true, "enable": true, "int_tel": true, "open": true, "open_hours": true, "photo": true, "tel": true, "title": true, "web": true } }, { "title": "Ladera Resort", "address": "Jalousle, Saint Lucia", "desc": "", "tel": "(758) 459-6600", "int_tel": "+1 758-459-6600", "email": "", "web": "", "web_formatted": "", "open": "", "time": "", "lat": 13.8328294, "lng": -61.0510956, "vicinity": "St. Lucia", "open_hours": [{ "day": "Monday", "hours": "12am–12pm" }, { "day": "Tuesday", "hours": "12am–12pm" }, { "day": "Wednesday", "hours": "12am–12pm" }, { "day": "Thursday", "hours": "12am–12pm" }, { "day": "Friday", "hours": "12am–12pm" }, { "day": "Saturday", "hours": "12am–12pm" }, { "day": "Sunday", "hours": "12am–12pm" }], "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": true, "email": true, "enable": true, "int_tel": true, "open": true, "open_hours": true, "photo": true, "tel": true, "title": true, "web": true } }, { "title": "Paresa Resort Phuket", "address": "49 Moo 6 Layi - Nakalay rd, Kamala, อำเภอ กะทู้ ภูเก็ต 83150, Thailand", "desc": "", "tel": "076 302 000", "int_tel": "+66 76 302 000", "email": "", "web": "", "web_formatted": "", "open": "", "time": "", "lat": 7.932839999999999, "lng": 98.26249099999995, "vicinity": "49 Moo 6 Layi - Nakalay rd, Kamala", "open_hours": [{ "day": "Monday", "hours": "7am–11pm" }, { "day": "Tuesday", "hours": "7am–11pm" }, { "day": "Wednesday", "hours": "7am–11pm" }, { "day": "Thursday", "hours": "7am–11pm" }, { "day": "Friday", "hours": "7am–11pm" }, { "day": "Saturday", "hours": "7am–11pm" }, { "day": "Sunday", "hours": "7am–11pm" }], "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": true, "email": true, "enable": true, "int_tel": true, "open": true, "open_hours": true, "photo": true, "tel": true, "title": true, "web": true } }, { "title": "Chatrium Hotel Riverside Bangkok", "address": "Wat Phraya Krai, Bang Kho Laem, Bangkok 10120, Thailand", "desc": "", "tel": "02 307 8888", "int_tel": "+66 2 307 8888", "email": "", "web": "", "web_formatted": "", "open": "", "time": "", "lat": 13.711127, "lng": 100.50907400000006, "vicinity": "", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": true, "email": true, "enable": true, "int_tel": true, "open": true, "open_hours": true, "photo": true, "tel": true, "title": true, "web": true } }, { "title": "Santhiya Koh Yao Yai Resort & Spa", "address": "88 หมู่.7, พรุใน, เกาะยาว, Phang Nga 82160, Thailand", "desc": "", "tel": "076 592 888", "int_tel": "+66 76 592 888", "email": "", "web": "", "web_formatted": "", "open": "", "time": "", "lat": 7.984179999999999, "lng": 98.56718000000001, "vicinity": "88 หมู่.7, พรุใน, เกาะยาว", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": true, "email": true, "enable": true, "int_tel": true, "open": true, "open_hours": true, "photo": true, "tel": true, "title": true, "web": true } }, { "title": "Bangkok", "address": "Bangkok, Thailand", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "", "lat": 13.7563309, "lng": 100.50176510000006, "vicinity": "Bangkok", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": true, "email": true, "enable": true, "int_tel": true, "open": true, "open_hours": true, "photo": true, "tel": true, "title": true, "web": true } }, { "title": "Wat Arun", "address": "Wat Arun, Bangkok Yai, Bangkok 10600, Thailand", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "", "lat": 13.7437024, "lng": 100.48602819999996, "vicinity": "Wat Arun", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": true, "email": true, "enable": true, "int_tel": true, "open": true, "open_hours": true, "photo": true, "tel": true, "title": true, "web": true } }, { "title": "Loh Samah Bay", "address": "Andaman Sea, ตำบล อ่าวนาง อำเภอเมืองกระบี่ กระบี่ Thailand", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "", "lat": 7.674409600000001, "lng": 98.76667950000001, "vicinity": "Andaman Sea", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": true, "email": true, "enable": true, "int_tel": true, "open": true, "open_hours": true, "photo": true, "tel": true, "title": true, "web": true } }, { "title": "Phang-nga", "address": "Phang-nga, Thailand", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "", "lat": 8.4501414, "lng": 98.52553169999999, "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": true, "email": true, "enable": true, "int_tel": true, "open": true, "open_hours": true, "photo": true, "tel": true, "title": true, "web": true } }, { "title": "Mo'orea", "address": "Mo'orea, French Polynesia", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "", "lat": -17.5388435, "lng": -149.82952339999997, "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": true, "email": true, "enable": true, "int_tel": true, "open": true, "open_hours": true, "photo": true, "tel": true, "title": true, "web": true } }, { "title": "Tahiti", "address": "Tahiti, French Polynesia", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "", "lat": -17.6509195, "lng": -149.42604210000002, "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": true, "email": true, "enable": true, "int_tel": true, "open": true, "open_hours": true, "photo": true, "tel": true, "title": true, "web": true } }, { "title": "Manava Beach Resort & Spa", "address": "Moorea, French Polynesia", "desc": "", "tel": "40 55 17 50", "int_tel": "+689 40 55 17 50", "email": "", "web": "", "web_formatted": "", "open": "", "time": "", "lat": -17.480633, "lng": -149.8033315, "vicinity": "Moorea", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": true, "email": true, "enable": true, "int_tel": true, "open": true, "open_hours": true, "photo": true, "tel": true, "title": true, "web": true } }, { "title": "Garza Blanca Preserve Resort & Spa", "address": "Carretera a Barra de Navidad, Col. Zona Hotelera Sur, 48390 Puerto Vallarta, Jal., Mexico", "desc": "", "tel": "(877) 845-3791", "int_tel": "+1 877-845-3791", "email": "", "web": "", "web_formatted": "", "open": "", "time": "", "lat": 20.5539481, "lng": -105.26427330000001, "vicinity": "Carretera a Barra de Navidad, Col. Zona Hotelera Sur, Puerto Vallarta", "open_hours": [{ "day": "Monday", "hours": "open24hours" }, { "day": "Tuesday", "hours": "open24hours" }, { "day": "Wednesday", "hours": "open24hours" }, { "day": "Thursday", "hours": "open24hours" }, { "day": "Friday", "hours": "open24hours" }, { "day": "Saturday", "hours": "open24hours" }, { "day": "Sunday", "hours": "open24hours" }], "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": true, "email": true, "enable": true, "int_tel": true, "open": true, "open_hours": true, "photo": true, "tel": true, "title": true, "web": true } }, { "title": "Hacienda Encantada Resort & Spa", "address": "Carretera Transpeninsular Km 7.3, Corredor Turistico, 23450 Cabo San Lucas, B.C.S., Mexico", "desc": "", "tel": "01 624 163 5550", "int_tel": "+52 624 163 5550", "email": "", "web": "", "web_formatted": "", "open": "", "time": "", "lat": 22.9023412, "lng": -109.8442933, "vicinity": "Carretera Transpeninsular Km 7.3, Corredor Turistico, Cabo San Lucas", "open_hours": [{ "day": "Monday", "hours": "open24hours" }, { "day": "Tuesday", "hours": "open24hours" }, { "day": "Wednesday", "hours": "open24hours" }, { "day": "Thursday", "hours": "open24hours" }, { "day": "Friday", "hours": "open24hours" }, { "day": "Saturday", "hours": "open24hours" }, { "day": "Sunday", "hours": "open24hours" }], "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": true, "email": true, "enable": true, "int_tel": true, "open": true, "open_hours": true, "photo": true, "tel": true, "title": true, "web": true } }, { "title": "Cabo San Lucas", "address": "Cabo San Lucas, Baja California Sur, Mexico", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "", "lat": 22.8905327, "lng": -109.91673709999998, "vicinity": "Cabo San Lucas", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": true, "email": true, "enable": true, "int_tel": true, "open": true, "open_hours": true, "photo": true, "tel": true, "title": true, "web": true } }, { "title": "Playa del Carmen", "address": "Playa del Carmen, Quintana Roo, Mexico", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "", "lat": 20.6295586, "lng": -87.07388509999998, "vicinity": "Playa del Carmen", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": true, "email": true, "enable": true, "int_tel": true, "open": true, "open_hours": true, "photo": true, "tel": true, "title": true, "web": true } }, { "title": "Positano", "address": "84017 Positano, Province of Salerno, Italy", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "", "lat": 40.6280528, "lng": 14.484981199999993, "vicinity": "Positano", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": true, "email": true, "enable": true, "int_tel": true, "open": true, "open_hours": true, "photo": true, "tel": true, "title": true, "web": true } }, { "title": "Ravello", "address": "84010 Ravello, Province of Salerno, Italy", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "", "lat": 40.6491886, "lng": 14.611711199999945, "vicinity": "Ravello", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": true, "email": true, "enable": true, "int_tel": true, "open": true, "open_hours": true, "photo": true, "tel": true, "title": true, "web": true } }, { "title": "Amalfi Coast", "address": "84011 Amalfi SA, Italy", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "", "lat": 40.6333389, "lng": 14.602896299999998, "vicinity": "Amalfi", "open_hours": [{ "day": "Monday", "hours": "open24hours" }, { "day": "Tuesday", "hours": "open24hours" }, { "day": "Wednesday", "hours": "open24hours" }, { "day": "Thursday", "hours": "open24hours" }, { "day": "Friday", "hours": "open24hours" }, { "day": "Saturday", "hours": "open24hours" }, { "day": "Sunday", "hours": "open24hours" }], "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": true, "email": true, "enable": true, "int_tel": true, "open": true, "open_hours": true, "photo": true, "tel": true, "title": true, "web": true } }, { "title": "Amalfi", "address": "84011 Amalfi SA, Italy", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "", "lat": 40.63400259999999, "lng": 14.60268050000002, "vicinity": "Amalfi", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": true, "email": true, "enable": true, "int_tel": true, "open": true, "open_hours": true, "photo": true, "tel": true, "title": true, "web": true } }, { "title": "Florence", "address": "Florence, Italy", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "", "lat": 43.7695604, "lng": 11.25581360000001, "vicinity": "Florence", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": true, "email": true, "enable": true, "int_tel": true, "open": true, "open_hours": true, "photo": true, "tel": true, "title": true, "web": true } }, { "title": "Venice", "address": "Venice, Italy", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "", "lat": 45.4408474, "lng": 12.31551509999997, "vicinity": "Venice", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": true, "email": true, "enable": true, "int_tel": true, "open": true, "open_hours": true, "photo": true, "tel": true, "title": true, "web": true } }, { "title": "Rome", "address": "Rome, Italy", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "", "lat": 41.90278349999999, "lng": 12.496365500000024, "vicinity": "Rome", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": true, "email": true, "enable": true, "int_tel": true, "open": true, "open_hours": true, "photo": true, "tel": true, "title": true, "web": true } }, { "title": "Vernazza", "address": "19018 Vernazza, Province of La Spezia, Italy", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "", "lat": 44.1349211, "lng": 9.684993500000019, "vicinity": "Vernazza", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": true, "email": true, "enable": true, "int_tel": true, "open": true, "open_hours": true, "photo": true, "tel": true, "title": true, "web": true } }, { "title": "Riomaggiore", "address": "19017 Riomaggiore SP, Italy", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "", "lat": 44.0990492, "lng": 9.737485099999958, "vicinity": "Riomaggiore", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": true, "email": true, "enable": true, "int_tel": true, "open": true, "open_hours": true, "photo": true, "tel": true, "title": true, "web": true } }, { "title": "Manarola", "address": "19017 Manarola, Province of La Spezia, Italy", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "", "lat": 44.11155939999999, "lng": 9.733893699999953, "vicinity": "Manarola", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": true, "email": true, "enable": true, "int_tel": true, "open": true, "open_hours": true, "photo": true, "tel": true, "title": true, "web": true } }, { "title": "Corniglia", "address": "19018 Corniglia, Province of La Spezia, Italy", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "", "lat": 44.11986189999999, "lng": 9.710030700000061, "vicinity": "Corniglia", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": true, "email": true, "enable": true, "int_tel": true, "open": true, "open_hours": true, "photo": true, "tel": true, "title": true, "web": true } }, { "title": "Monterosso", "address": "Via Valle Gargassa, 13, 16010 Rossiglione GE, Italy", "desc": "", "tel": "010 925866", "int_tel": "+39 010 925866", "email": "", "web": "", "web_formatted": "", "open": "", "time": "", "lat": 44.55198470000001, "lng": 8.642570999999975, "vicinity": "Via Valle Gargassa, 13, Rossiglione", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": true, "email": true, "enable": true, "int_tel": true, "open": true, "open_hours": true, "photo": true, "tel": true, "title": true, "web": true } }, { "title": "Ladera Resort (1)", "address": "Saint Lucia", "desc": "", "tel": "(758) 459-6600", "int_tel": "+1 758-459-6600", "email": "", "web": "", "web_formatted": "", "open": "", "time": "", "lat": 13.858208, "lng": -61.03549099999998, "vicinity": "St. Lucia", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": true, "email": true, "enable": true, "int_tel": true, "open": true, "open_hours": true, "photo": true, "tel": true, "title": true, "web": true } }, { "title": "Sugar Beach, A Viceroy Resort", "address": "Val Des Pitons Forbidden Beach La Baie de Silence, Saint Lucia", "desc": "", "tel": "(758) 456-8000", "int_tel": "+1 758-456-8000", "email": "", "web": "", "web_formatted": "", "open": "", "time": "", "lat": 13.8278433, "lng": -61.06121159999998, "vicinity": "Val Des Pitons Forbidden Beach La Baie de Silence", "open_hours": [{ "day": "Monday", "hours": "open24hours" }, { "day": "Tuesday", "hours": "open24hours" }, { "day": "Wednesday", "hours": "open24hours" }, { "day": "Thursday", "hours": "open24hours" }, { "day": "Friday", "hours": "open24hours" }, { "day": "Saturday", "hours": "open24hours" }, { "day": "Sunday", "hours": "open24hours" }], "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": true, "email": true, "enable": true, "int_tel": true, "open": true, "open_hours": true, "photo": true, "tel": true, "title": true, "web": true } }, { "title": "Italy", "address": "Italy", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "", "lat": 41.87194, "lng": 12.567379999999957, "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": true, "email": true, "enable": true, "int_tel": true, "open": true, "open_hours": true, "photo": true, "tel": true, "title": true, "web": true } }, { "title": "Colorado", "address": "Colorado, USA", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "", "lat": 39.5500507, "lng": -105.78206740000002, "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": true, "email": true, "enable": true, "int_tel": true, "open": true, "open_hours": true, "photo": true, "tel": true, "title": true, "web": true } }, { "title": "Phuket", "address": "Phuket, Mueang Phuket District, Phuket 83000, Thailand", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "", "lat": 7.8804479, "lng": 98.39225039999997, "vicinity": "Phuket", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": true, "email": true, "enable": true, "int_tel": true, "open": true, "open_hours": true, "photo": true, "tel": true, "title": true, "web": true } }, { "title": "Big Sur", "address": "Big Sur, CA, USA", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "", "lat": 36.3614749, "lng": -121.85626100000002, "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": true, "email": true, "enable": true, "int_tel": true, "open": true, "open_hours": true, "photo": true, "tel": true, "title": true, "web": true } }, { "title": "Carmel-by-the-Sea", "address": "Carmel-By-The-Sea, CA 93923, USA", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "", "lat": 36.5552386, "lng": -121.92328789999999, "vicinity": "Carmel-by-the-Sea", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": true, "email": true, "enable": true, "int_tel": true, "open": true, "open_hours": true, "photo": true, "tel": true, "title": true, "web": true } }, { "title": "Negril", "address": "Negril, Jamaica", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "", "lat": 18.2683058, "lng": -78.34724240000003, "vicinity": "Negril", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": true, "email": true, "enable": true, "int_tel": true, "open": true, "open_hours": true, "photo": true, "tel": true, "title": true, "web": true } }, { "title": "Rockhouse Hotel", "address": "W End Rd, Negril, Jamaica", "desc": "", "tel": "(876) 957-4373", "int_tel": "+1 876-957-4373", "email": "", "web": "", "web_formatted": "", "open": "", "time": "", "lat": 18.2649974, "lng": -78.36768990000002, "vicinity": "West End Road, Negril", "open_hours": [{ "day": "Monday", "hours": "8am–8pm" }, { "day": "Tuesday", "hours": "8am–8pm" }, { "day": "Wednesday", "hours": "8am–8pm" }, { "day": "Thursday", "hours": "8am–8pm" }, { "day": "Friday", "hours": "8am–8pm" }, { "day": "Saturday", "hours": "8am–8pm" }, { "day": "Sunday", "hours": "8am–8pm" }], "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": true, "email": true, "enable": true, "int_tel": true, "open": true, "open_hours": true, "photo": true, "tel": true, "title": true, "web": true } }, { "title": "Puerto Vallarta", "address": "Puerto Vallarta, Jalisco, Mexico", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "", "lat": 20.65340699999999, "lng": -105.2253316, "vicinity": "Puerto Vallarta", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": true, "email": true, "enable": true, "int_tel": true, "open": true, "open_hours": true, "photo": true, "tel": true, "title": true, "web": true } }, { "title": "Chicago", "address": "Chicago, IL, USA", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "", "lat": 41.8781136, "lng": -87.62979819999998, "vicinity": "Chicago", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": true, "email": true, "enable": true, "int_tel": true, "open": true, "open_hours": true, "photo": true, "tel": true, "title": true, "web": true } }, { "title": "Iowa", "address": "Iowa, USA", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "", "lat": 41.8780025, "lng": -93.09770200000003, "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": true, "email": true, "enable": true, "int_tel": true, "open": true, "open_hours": true, "photo": true, "tel": true, "title": true, "web": true } }, { "title": "Puerto Rico", "address": "Puerto Rico", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "", "lat": 18.220833, "lng": -66.590149, "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": true, "email": true, "enable": true, "int_tel": true, "open": true, "open_hours": true, "photo": true, "tel": true, "title": true, "web": true } }, { "title": "San Francisco", "address": "San Francisco, CA, USA", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "", "lat": 37.7749295, "lng": -122.41941550000001, "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": true, "email": true, "enable": true, "int_tel": true, "open": true, "open_hours": true, "photo": true, "tel": true, "title": true, "web": true } }, { "title": "Los Angeles", "address": "Los Angeles, CA, USA", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "", "lat": 34.0522342, "lng": -118.2436849, "vicinity": "Los Angeles", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": true, "email": true, "enable": true, "int_tel": true, "open": true, "open_hours": true, "photo": true, "tel": true, "title": true, "web": true } }, { "title": "Las Vegas", "address": "Las Vegas, NV, USA", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "", "lat": 36.1699412, "lng": -115.13982959999998, "vicinity": "Las Vegas", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": true, "email": true, "enable": true, "int_tel": true, "open": true, "open_hours": true, "photo": true, "tel": true, "title": true, "web": true } }, { "title": "Spain", "address": "Spain", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "", "lat": 40.46366700000001, "lng": -3.7492200000000366, "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": true, "email": true, "enable": true, "int_tel": true, "open": true, "open_hours": true, "photo": true, "tel": true, "title": true, "web": true } }, { "title": "Barcelona", "address": "Barcelona, Spain", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "", "lat": 41.38506389999999, "lng": 2.1734034999999494, "vicinity": "Barcelona", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": true, "email": true, "enable": true, "int_tel": true, "open": true, "open_hours": true, "photo": true, "tel": true, "title": true, "web": true } }, { "title": "Bengaluru", "address": "Bengaluru, Karnataka, India", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "", "lat": 12.9715987, "lng": 77.59456269999998, "vicinity": "Bengaluru", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": true, "email": true, "enable": true, "int_tel": true, "open": true, "open_hours": true, "photo": true, "tel": true, "title": true, "web": true } }, { "title": "Kerala", "address": "Kerala, India", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "", "lat": 10.8505159, "lng": 76.27108329999999, "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": true, "email": true, "enable": true, "int_tel": true, "open": true, "open_hours": true, "photo": true, "tel": true, "title": true, "web": true } }, { "title": "Thiruvananthapuram", "address": "Thiruvananthapuram, Kerala, India", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "", "lat": 8.524139100000001, "lng": 76.93663760000004, "vicinity": "Thiruvananthapuram", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": true, "email": true, "enable": true, "int_tel": true, "open": true, "open_hours": true, "photo": true, "tel": true, "title": true, "web": true } }
			];
			for (i = 0; i < locations.length; i++) {
				marker = new google.maps.Marker({
					icon: locations[i].marker,
					position: new google.maps.LatLng(locations[i].lat, locations[i].lng),
					map: map,
					title: locations[i].title,
					address: locations[i].address,
					desc: locations[i].desc,
					tel: locations[i].tel,
					int_tel: locations[i].int_tel,
					vicinity: locations[i].vicinity,
					open: locations[i].open,
					open_hours: locations[i].open_hours,
					photo: locations[i].photo,
					time: locations[i].time,
					email: locations[i].email,
					web: locations[i].web,
					iw: locations[i].iw
				});
				markersArray.push(marker);

				if (locations[i].iw.enable === true) {
					bindInfoWindow(marker, map, locations[i]);
				}
			}
		}
	},
	loadInstafeed: () => {
		About.instaFeed = new Instafeed({
			target: "ig-feed",
			get: 'user',
			userId: 232162132,
			accessToken: '232162132.62a228a.96de27b918d8401a858301d776a4aecb',
			limit: 6,
			sortBy: 'most-recent',
			after: () => { },
			links: true,
			resolution: "low_resolution",
			template: `
					<a href="{{link}}" target="_blank">
						<div class="ig-img" style="background-image:url('http:{{image}}')"/>
						</div>
					</a>						
			`
		});
		About.instaFeed.run();
	},
	loadGithubActivity: () => {
		githubActivity.feed({
			username: "vararun",
			selector: "#github-feed",
			limit: 20
		});
	}
	instaFeed: {}
}
