document.addEventListener("DOMContentLoaded", () => {
    const mobileBtn = document.querySelector(".mobile-menu-btn");
    const navLinks = document.querySelector(".nav-links");
    const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
    const allHashAnchors = document.querySelectorAll('a[href^="#"]');

    // Mobile menu toggle via class
    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener("click", () => {
            const isOpen = navLinks.classList.toggle("nav-links--open");
            mobileBtn.setAttribute("aria-expanded", String(isOpen));
        });

        navAnchors.forEach((link) => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("nav-links--open");
                mobileBtn.setAttribute("aria-expanded", "false");
            });
        });

        document.addEventListener("click", (event) => {
            const clickedInsideNav = navLinks.contains(event.target);
            const clickedButton = mobileBtn.contains(event.target);

            if (!clickedInsideNav && !clickedButton) {
                navLinks.classList.remove("nav-links--open");
                mobileBtn.setAttribute("aria-expanded", "false");
            }
        });
    }

    // Smooth scrolling for in-page anchors
    allHashAnchors.forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            const targetId = this.getAttribute("href");
            if (!targetId || targetId === "#") return;

            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;

            e.preventDefault();

            const headerOffset = 100;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
            });
        });
    });

    // Scroll reveal (lightweight): only elements explicitly marked .reveal-item
    const revealItems = document.querySelectorAll(".reveal-item");

    if ("IntersectionObserver" in window && revealItems.length) {
        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("reveal-active");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.18, rootMargin: "0px 0px -40px 0px" }
        );

        revealItems.forEach((item) => revealObserver.observe(item));
    } else {
        // Fallback when IntersectionObserver is unavailable
        revealItems.forEach((item) => item.classList.add("reveal-active"));
    }

});