document.addEventListener("DOMContentLoaded", function () {
    let countdown = 10;//90 * 60;
    let timerInterval;
    let timerRunning = true; // Flag to track whether the timer is running
    var playPromise
    var isAudioPlaying = false
    let audio

    // Function to format time as "HH:MM:SS"
    function formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    }

    // Function to play a sound
    function playSound() {
        if (isAudioPlaying) return

        stopSound()
        const audio = document.getElementById("audioPlayer"); // Get the audio element by ID
        if (audio) {
            playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.then(_ => {
                    // Automatic playback started!
                    // Show playing UI.
                    isAudioPlaying = true
                    console.log("playSound() playPromise.then()");
                })
                    .catch(error => {
                        // Auto-play was prevented
                        // Show paused UI.
                        console.log("playSound() playPromise.catch() error:", error);
                    });
            }
        }
    }

    // Function to stop audio playback
    function stopSound() {
        const audio = document.getElementById("audioPlayer"); // Replace with your audio element ID
        console.log("stopSound(), audio:", audio);
        if (audio) {
            console.log("stopSound()");
            isAudioPlaying = false
            audio.pause();
            audio.currentTime = 0;
        }
    }

    // Function to update the timer display
    function updateTimer() {
        console.log("updateTimer()");
        const formattedTime = formatTime(countdown);
        document.getElementById("timer").textContent = formattedTime;

        if (countdown === 0) {
            clearInterval(timerInterval);
            document.getElementById("message").textContent = "It's time to take a break and do some exercise!";
            playSound();
            document.getElementById("restartButton").style.display = "block"; // Show the "Restart" button
            document.getElementById("stopPlayButton").style.display = "none"; // Show the "Restart" button
        } else {
            countdown--;
        }
    }

    // Function to start the timer
    function startTimer() {
        console.log("startTimer()");
        updateTimer();
        timerInterval = setInterval(updateTimer, 1000);
        document.getElementById("stopPlayButton").textContent = "Stop"; // Change button text to "Stop"
        timerRunning = true; // Set the timer as running
    }

    // Function to stop or play the timer
    function stopPlayTimer() {
        console.log("stopPlayTimer() timerRunning:", timerRunning);
        if (timerRunning) {
            clearInterval(timerInterval);
            document.getElementById("stopPlayButton").textContent = "Play"; // Change button text to "Play"
            document.getElementById("restartButton").style.display = "block"; // Show the "Restart" button
        } else {
            startTimer();
            document.getElementById("stopPlayButton").textContent = "Stop"; // Change button text to "Stop"
            document.getElementById("restartButton").style.display = "none"; // Hide the "Restart" button
        }
        timerRunning = !timerRunning; // Toggle the timer state
    }

    // Function to restart the timer
    function restartTimer() {
        console.log("restartTimer()");
        countdown = 10;//90 * 60;
        document.getElementById("message").textContent = "";
        updateTimer();

        // Clear the existing timerInterval (if it's running)
        if (timerInterval) {
            clearInterval(timerInterval);
        }

        // Stop any audio playback
        stopSound();

        // Start a new timer interval
        timerInterval = setInterval(updateTimer, 1000);
        document.getElementById("restartButton").style.display = "none"; // Hide the "Restart" button
        document.getElementById("stopPlayButton").textContent = "Stop"; // Change button text to "Stop"
        timerRunning = true; // Set the timer as running
    }

    // Event listeners for buttons
    document.getElementById("stopPlayButton").addEventListener("click", stopPlayTimer);
    document.getElementById("restartButton").addEventListener("click", restartTimer);

    // Start the timer when the page loads
    startTimer(); // Call the startTimer function to initiate the timer
});
