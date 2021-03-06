(function() {
    $(document).ready(function() {
        $("#submitModal").modal({
            show: false
        }).on("shown", function()
        {
            var mapDiv = $("#mapView")[0];
            var latlng = new google.maps.LatLng(31.401401, 121.350495); 
            var options = { 
                center: latlng, 
                zoom: 11, 
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                disableDefaultUI: true
            }; 
            var map = new google.maps.Map(mapDiv, options);

            var marker = new google.maps.Marker({ 
                position: new google.maps.LatLng(31.401401, 121.350495), 
                title: "choose your position!",
                icon: "/static/img/pin.png"
            });
            
            $('#position').text(latlng.lat().toString() + ", " + latlng.lng().toString());
            $("input[name=latlng]").val([latlng.lat(), latlng.lng()]);
            marker.setMap(map);
            marker.setDraggable (true);

            google.maps.event.addListener(marker, 'click', function() {
            });

            google.maps.event.addListener(marker, 'dragend', function() {
                var point = marker.getPosition();
                console.log(point.lat());
                console.log(point.lng());
                $("input[name=latlng]").val([point.lat(), point.lng()]);
                $('#position').text(point.lat().toString() + ", " + point.lng().toString());
            });

            

            var addressInput = $("input[name=address]")[0];
            var address = "";
            var theTimer;
            
            
            addressInput.addEventListener("input",addressChange,false); 
            function addressChange() {
                //console.log(addressInput.value);
            }

            var geocoder;
            geocoder = new google.maps.Geocoder();

            function codeAddress() { 
                var sAddress = addressInput.value;
                console.log("codeAddress: " + sAddress);
                if (sAddress=="" || sAddress == address) {
                    theTimer = setTimeout(codeAddress, 500);
                    return;
                }
                address = sAddress;
                console.log(address);
                geocoder.geocode( { 'address': sAddress}, function(results, status) { 
                    if (status == google.maps.GeocoderStatus.OK) {
                        var location = results[0].geometry.location;
                        marker.setPosition(location);
                        map.setCenter(location);
                        map.setZoom(15);
                        theTimer = setTimeout(codeAddress, 500);
                        console.log("geocode suc");
                        $("input[name=latlng]").val([location.lat(), location.lng()]);
                        $('#position').text(location.lat().toString() + ", " + location.lng().toString());
                    }
                    else {
                        theTimer = setTimeout(codeAddress, 1000);
                        console.log("geocode fail");
                    }
                });
            }

            theTimer = setTimeout(codeAddress, 500);




            var input = $("input[name=address]")[0];
            var autocomplete = new google.maps.places.Autocomplete(input);
            autocomplete.bindTo("bounds", map);
            google.maps.event.addListener(autocomplete, "place_changed", function()
            {
                var place = autocomplete.getPlace();

                if (place.geometry.viewport) {
                    map.fitBounds(place.geometry.viewport);
                } else {
                    map.setCenter(place.geometry.location);
                    map.setZoom(15);
                }

                marker.setPosition(place.geometry.location);
            });
        });

        $("#submit_nav").click(function() {
            $("#submitModal").modal('show');
        });

        
    });



    $(document).ready(function() {
        
        $('#item_submit').ajaxForm({ 
            // dataType identifies the expected content type of the server response 
            dataType:  'json', 
            // success identifies the function to invoke when the server response 
            // has been received 
            success:   processJson 
        }); 

        function processJson(data) { 
            // 'data' is the json object returned from the server 
            $("#submitModal").modal('hide');
            console.log('submit response: ' + data.status);
        };

    });

})();

