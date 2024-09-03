
const DateFormat = {year: 'numeric', month: 'long', day: 'numeric' };
var itemId = 0;

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
    if (e == null) return;
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
              <a href="${place.websiteURI}">${place.websiteURI}</p> 
            </div>
            <div class="info_window_buttons">
              <a target=”_blank” href="https://www.google.com/maps/place/?q=place_id:${e.placeId}">Open in Google Maps</a>
              <button id="add_to_trip_button">Add to trip</button>
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
    google.maps.event.addListener(infowindow, 'domready', function() {
      document.getElementById("add_to_trip_button").addEventListener('click', function addToTrip() {
        const planList = document.getElementById('plan_list');
        
        const itemSeperator = document.createElement("form");
        itemSeperator.classList.add("item_seperator");
        const planItem = document.createElement("div");
        planItem.classList.add("plan_item");
        planItem.dataset.item_id = itemId;
        itemId++;
        planItem.innerHTML = 
        `<form class="plan_item">
          <div class="plan_datetime">
            <input type="date" class="item_date" value="${new Date().toISOString().substring(0, 10)}">
            <input type="time" class="item_time" value="${new Date().toISOString().substring(11, 16)}">
          </div>
          <div class="plan_item_right">
            <div class="plan_item_top">
              <input class="item_title" type="text" value="${place.displayName}">
              <div class="item_buttons no_print">
                <button><img src="/icons8-move-100.png" alt=""></button>
                <button class="delete_item_button"><img src="/icons8-delete-120.png" alt=""></button>
              </div>
            </div>
            <p class="onlyPrint">${place.formattedAddress}</p>
            <textarea name="note" class="item_note" oninput='this.style.height = "";this.style.height = this.scrollHeight + "px"'>Add a Note.</textarea>
          </div>
        </form>`;
      if (planList.hasChildNodes()) {
        planList.append(itemSeperator);
      }
      planList.append(planItem);

      // remove item from item list when delete button is clicked
      var delButtons = document.querySelectorAll(".delete_item_button");
      var lastDelButton = delButtons[delButtons.length - 1];
      lastDelButton.addEventListener('click', () => {
        if (planItem.previousSibling) {
          planItem.previousSibling.remove();
        }
        planItem.remove();
        if (planList.hasChildNodes() && planList.firstChild.classList[0] == "item_seperator") {
          planList.firstChild.remove();
        }
      });
      });
    });
  });
}
document.getElementById("print_button").addEventListener('click', () => {
  window.print();
  console.log("printed!");
});
document.getElementById("clear_button").addEventListener("click", () => {
  const planList = document.getElementById('plan_list');
  planList.innerHTML = '';
});
document.getElementById("email_button").addEventListener('click', () => {
  console.log("emailed!");
});

document.addEventListener('DOMContentLoaded', init);


  // Nearby Search

