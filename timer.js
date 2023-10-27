document.addEventListener("DOMContentLoaded", function () {
    const TimerStates = {
        IDLE: "IDLE",
        TIMER_RUN: "TIMER_RUN",
        TIMER_STOP: "TIMER_STOP",
        ALARM: "ALARM"
    };

    let state = TimerStates.IDLE;
    let countdown;
    let timerInterval;
    let playPromise;
    let isAudioPlaying = false;

    const audio = document.getElementById("audioPlayer");

    function formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    }

    function playSound() {
        if (isAudioPlaying) return;

        playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.then(_ => {
                isAudioPlaying = true;
            }).catch(error => {
                console.error("playSound() error:", error);
            });
        }
    }

    function stopSound() {
        isAudioPlaying = false;
        audio.pause();
        audio.currentTime = 0;
    }

    function updateTimer() {
        document.getElementById("timer").textContent = formatTime(countdown);

        if (countdown === 0) {
            transitionState(TimerStates.ALARM);
        } else {
            countdown--;
        }
    }

    function resetCountDown() {
        const hours = parseInt(document.getElementById("hoursInput").value, 10) || 0;
        const minutes = parseInt(document.getElementById("minutesInput").value, 10) || 0;
        const seconds = parseInt(document.getElementById("secondsInput").value, 10) || 0;

        countdown = (hours * 3600) + (minutes * 60) + seconds;

        // Update the timer display immediately
        document.getElementById("timer").textContent = formatTime(countdown);
    }

    function transitionState(newState) {
        switch (newState) {
            case "IDLE":
                setTimer(stop = true, reset = true);
                stopSound();

                hideMessage();
                setMainButton("Start", isVisible = true);
                setRestartButton(isVisible = false);
                setTimerVisibility(isVisible = true);
                break;

            case "TIMER_RUN":
                setTimer();

                hideMessage();
                setMainButton("Stop", isVisible = true);
                setRestartButton(isVisible = false);
                setTimerVisibility(isVisible = false);
                break;

            case "TIMER_STOP":
                setTimer(stop = true);

                hideMessage();
                setMainButton("Continue", isVisible = true);
                setRestartButton(isVisible = true);
                setTimerVisibility(isVisible = true);
                break;

            case "ALARM":
                setTimer(stop = true);
                playSound();

                showMessage();
                setMainButton(isVisible = false);
                setRestartButton(isVisible = true);
                break;
        }

        state = newState;
    }

    function hideMessage() {
        document.getElementById("message").textContent = "";
    }

    function showMessage() {
        document.getElementById("message").textContent = "It's time to take a break and do some exercise!";
    }

    function setMainButton(title = "", isVisible) {
        if (!isVisible) {
            hide("stopPlayButton");
        } else {
            show("stopPlayButton");
            document.getElementById("stopPlayButton").textContent = title;
        }
    }

    function setRestartButton(isVisible) {
        if (isVisible) {
            show("restartButton");
        } else {
            hide("restartButton");
        }
    }

    function setTimerVisibility(isVisible) {
        if (isVisible) {
            show("durationLabel");
            show("inputContainer");
        } else {
            hide("durationLabel");
            hide("inputContainer");
        }
    }

    function show(id) {
        document.getElementById(id).style.display = "block";
    }

    function hide(id) {
        document.getElementById(id).style.display = "none";
    }

    function setTimer(stop = false, reset = false) {
        if (reset) {
            resetCountDown();
        }

        if (stop) {
            clearInterval(timerInterval);
        } else {
            timerInterval = setInterval(updateTimer, 1000);
        }
    }

    document.getElementById("stopPlayButton").addEventListener("click", () => {
        if (state === TimerStates.TIMER_RUN) {
            transitionState(TimerStates.TIMER_STOP);
        } else if (state === TimerStates.TIMER_STOP || state === TimerStates.IDLE) {
            transitionState(TimerStates.TIMER_RUN);
        }
    });

    document.getElementById("restartButton").addEventListener("click", () => {
        if (state === TimerStates.ALARM) {
            transitionState(TimerStates.IDLE);
        } else if (state === TimerStates.TIMER_STOP) {
            transitionState(TimerStates.IDLE);
            transitionState(TimerStates.TIMER_RUN);
        }
    });

    document.getElementById("setTimerButton").addEventListener("click", function () {
        resetCountDown()

        // If you want to automatically start the timer after setting it, call:
        // transitionState("TIMER_RUN");
    });

    // Initialize the state
    transitionState(TimerStates.IDLE);
});
