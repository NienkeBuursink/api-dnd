//MARK: Start race
const startBtn = document.querySelector(".start")
const popup = document.querySelector(".popup")
let winner
let userWalk = false


startBtn.addEventListener("click", () => {
    let count = 3
    popup.showModal() // https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal
    popup.innerHTML= `<p class="countdown">${count}</p>`
    startBtn.style.pointerEvents = "none"
    startBtn.style.opacity = ".3"

    const interval = setInterval(() => {
        count--
        if (count > 0) {
            popup.innerHTML= `<p class="countdown">${count}</p>`
        } else {
            popup.innerHTML= `<p class="countdown">GO!</p>`
            clearInterval(interval)
            startRunningCharacter()
            startRunningUser()
            setTimeout(() => {
                popup.close()
                startBtn.textContent = "RUN!"
            }, 1000)
        }
    }, 1000)
})





//MARK: Character track
const runner = document.querySelector(".person")
const characterSpeedKmH = runner.dataset.speed
const characterSpeed = parseFloat(characterSpeedKmH) / 3.6 //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseFloat
const characterTrackTime = 100 / characterSpeed

function startRunningCharacter() {
    runner.style.setProperty("--running-ani-duration", characterTrackTime + "s") //https://www.w3schools.com/css/css3_variables_javascript.asp
    runner.classList.add("running")

    runner.addEventListener("animationend", (event) => { }) //https://developer.mozilla.org/en-US/docs/Web/API/Element/animationend_event
    onanimationend = (event) => {
        const characterName = runner.dataset.name
        winner = characterName
        finishRace(winner)
    }
}




//MARK: User track
//https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API

let totalDistance
let lastPosition
let watchId
let trackDistanceLeft = 100

function startRunningUser() {
    totalDistance = 0
    lastPosition = null
    userWalk = true
    watchId = navigator.geolocation.watchPosition(updatePosition, error, options)
}

function updatePosition(pos) {
    if (userWalk === true) {
        let raceFinished = false
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
            } else {
                console.log("te weinig beweging")
            }

            const distanceElement = document.querySelector("#distance")
            distanceElement.textContent = `distance run: ${totalDistance.toFixed(1)}m`
            moveLocationMark(totalDistance)

            if (totalDistance >= 100) {
                winner = "you"
                finishRace(winner)
            }
        }

        lastPosition = currentPosition
    }
}

const options = {
    enableHighAccuracy: true
}

function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`)
}


function moveLocationMark(totalDistance) {
    const userLocationMark = document.querySelector(".person.user")
    userLocationMark.style.transform = `translateX(${totalDistance}cqw)`
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



// MARK: Finish race
function finishRace(winner) {
    userWalk = false
    popup.showModal()
    popup.innerHTML = `
        <h2 class="winner">${winner} won!</h2>
        <button class="restart">Restart</button>`
    const restartButton = document.querySelector(".restart")
    restartButton.addEventListener("click", () => {
        window.location.reload()
    })

}