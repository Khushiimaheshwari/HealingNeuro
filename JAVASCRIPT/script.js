document.addEventListener("DOMContentLoaded", function() {
    // Fetch Navbar and then add event listeners
    fetch('/html/navbar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar').innerHTML = data;

            // Now, after the navbar is loaded, we can select elements and add event listeners
            const profileIcon = document.querySelector(".btn2");
            const profileDropdown = document.querySelector(".dropdown_menu1");
            const toggleButton = document.querySelector(".toggle_btn");
            const toggleDropdown = document.querySelector(".dropdown_menu");

            // Log elements to confirm they are being found
            console.log("Profile Icon:", profileIcon);
            console.log("Profile Dropdown:", profileDropdown);
            console.log("Toggle Button:", toggleButton);
            console.log("Toggle Dropdown:", toggleDropdown);

            // Handle profile dropdown
            if (profileIcon && profileDropdown) {
                profileIcon.addEventListener("click", function(e) {
                    e.stopPropagation();  // Prevent click from propagating to document
                    profileDropdown.classList.toggle("open");  // Toggle visibility of profile dropdown
                });
            } else {
                console.error("Profile icon or dropdown not found");
            }

            // Handle toggle dropdown
            if (toggleButton && toggleDropdown) {
                toggleButton.addEventListener("click", function(e) {
                    e.stopPropagation();  // Prevent click from propagating to document
                    toggleDropdown.classList.toggle("open");  // Toggle visibility of toggle dropdown
                });
            } else {
                console.error("Toggle button or dropdown not found");
            }

            // Close dropdowns if click happens outside either of them
            document.addEventListener("click", function(e) {
                // If click is outside both dropdowns and toggle buttons, close both dropdowns
                if (profileIcon && profileDropdown && !profileIcon.contains(e.target) && !profileDropdown.contains(e.target)) {
                    profileDropdown.classList.remove("open");
                }
                if (toggleButton && toggleDropdown && !toggleButton.contains(e.target) && !toggleDropdown.contains(e.target)) {
                    toggleDropdown.classList.remove("open");
                }
            });
        })
        .catch(error => console.error("Failed to load navbar:", error));
});


// typing animation
document.addEventListener("DOMContentLoaded", () => {
    const subtitle = document.querySelector(".subtitle span");
    const text = subtitle.textContent;

    let index = 0;
    let typingSpeed = window.innerWidth <= 768 ? 75 : 100; 
    function type() {
        if (index < text.length) {
            subtitle.textContent = text.substring(0, index + 1);
            index++;
            setTimeout(type, typingSpeed); 
        } else {
            setTimeout(() => {
              index = 0;
              type();
            }, 2000); 
        }
    }

  window.addEventListener("resize", () => {
      typingSpeed = window.innerWidth <= 768 ? 75 : 100;
  });
  type();
});