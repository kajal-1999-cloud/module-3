// https://ipinfo.io/163.53.203.207/geo

const ipAdd = document.getElementById('ipAddress');
const fetchBtn = document.getElementById('button-get')
const latitude = document.getElementById('lat');
const longitude = document.getElementById('long');
const city = document.getElementById('city');
const org = document.getElementById('organisation');

const region = document.getElementById('region');
const hostname = document.getElementById('hostname');
const timezone = document.getElementById('timeZone');

const datetime = document.getElementById('dateTime');
const pincode = document.getElementById('pincode');
const msg = document.getElementById('msg');

// const button = document.getElementById('')
const search = document.getElementById('search');
const searchInput= document.getElementById('searchbar');
const postList = document.getElementById('postList');

//get ip address
window.addEventListener('load', function(){
    setTimeout(function (){
        fetch('https://api.ipify.org?format=json').then(response => response.json())
        .then(data => {
            ipAdd.innerText = data.ip;
            ipAdd.style.color ="green";
        });
    }, 1000);
});


// Function to display user's location on map in an iframe
function showMap(latitude, longitude) {
    const div = document.createElement("div");
    div.innerHTML = `<iframe id="iframe" src="https://maps.google.com/maps?q=${latitude},${longitude}&z=16&output=embed"
    width="100%" height="500" frameborder="0" style="border:0; "></iframe>`;
    map.appendChild(div);
}
if (!showMap) {
    loader.style.display = "none";
}else{
    loader.style.display = "block";

}





// Function to get client's IP address
function getIP(json) {
    // Get the user's IP address from the JSON response
    var ip = json.ip;
    // Make an API request to ipinfo.io with the user's IP address
    fetch(`https://ipinfo.io/${ip}/json?token=a791bcb3f533e0`)
        .then(response => response.json())
        .then(data => {
            // Get the latitude and longitude from the JSON response
            console.log(data)
            var loc = data.loc.split(',');
            var latitude = parseFloat(loc[0]);
            var longitude = parseFloat(loc[1]);
            let pin = data.postal;
            console.log(latitude, longitude)


            // datetime in "current timezone in the "en-US" locale
            let time = new Date().toLocaleString("en-US", `${data.timezone}`);
            console.log(time);

            lat.innerHTML = `<strong>Lat:</strong>  ${latitude}`;
            long.innerHTML = `<strong>Long:</strong>  ${longitude}`;
            city.innerHTML = `<strong>City:</strong> ${data.city}`
            region.innerHTML = `<strong>Region:</strong>  ${data.region}`
            organisation.innerHTML = `<strong>Organization:</strong> ${data.org}`
            hostname.innerHTML = `<strong>Hostname:</strong> ${data.ip}`
            timezone.innerHTML = `<strong>Time Zone:</strong> ${data.timezone}`
            datetime.innerHTML = `<strong>Date And Time:</strong> ${time}`
            pincode.innerHTML = `<strong>Pincode:</strong> ${data.postal}`


        
            let postOffices = []
            // Fetch post offices for given pincode
            function fetchPostOffices() {
                fetch(`https://api.postalpincode.in/pincode/${pin}`)
                    .then(response => response.json())
                    .then(data => {
                        postOffices = data[0].PostOffice;
                        msg.innerHTML = `<strong>Message:</strong> ${data[0].Message}`;
                        displayPostOffices(postOffices);
                      
                    })
                    .catch(error => {
                        console.error(error);
                    });
            }
            fetchPostOffices()
            if (postOffices) {
                loader.style.display = "none";
            } else {
                loader.style.display = "block";

            }

            // Display list of post offices
            function displayPostOffices(postOffices) {
                postList.innerHTML = '';

                postOffices.forEach(postOffice => {
                    const item = document.createElement('div');
                    item.innerHTML = `
                    <div class="card" id="card">
                            <span id="name"><strong>Name:</strong> ${postOffice.Name}</span><br>
                            <span id="branch-type"><strong>Branch Type:</strong> ${postOffice.BranchType} </span>
                            <br>
                            <span><strong>Delivery Status:</strong> ${postOffice.DeliveryStatus}</span>
                            <br>
                            <span><strong>District:</strong> ${postOffice.District}</span>
                            <br>
                            <span><strong>Division:</strong> ${postOffice.Division}</span>
                        
                    </div>
                            `;

                    postList.appendChild(item);

                });
            }


            // Filter post offices by name or branch type
            function filterOffices() {
                const searchTerm = searchInput.value.toLowerCase().trim();
                const filteredPostOffices = postOffices.filter(postOffice =>
                    postOffice.Name.toLowerCase().includes(searchTerm) ||
                    postOffice.BranchType.toLowerCase().includes(searchTerm)
                );

                if (filteredPostOffices.length === 0) {
                    postList.innerHTML = '<p>No results found</p>';
                } else {
                    displayPostOffices(filteredPostOffices);
                }
            }


            // Attach filter function to search input
            searchInput.addEventListener('input', () => {
                filterOffices(postOffices);
            });

            // Call fetchPostOffices function to get initial list of post offices
            fetchPostOffices()




            // Display the user's location on a map in an iframe
            showMap(latitude, longitude);
        });


}






function onFetchBtnClick() {
    
    loader.style.display = "block";

    setTimeout(function () {
        loader.style.display = "none";
        fetchBtn.style.display = "none";
        search.style.display = "block";
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "https://api.ipify.org?format=jsonp&callback=getIP";
        document.head.appendChild(script);
    }, 2000);

}

fetchBtn.addEventListener('click', onFetchBtnClick);