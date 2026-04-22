//MARK: Start race
const startBtn = document.querySelector(".start")
const popup = document.querySelector("#countdown")


startBtn.addEventListener("click", () => {
    let count = 3
    popup.textContent = count
    popup.style.display = "grid"

    const interval = setInterval(() => {
        count--
        if (count > 0) {
            popup.textContent = count
        } else {
            popup.textContent = "GO!"
            clearInterval(interval)
            startRunningCharacter()
            startRunningUser()
            setTimeout(() => {
                popup.style.display = "none"
            }, 1000)
        }
    }, 1000)
})




//MARK: Character track
const runner = document.querySelector(".person")
const characterSpeedKmH = runner.dataset.speed
const characterSpeed = parseFloat(characterSpeedKmH) / 3.6
const characterTrackTime = 100 / characterSpeed

function startRunningCharacter() {
    // console.log(characterTrackTime)
    runner.style.setProperty("--running-ani-duration", characterTrackTime + "s") //https://www.w3schools.com/css/css3_variables_javascript.asp
    runner.classList.add("running")
}




//MARK: User track
//https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API

let totalDistance
let lastPosition
let watchId

function startRunningUser() {
    totalDistance = 0
    lastPosition = null

    watchId = navigator.geolocation.watchPosition(updatePosition, error, options)
}

function updatePosition(pos) {
    const crd = pos.coords

    const currentPosition = {
        lat: crd.latitude,
        lon: crd.longitude
    }

    console.log("Current:", currentPosition)

    if (lastPosition) {
        const distance = getDistance(
            lastPosition.lat,
            lastPosition.lon,
            currentPosition.lat,
            currentPosition.lon
        )
        if (distance > 1) {
            totalDistance += distance; 
            console.log("Distance added:", distance)
            console.log("Total:", totalDistance)
        } else {
            console.log("te weinig beweging")
        }

        const distanceElement = document.querySelector("#distance")
        distanceElement.textContent = `distance run: ${totalDistance.toFixed(1)} m`
    }

    lastPosition = currentPosition
}

const options = {
    enableHighAccuracy: true
}

function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`)
}



// Deze functie is volledig van ChatGPT. Prompt: hoe bereken ik met coordinaten de afgelegde afstand van de user?
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;

    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // afstand in meters
}