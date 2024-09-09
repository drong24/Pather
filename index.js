
const DateFormat = {year: 'numeric', month: 'long', day: 'numeric' };

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
              <a href="${place.websiteURI}">${place.websiteURI}</a> 
            </div>
            <div class="info_window_buttons">
              <input id="date_time" type="datetime-local" value="${toLocalISOString(new Date)}">
              <button id="add_to_trip_button">Add</button>
              <a target=”_blank” href="https://www.google.com/maps/place/?q=place_id:${e.placeId}">
                <img src="icons8-google-maps-96.png" alt="to google maps button">
              </a>
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
    // adds map item to list
    google.maps.event.addListener(infowindow, 'domready', function() {
      document.getElementById("add_to_trip_button").addEventListener('click', function addToTrip() {
        const planList = document.getElementById('plan_list');
        const planItems = document.querySelectorAll(".plan_item");
        const itemDateTime = document.getElementById("date_time").value; 
        //const planDateTime = document.getElementById;
        
        // creates DOM element to insert
        const itemSeperator = document.createElement("div");
        itemSeperator.classList.add("item_seperator");
        const planItem = document.createElement("form");
        planItem.classList.add("plan_item");
        //planItem.draggable = true;
        planItem.innerHTML = 
        `<div class="plan_datetime">
            <input readonly type="date" class="item_date" value="${itemDateTime.substring(0, 10)}">
            <input readonly type="time" class="item_time" value="${itemDateTime.substring(11)}">
          </div>
          <div class="plan_item_right">
            <div class="plan_item_top">
              <input readonly class="item_title" type="text" value="${place.displayName}">
              <div class="item_buttons no_print">
                <button type="button"><img src="/icons8-move-100.png" alt=""></button>
                <button type="button" class="edit_item_button"><img src="/icons8-edit-100.png" alt=""></button>
                <button type="button" class="delete_item_button"><img src="/icons8-delete-120.png" alt=""></button>
              </div>
            </div>
            <p class="onlyPrint">${place.formattedAddress}</p>
            <textarea readonly name="note" class="item_note" oninput='this.style.height = "";this.style.height = this.scrollHeight + "px"'>Add a Note.</textarea>
          </div>`;
      var addedListPosition = getListPosition(itemDateTime);

      // inserts into plan list     
      if (planList.children.length == 0) {
        planList.append(planItem);
      }
      else if (addedListPosition == planItems.length) {
        planList.insertBefore(itemSeperator, planItems[addedListPosition]);
        planList.insertBefore(planItem, planItems[addedListPosition]);
        console.log("last?????")
      }
      else {
        planList.insertBefore(planItem, planItems[addedListPosition]);
        planList.insertBefore(itemSeperator, planItems[addedListPosition]);
      }

      //allows edits in item list
      var editButtons = document.querySelectorAll(".edit_item_button");
      var lastEditButton = editButtons[editButtons.length - 1];
      lastEditButton.addEventListener('click', () => {
        var itemDate = planItem.querySelector(".item_date");
        var itemTime = planItem.querySelector(".item_time");
        var itemTitle = planItem.querySelector(".item_title");
        var itemNote = planItem.querySelector(".item_note");
        if (itemTitle.readOnly == true) {
          itemDate.readOnly = false;
          itemTime.readOnly = false;
          itemTitle.readOnly = false;
          itemNote.readOnly = false;
          itemTitle.style = "border: 1px solid black;"
          itemNote.style = "border: 1px solid black";
          itemNote.style.height = itemNote.scrollHeight + "px";
          
        }
        else {
          itemDate.readOnly = true;
          itemTime.readOnly = true;
          itemTitle.readOnly = true;
          itemNote.readOnly = true;
          itemTitle.style = "border: none;"
          itemNote.style = "border: none;";
          itemNote.style.height = itemNote.scrollHeight + "px";
        }
        
      });

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

function toLocalISOString(date) {
  const localDate = new Date(date - date.getTimezoneOffset() * 60000);

  // Optionally remove second/millisecond if needed
  localDate.setSeconds(null);
  localDate.setMilliseconds(null);
  return localDate.toISOString().slice(0, 16).toUpperCase();
}

function getListPosition(dateTime) {
  const planItems = document.querySelectorAll(".plan_item");
  const addedDateTime = new Date(dateTime);

  var i = 0;
  while (i < planItems.length) {
    var currDate = planItems[i].querySelector(".item_date").value;
    var currTime = planItems[i].querySelector(".item_time").value;
    var currDateTime = new Date(currDate + "T" + currTime);
    if (currDateTime >= addedDateTime) {
      return i;
    }
    i++;
  } 
  return i;
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

