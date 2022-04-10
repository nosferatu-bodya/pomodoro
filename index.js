
const nextDot = () => {
    deselectDots()
    currentDot += 1
    makeDotActive(currentDot)
}

// plays sound after every dot
const finishDotSound = () => {
    let sound = new Audio("./sounds/complete-sound.wav")
    sound.play()
}

// selects a dot
const makeDotActive = (index) => {
    if (dots[index].classList.contains("work")) {
        dots[index].classList.add("work--active")
    } else {
        dots[index].classList.add("break--active")
    }
}

// makes every dot unselected
const deselectDots = () => {
    dots.forEach(e => {
        e.classList.remove("break--active")
        e.classList.remove("work--active")
    })
}

// turns seconds into a string format 00:00
const secondsToTimeString = (secs) => {
    let minutes = Math.floor(secs / 60)
    let seconds = secs % 60

    let reStr = ""

    if(String(minutes).length == 1) {
        reStr += `0${minutes}:`
    }else {
        reStr += minutes + ":"
    }

    if(String(seconds).length == 1) {
        reStr += `0${seconds}`
    }else {
        reStr += seconds
    }
    return reStr
}

// returns length of a pomodoro break or work
const getTimeFromElement = (elem) => {
    if (elem.classList.contains("work")){
        return 25 * 60
    } else if (elem.classList.contains("small-break")){
        return 5 * 60
    } else if (elem.classList.contains("big-break")){
        return 40 * 60
    }
}

function Timer (maxSeconds, onFinish, onEachSecond) {
    let paused = true
    this.time = maxSeconds
    this.currentTime = maxSeconds
    this.startTime = () => {
        paused = false
        reduceBySecond()
    }

    const reduceBySecond = () => {
        if (paused) return
        setTimeout(reduceBySecond, 1000)

        onEachSecond()
        this.currentTime -= 1

        if(this.currentTime < 0){
            onFinish()
        }
    }

    this.pauseTimer = () => {
        paused = true
    }

    this.restart = (newTime = this.time) => {
        this.time = newTime
        this.currentTime = newTime
        // paused = true
    }
}

const dots = document.querySelectorAll(".dot")
const button = document.querySelector(".start-button")
const autoRestartButton = document.querySelector(".restart-button")
const timeIndicator = document.querySelector(".time")

let pause = false
let started = false
let currentDot = 0
let autoRestart = false

timeIndicator.textContent = secondsToTimeString(getTimeFromElement(dots[currentDot]))

let timer = new Timer(
    getTimeFromElement(dots[currentDot]),
    () => {
        if (currentDot == dots.length - 1){
            finishDotSound()
            if(autoRestart == true) {
                started = true
                pause = false
                currentDot = 0
                deselectDots()
                makeDotActive(currentDot)
                timeIndicator.textContent = secondsToTimeString(getTimeFromElement(dots[currentDot]))
                timer.restart(getTimeFromElement(dots[currentDot]))
            } else if(autoRestart == false) {
                started = false
                pause = false
                button.textContent = "Start"
                currentDot = 0
                deselectDots()
                timeIndicator.textContent = secondsToTimeString(getTimeFromElement(dots[currentDot]))
                timer.restart(getTimeFromElement(dots[currentDot]))
                timer.pauseTimer()
            }
        } else {
            finishDotSound()
            nextDot()
            timer.restart(getTimeFromElement(dots[currentDot]))
        }
    },
    () => {
        timeIndicator.textContent = secondsToTimeString(timer.currentTime)
    }
)

button.addEventListener("click", () => {
    if (started == false) {
        // start timer
        makeDotActive(currentDot)
        started = true
        button.textContent = "Pause"

        timer.startTime()

    } else if (started == true && pause == false) {
        // turn pause
        pause = true
        button.textContent = "Continue"

        timer.pauseTimer()

    } else if (pause == true && started == true) {
        // turn off pause
        pause = false
        button.textContent = "Pause"

        timer.startTime()
    }
});

autoRestartButton.addEventListener("click", () => {
    if(autoRestart == true) {
        autoRestart = false
        autoRestartButton.classList.remove("restart-button--active")
    } else {
        autoRestart = true
        autoRestartButton.classList.add("restart-button--active")
    }
})