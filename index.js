

async function init() {

  const { Map } = await google.maps.importLibrary("maps");
  const { Place } = await google.maps.importLibrary("places");
  const {AdvancedMarkerElement} = await google.maps.importLibrary("marker");
  let infowindow = null;
  let marker = null;

  // create map
  const mapDiv = document.getElementById("map");
  const map = new google.maps.Map(mapDiv, {
    zoom: 15,
    center: new google.maps.LatLng(37.4419, -122.1419),
    mapId: "b59f8219183c11de"
  });

  // displays info window on icon click
  google.maps.event.addListener(map, 'click', async function(e) {
    console.log(e.placeId);
    e.stop();
    const place = new Place ({
      id: e.placeId,
      requestedLanguage: "en"
    });
    
    await place.fetchFields({
      fields: ["location", "displayName", "formattedAddress", "rating", "userRatingCount", "reviews", 
      "priceLevel", "photos", "websiteURI", "nationalPhoneNumber", "regularOpeningHours"]
    });

    // removes info window if another icon is selected
    if (infowindow != null) {
      infowindow.close();
    }

   infowindow = new google.maps.InfoWindow({
      content: 
      `<div class="info_window">
        <div class="info_window_info">
          <div class="info_window_left">          
            <img src="${place.photos[0].getURI({maxHeight: 120})}">
          </div>
          <div class="info_window_right">
            <div class="info_window_content">
              <h3>${place.displayName}</h3>
              <p>${place.rating} (${place.userRatingCount})</p>
              <p>${place.formattedAddress}</p> 
              <p>Price: ${(place.priceLevel == null) ? "No price estimate" : place.priceLevel}</p> 
              <p>${(place.nationalPhoneNumber == null) ? "" : place.nationalPhoneNumber}</p> 
              <p>${place.websiteURI}</p> 
            </div>
            <div class="info_window_buttons">
              <a href="${place.websiteURI}">Open in Google Maps</a>
              <button>Add to trip</button>
            </div>
          </div>
        </div>
      </div>`,
      ariaLabel: `${place.displayName}`
    });

  marker = new AdvancedMarkerElement({
      position: place.location,
      map: map
    });

    infowindow.open({
      anchor: marker,
      map
    });

    // removes anchored marker when info window closes
    infowindow.addListener('close', () => {
      marker.setMap(null);
    });
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

