document.addEventListener("DOMContentLoaded", function () {
    const TIMER_DURATION = 10; //90 * 60;

    const TimerStates = {
        IDLE: "IDLE",
        TIMER_RUN: "TIMER_RUN",
        TIMER_STOP: "TIMER_STOP",
        ALARM: "ALARM"
    };

    let state = TimerStates.IDLE;
    let countdown = TIMER_DURATION;
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

    function transitionState(newState) {
        switch (newState) {
            case "IDLE":
                setTimer(stop = true, restartCountdown = true);
                stopSound();

                hideMessage();
                setMainButton("Play", isVisible = true);
                setRestartButton(isVisible = false);
                break;

            case "TIMER_RUN":
                setTimer();

                hideMessage();
                setMainButton("Stop", isVisible = true);
                setRestartButton(isVisible = false);
                break;

            case "TIMER_STOP":
                setTimer(stop = true);

                hideMessage();
                setMainButton("Play", isVisible = true);
                setRestartButton(isVisible = true);
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
            document.getElementById("stopPlayButton").style.display = "none";
        } else {
            document.getElementById("stopPlayButton").style.display = "block";
            document.getElementById("stopPlayButton").textContent = title;
        }
    }

    function setRestartButton(isVisible) {
        if (isVisible) {
            document.getElementById("restartButton").style.display = "block";
        } else {
            document.getElementById("restartButton").style.display = "none";
        }
    }

    function setTimer(stop = false, restartCountdown = false) {
        if (restartCountdown) {
            countdown = TIMER_DURATION;
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
        transitionState(TimerStates.IDLE);
        transitionState(TimerStates.TIMER_RUN);
    });

    // Initialize the state
    transitionState(TimerStates.IDLE);
    updateTimer();
});
