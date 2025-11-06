 const video = document.getElementById('scroll-video');
    const progressDisplay = document.getElementById('progress');
    const errorDisplay = document.getElementById('error-message');
    
    // Throttle function to limit scroll event frequency
    function throttle(func, limit) {
        let lastFunc;
        let lastRan;
        return function (...args) {
            if (!lastRan) {
                func.apply(this, args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(() => {
                    if (Date.now() - lastRan >= limit) {
                        func.apply(this, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        };
    }

    // Check if video element is supported
    if (video.canPlayType('video/mp4')) {
        // Wait for video metadata to load
        video.addEventListener('loadedmetadata', () => {
            const videoDuration = video.duration;
            const scrollHeight = document.body.scrollHeight - window.innerHeight;

            // Ensure valid duration and scroll height
            if (!isFinite(videoDuration) || scrollHeight <= 0) {
                errorDisplay.textContent = 'Error: Invalid video duration or scroll height.';
                return;
            }

            // Update video time and progress
            const updateVideoTime = () => {
                const scrollPosition = window.scrollY;
                const scrollFraction = Math.min(Math.max(scrollPosition / scrollHeight, 0), 1); // Clamp between 0 and 1
                const videoTime = scrollFraction * videoDuration;

                // Update video current time
                if (Math.abs(video.currentTime - videoTime) > 0.1) { // Avoid unnecessary updates
                    video.currentTime = videoTime;
                }

                // Update progress display
                const scrollPercent = (scrollFraction * 100).toFixed(1);
                progressDisplay.textContent = `Scroll Progress: ${scrollPercent}%`;
            };

            // Throttled scroll handler
            const throttledUpdate = throttle(() => {
                requestAnimationFrame(updateVideoTime);
            }, 20); // ~60fps

            // Add scroll event listener
            window.addEventListener('scroll', throttledUpdate);
        });

        video.addEventListener('error', () => {
            errorDisplay.textContent = 'Error: Failed to load video. Check the video source.';
        });

        video.pause(); 
    } else {
        errorDisplay.textContent = 'Error: Your browser does not support MP4 videos.';
    }

   document.addEventListener('DOMContentLoaded', () => {
            const sections = document.querySelectorAll('section, nav');
            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                    }
                });
            }, {
                threshold: 0.1
            });

            sections.forEach(section => {
                observer.observe(section);
            });

            window.addEventListener('scroll', () => {
                const timeline = document.querySelector('.timeline-bar');
                if (timeline) {
                    let scrollPosition = window.pageYOffset;
                    timeline.style.transform = `translateX(${scrollPosition * 0.1}px)`;
                }
            });
        });

        //Javascript to replace hover with morph in trigger!!!!!!!!!!!!!!!!!!!!!!!!!