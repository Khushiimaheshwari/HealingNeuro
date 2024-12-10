document.addEventListener("DOMContentLoaded", () => {
    // Get the button and the test section
    const startTestButton = document.querySelector(".start-test-btn");
    const testsSection = document.querySelector(".tests-section");

    // Add click event listener to the button
    startTestButton.addEventListener("click", () => {
        // Make the tests section visible
        testsSection.style.display = "block";

        // Smoothly scroll to the tests section
        testsSection.scrollIntoView({ behavior: "smooth" });
    });
});

