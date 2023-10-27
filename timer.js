document.addEventListener("DOMContentLoaded", function () {
    // Function to format time as "HH:MM:SS"
    function formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    }

    // Function to play a sound
    function playSound() {
        const audio = new Audio('timer.mp3'); // Replace with the correct audio file path
        audio.play();
    }

    // Function to start the timer
    function startTimer() {
        // Set the initial countdown time to 90 minutes (90 * 60 seconds)
        let countdown = 10;// 90 * 60;
        let timerInterval;

        function updateTimer() {
            const formattedTime = formatTime(countdown);

            // Display the formatted remaining time
            document.getElementById("timer").textContent = formattedTime;

            // Check if the countdown has reached zero
            if (countdown === 0) {
                clearInterval(timerInterval);
                document.getElementById("message").textContent = "It's time to take a break and do some exercise!";
                playSound(); // Play a sound when the timer finishes
                setTimeout(restartTimer, 5000); // Automatically restart the timer after 5 seconds (adjust as needed)
            } else {
                countdown--;
            }
        }

        function restartTimer() {
            countdown = 90 * 60; // Restart the timer
            document.getElementById("message").textContent = ""; // Clear the message
            updateTimer(); // Start the timer again
            timerInterval = setInterval(updateTimer, 1000); // Resume the timer interval
        }

        // Start the timer when the page loads
        updateTimer();
        timerInterval = setInterval(updateTimer, 1000);
    }

    // Call the startTimer function
    startTimer();
});
