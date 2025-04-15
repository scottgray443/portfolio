import { data } from "https://cdn.jsdelivr.net/gh/scottgray443/portfolio@f44c96a6001b4831d2c24f14e85e3a73de883231/data.js";

gsap.registerPlugin(ScrollTrigger);

// Initialize Lenis smooth scrolling
const lenis = new Lenis();
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// Get DOM elements
const pinnedSection = document.querySelector(".pinned");
const progressBar = document.querySelector(".progress");
const images = gsap.utils.toArray(".img");

// Safety checks for required elements
if (!pinnedSection || !progressBar || images.length === 0) {
  console.error("Required elements not found in DOM");
}

// Calculate pinned section height
const pinnedHeight = window.innerHeight * 10;

// Animation functions
function animateImageEntry(img) {
  if (!img) return;
  
  gsap.fromTo(
    img,
    {
      scale: 1.25,
      clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
      opacity: 0,
    },
    {
      scale: 1,
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      opacity: 1,
      duration: 1,
      ease: "power2.inOut",
    }
  );

  const imgChild = img.querySelector("img");
  if (imgChild) {
    gsap.fromTo(
      imgChild,
      {
        filter: "contrast(2) brightness(10)",
      },
      {
        filter: "contrast(1) brightness(1)",
        duration: 1,
        ease: "power2.inOut",
      }
    );
  }
}

function animateImageExitForward(img) {
  if (!img) return;
  
  gsap.to(img, {
    scale: 0.5,
    opacity: 0,
    duration: 1,
    ease: "power2.inOut",
  });
}

function animateImageExitReverse(img) {
  if (!img) return;
  
  gsap.to(img, {
    scale: 1.25,
    clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
    duration: 1,
    ease: "power2.inOut",
  });

  const imgChild = img.querySelector("img");
  if (imgChild) {
    gsap.to(imgChild, {
      filter: "contrast(2) brightness(10)",
      duration: 1,
      ease: "power2.inOut",
    });
  }
}

function updateInfoContent(index) {
  const infoItems = document.querySelectorAll(".info > div p");
  const link = document.querySelector(".main-project_link a");

  // Safety checks
  if (!link) {
    console.warn("Link element not found!");
    return;
  }

  // Clear existing content
  infoItems.forEach((item) => (item.innerHTML = ""));
  link.setAttribute("href", "#");

  // Verify data exists
  if (!data[index]) {
    console.warn(`No data found for index ${index}`);
    return;
  }

  const item = data[index];
  const contentArray = [item.title, item.tagline, item.year, item.tag];

  // Update info items with letter-by-letter animation
  infoItems.forEach((element, i) => {
    if (i < 4 && element) {
      const letters = contentArray[i].split("");
      letters.forEach((letter, index) => {
        const span = document.createElement("span");
        span.textContent = letter;
        span.style.opacity = 0;
        element.appendChild(span);

        gsap.to(span, {
          opacity: 1,
          duration: 0.01,
          delay: 0.03 * index,
          ease: "power1.inOut",
        });
      });
    }
  });

  // Update link
  link.setAttribute("href", item.link || "#");
  const linkText = link.textContent || "View Project";
  link.innerHTML = "";
  
  linkText.split("").forEach((letter, index) => {
    const span = document.createElement("span");
    span.textContent = letter;
    span.style.opacity = 0;
    link.appendChild(span);

    gsap.to(span, {
      opacity: 1,
      duration: 0.01,
      delay: 0.03 * index,
      ease: "power1.inOut",
    });
  });
}

// Initialize first content
if (images.length > 0) {
  updateInfoContent(0);
  animateImageEntry(images[0]);
}

let lastCycle = 0;

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

    if (currentCycle < images.length) {
      const currentImage = images[currentCycle];
      const scale = 1 - (0.25 * cycleProgress) / 100;
      
      if (currentImage) {
        gsap.to(currentImage, {
          scale: scale,
          duration: 0.1,
          overwrite: "auto",
        });
      }

      if (currentCycle !== lastCycle) {
        if (self.direction > 0) {
          if (lastCycle < images.length && images[lastCycle]) {
            animateImageExitForward(images[lastCycle]);
          }
          if (currentCycle < images.length && images[currentCycle]) {
            animateImageEntry(images[currentCycle]);
            gsap.delayedCall(0.5, () => updateInfoContent(currentCycle));
          }
        } else {
          if (currentCycle < images.length && images[currentCycle]) {
            animateImageEntry(images[currentCycle]);
            gsap.delayedCall(0.5, () => updateInfoContent(currentCycle));
          }
          if (lastCycle < images.length && images[lastCycle]) {
            animateImageExitReverse(images[lastCycle]);
          }
        }
        lastCycle = currentCycle;
      }
    }

    if (progressBar) {
      if (currentCycle < 5) {
        gsap.to(progressBar, {
          height: `${cycleProgress}%`,
          duration: 0.1,
          overwrite: true,
        });

        if (cycleProgress < 1 && self.direction > 0) {
          gsap.set(progressBar, { height: "0%" });
        } else if (cycleProgress > 99 && self.direction < 0) {
          gsap.set(progressBar, { height: "100%" });
        }
      } else {
        gsap.to(progressBar, {
          height: self.direction > 0 ? "100%" : `${cycleProgress}%`,
          duration: 0.1,
          overwrite: true,
        });
      }
    }
  },
});
