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


/* ================= CUSTOM AUDIO PLAYER LOGIC ================= */
document.addEventListener('DOMContentLoaded', () => {
    const players = document.querySelectorAll('.pro-audio-player');

    players.forEach(player => {
        const audio = player.querySelector('audio');
        const playBtn = player.querySelector('.play-pause-btn');
        const progressFill = player.querySelector('.progress-fill');
        const progressBar = player.querySelector('.progress-bar');
        const timeDisplay = player.querySelector('.time-display');

        // Play / Pause Toggle
        playBtn.addEventListener('click', () => {
            // Stop other players first
            players.forEach(p => {
                if (p !== player) p.querySelector('audio').pause();
            });

            if (audio.paused) {
                audio.play();
                // تغيير الأيقونة لـ Pause
                playBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
            } else {
                audio.pause();
                // تغيير الأيقونة لـ Play
                playBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
            }
        });

        // Update Progress Bar & Time
        audio.addEventListener('timeupdate', () => {
            const percent = (audio.currentTime / audio.duration) * 100;
            progressFill.style.width = `${percent}%`;

            let currentMins = Math.floor(audio.currentTime / 60);
            let currentSecs = Math.floor(audio.currentTime % 60);
            if (currentSecs < 10) currentSecs = `0${currentSecs}`;
            
            // Assuming total time is set in HTML, just updating current time
            let totalTimeText = timeDisplay.innerText.split(' / ')[1];
            timeDisplay.innerText = `${currentMins}:${currentSecs} / ${totalTimeText}`;
        });

        // Click to Seek
        progressBar.addEventListener('click', (e) => {
            const rect = progressBar.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const width = rect.width;
            audio.currentTime = (clickX / width) * audio.duration;
        });

        // Reset on end
        audio.addEventListener('ended', () => {
            playBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
            progressFill.style.width = '0%';
        });
    });
});


/* ================= HEADSET SCROLL-TRACKING ANIMATION (SMOOTH DIAGONAL GLIDE) ================= */
document.addEventListener('DOMContentLoaded', () => {
    const headset = document.querySelector('.neon-headset');
    const audioSec = document.querySelector('#audio-proof');
    const testSec = document.querySelector('#testimonials') || document.querySelector('.testimonials-section'); 

    if (headset && audioSec && testSec) {
        let ticking = false;

        function updateHeadsetPos() {
            const scrollY = window.scrollY;
            const winHeight = window.innerHeight;

            // بنبدأ الحركة بدري شوية عشان تبقى سلسة
            const startScroll = audioSec.offsetTop - (winHeight * 0.7); 
            // بننهي الحركة في نص سكشن التقييمات
            const endScroll = testSec.offsetTop + (testSec.offsetHeight / 2);
            
            const totalScroll = endScroll - startScroll;
            
            let progress = (scrollY - startScroll) / totalScroll;
            progress = Math.max(0, Math.min(1, progress));

            // ==========================================
            // 1. الحركة الأفقية (X-Axis): دخلناها جوه الشاشة
            // بتبدأ من -20vw (شمال) وتقف عند 55vw (يمين) عشان تبان كلها متتقطعش
            // ==========================================
            const xPos = -20 + (progress * 75); 

            // ==========================================
            // 2. الحركة الرأسية (Y-Axis): نزول انسيابي مريح
            // شيلنا النزلة العمودية المفاجئة، وخليناها تنزل بالتدريج مع السكرول
            // ==========================================
            const startY = -50; 
            const targetY = testSec.offsetTop - audioSec.offsetTop + 100; 
            
            // معادلة نعومة (أس 1.5 بدل 3) عشان تنزل براحتها من غير خبطة
            const smoothProgress = Math.pow(progress, 1.5);
            const yPos = startY + (smoothProgress * (targetY - startY));

            // ==========================================
            // 3. الدوران (Rotation)
            // ==========================================
            const rot = -20 + (progress * 45); 

            // تطبيق الحركة
            headset.style.transform = `translate(${xPos}vw, ${yPos}px) rotate(${rot}deg)`;
            
            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(updateHeadsetPos);
                ticking = true;
            }
        });
        
        updateHeadsetPos();
    }
});