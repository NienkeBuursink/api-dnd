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
const characterSpeed = parseFloat(characterSpeedKmH) / 3.6;
const characterTrackTime = 100 / characterSpeed

function startRunningCharacter() {
    // console.log(characterTrackTime)
    runner.style.setProperty("--running-ani-duration", characterTrackTime + "s") //https://www.w3schools.com/css/css3_variables_javascript.asp
    runner.classList.add("running")
}




//MARK: User track
//https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API
function startRunningUser() {
    totalDistance = 0
    lastPosition = null
    startTime = Date.now()

    watchId = navigator.geolocation.watchPosition(updatePosition, error, options)
}

function updatePosition(pos) {


    const crd = pos.coords;

    console.log("Your current position is:");
    console.log(`Latitude: ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    // console.log(`More or less ${crd.accuracy} meters.`);
}

const options = {
    enableHighAccuracy: true
}

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}
