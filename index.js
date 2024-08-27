

async function init() {

  const { Map } = await google.maps.importLibrary("maps");
  const mapDiv = document.getElementById("map");
  const map = new google.maps.Map(mapDiv, {
    zoom: 15,
    center: new google.maps.LatLng(37.4419, -122.1419),
  });

  google.maps.event.addListener(map, 'click', function(e) {
    console.log(e.placeId);
    e.stop();
  });

  /*
    await customElements.whenDefined('gmp-map');
  
    const map = new google.maps.Map(
      document.getElementById("map"), {
        center: new google.maps.LatLng(37.4419, -122.1419),
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });
    map.fitBounts
    //const map = document.querySelector('gmp-map');
    const marker = document.querySelector('gmp-advanced-marker');
    const placePicker = document.querySelector('gmpx-place-picker');
    const infowindow = new google.maps.InfoWindow();
  
    map.innerMap.setOptions({
      mapTypeControl: false
    });

    google.maps.event.addListener(placePicker, "click", function(){
      console.log("Map clicked");
  });
    placePicker.addEventListener('click', (e) => {
      console.log(e);
    });
    /*
    placePicker.addEventListener('gmpx-placechange', () => {
      const place = placePicker.value;
  
      if (!place.location) {
        window.alert(
          "No details available for input: '" + place.name + "'"
        );
        infowindow.close();
        marker.position = null;
        return;
      }
  
      if (place.viewport) {
        map.innerMap.fitBounds(place.viewport);
      } else {
        map.center = place.location;
        map.zoom = 17;
      }
  
      marker.position = place.location;
      infowindow.setContent(
        `<strong>${place.displayName}</strong><br>
         <span>${place.formattedAddress}</span> <br>
         <span>${place.rating}</span>
      `);
      infowindow.open(map.innerMap, marker);
    });
    */
  }
  
document.addEventListener('DOMContentLoaded', init);


  // Nearby Search

