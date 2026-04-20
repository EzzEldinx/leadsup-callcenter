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

document.addEventListener("DOMContentLoaded", () => {
    // تحديد سكشن النتائج
    const resultsSection = document.querySelector('#results');
    const counters = document.querySelectorAll('.result-value');
    let hasAnimated = false; // عشان يعد مرة واحدة بس

    // دالة العداد
    const animateNumbers = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target'); // الرقم المطلوب
            const suffix = counter.getAttribute('data-suffix') || ''; // العلامة (+ أو /5)
            const isDecimal = counter.hasAttribute('data-decimal'); // هل فيه كسر؟
            const speed = 150; // سرعة العداد (رقم أقل = أسرع)
            const inc = target / speed;

            let current = 0;

            const updateCount = () => {
                current += inc;
                if (current < target) {
                    if (isDecimal) {
                        counter.innerText = current.toFixed(1) + suffix;
                    } else {
                        counter.innerText = Math.ceil(current).toLocaleString() + suffix; // toLocaleString بتحط الـ Comma (,) في الـ 100,000
                    }
                    requestAnimationFrame(updateCount); // تكرار سريع جداً
                } else {
                    // التقفيل النهائي للرقم
                    if (isDecimal) {
                        counter.innerText = target.toFixed(1) + suffix;
                    } else {
                        counter.innerText = target.toLocaleString() + suffix;
                    }
                }
            };
            updateCount();
        });
    };

    // مراقب السكرول (Observer)
    if (resultsSection) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !hasAnimated) {
                hasAnimated = true; // نقفلها عشان ماتعدش تاني
                // بنعمل تأخير 400 مللي ثانية عشان العداد يبدأ وقت ما الكارت بيتمرجح لتحت
                setTimeout(animateNumbers, 400); 
            }
        }, { threshold: 0.3 }); // بيشتغل لما 30% من السكشن يظهر

        observer.observe(resultsSection);
    }
});