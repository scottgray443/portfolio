import { data } from "https://cdn.jsdelivr.net/gh/scottgray443/portfolio@f44c96a6001b4831d2c24f14e85e3a73de883231/data.js";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Initialize Lenis with error handling
let lenis;
try {
  lenis = new Lenis();
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
} catch (e) {
  console.warn("Lenis initialization failed:", e);
}

// Safe element querying with fallbacks
const getSafeElement = (selector) => {
  const el = document.querySelector(selector);
  if (!el) console.warn(`Element not found: ${selector}`);
  return el;
};

// Get DOM elements with null checks
const pinnedSection = getSafeElement(".pinned");
const progressBar = getSafeElement(".progress");
const images = gsap.utils.toArray(".img") || [];
const infoItems = document.querySelectorAll(".info > div p") || [];
const link = getSafeElement(".main-project_link a");

// Animation functions with complete safety checks
function animateImageEntry(img) {
  if (!img) {
    console.warn("animateImageEntry: No image provided");
    return;
  }

  gsap.fromTo(img,
    { scale: 1.25, clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)", opacity: 0 },
    { scale: 1, clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", opacity: 1, duration: 1, ease: "power2.inOut" }
  );

  const imgChild = img.querySelector("img");
  if (imgChild) {
    gsap.fromTo(imgChild,
      { filter: "contrast(2) brightness(10)" },
      { filter: "contrast(1) brightness(1)", duration: 1, ease: "power2.inOut" }
    );
  }
}

function safeSetAttribute(element, attribute, value) {
  if (element && element.setAttribute) {
    element.setAttribute(attribute, value);
  } else {
    console.warn(`Cannot set attribute on ${element}`);
  }
}

function updateInfoContent(index) {
  // Verify data exists
  if (!Array.isArray(data) || !data[index]) {
    console.warn(`No valid data for index ${index}`);
    return;
  }

  // Clear existing content safely
  infoItems.forEach(item => {
    if (item) item.innerHTML = "";
  });

  if (link) {
    safeSetAttribute(link, "href", "#");
  }

  const item = data[index];
  const contentArray = [
    item.title || "",
    item.tagline || "",
    item.year || "",
    item.tag || ""
  ];

  // Update info items with animation
  infoItems.forEach((element, i) => {
    if (element && i < 4) {
      const text = contentArray[i];
      text.split("").forEach((letter, idx) => {
        const span = document.createElement("span");
        span.textContent = letter;
        span.style.opacity = 0;
        element.appendChild(span);
        gsap.to(span, { opacity: 1, duration: 0.01, delay: 0.03 * idx });
      });
    }
  });

  // Update link if it exists
  if (link) {
    safeSetAttribute(link, "href", item.link || "#");
    const linkText = link.textContent || "View Project";
    link.innerHTML = "";
    
    linkText.split("").forEach((letter, idx) => {
      const span = document.createElement("span");
      span.textContent = letter;
      span.style.opacity = 0;
      link.appendChild(span);
      gsap.to(span, { opacity: 1, duration: 0.01, delay: 0.03 * idx });
    });
  }
}

// Initialize only if we have the required elements
if (pinnedSection && images.length > 0) {
  const pinnedHeight = window.innerHeight * 10;
  let lastCycle = 0;

  // Initial setup
  updateInfoContent(0);
  animateImageEntry(images[0]);

  // Create scroll trigger
  ScrollTrigger.create({
    trigger: pinnedSection,
    start: "top top",
    end: `+=${pinnedHeight} * 2`,
    pin: true,
    pinSpacing: true,
    scrub: 0.1,
    onUpdate: (self) => {
      const totalProgress = self.progress * 5;
      const currentCycle = Math.floor(totalProgress);
      const cycleProgress = (totalProgress % 1) * 100;

      if (currentCycle < images.length && images[currentCycle]) {
        const scale = 1 - (0.25 * cycleProgress) / 100;
        gsap.to(images[currentCycle], { scale, duration: 0.1, overwrite: "auto" });

        if (currentCycle !== lastCycle) {
          if (self.direction > 0) {
            if (images[lastCycle]) animateImageExitForward(images[lastCycle]);
            animateImageEntry(images[currentCycle]);
            gsap.delayedCall(0.5, () => updateInfoContent(currentCycle));
          } else {
            animateImageEntry(images[currentCycle]);
            gsap.delayedCall(0.5, () => updateInfoContent(currentCycle));
            if (images[lastCycle]) animateImageExitReverse(images[lastCycle]);
          }
          lastCycle = currentCycle;
        }
      }

      if (progressBar) {
        const heightValue = currentCycle < 5 ? `${cycleProgress}%` : (self.direction > 0 ? "100%" : `${cycleProgress}%`);
        gsap.to(progressBar, { height: heightValue, duration: 0.1, overwrite: true });
      }
    }
  });
} else {
  console.warn("Could not initialize scroll effects - missing required elements");
}
