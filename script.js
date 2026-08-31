const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("show");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".reveal").forEach((item) => observer.observe(item));

const realReviews = [
  {
    name: "Radhen Kevadiya",
    text: "Best authentic Neapolitan pizzas in town. Must go if you really love authentic pizzas.",
  },
  {
    name: "Eden Hawks",
    text: "10/10 pizzas - the best we have had in India. The staff were super lovely.",
  },
  {
    name: "Neel Makwana",
    text: "Pizza was so good and totally worth it. The taste was amazing and fresh.",
  },
  {
    name: "Subhangi Ghosh",
    text: "Good ambience with a good range of fresh pizzas. I will definitely have it again.",
  },
];

document.querySelectorAll(".quote-tile").forEach((tile, index) => {
  const review = realReviews[index % realReviews.length];
  const meta = tile.querySelector(".review-meta");
  const quote = tile.querySelector("p");

  if (meta) {
    meta.innerHTML = `<span>${review.name}</span>`;
  }

  if (quote) {
    quote.textContent = `"${review.text}"`;
  }
});

const header = document.querySelector("[data-header]");
let lastScrollY = window.scrollY;

function updateHeaderVisibility() {
  if (!header) return;
  if (header.classList.contains("is-menu-open")) {
    header.classList.remove("is-hidden");
    return;
  }

  const currentScrollY = window.scrollY;
  const scrollingDown = currentScrollY > lastScrollY;

  if (currentScrollY < 24 || !scrollingDown) {
    header.classList.remove("is-hidden");
  } else {
    header.classList.add("is-hidden");
  }

  lastScrollY = currentScrollY;
}

function updateOnScroll() {
  updateHeaderVisibility();
  updateHeroVisibility();
}

window.addEventListener("scroll", updateOnScroll, { passive: true });

const homeHero = document.querySelector(".hero");

function updateHeroVisibility() {
  if (!homeHero) return;
  homeHero.classList.toggle("is-past", window.scrollY >= homeHero.offsetHeight);
}

updateHeroVisibility();

const navToggle = document.querySelector("[data-nav-toggle]");

if (header && navToggle) {
  navToggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("is-menu-open");
    header.classList.remove("is-hidden");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
  });

  header.querySelectorAll(".nav-btn").forEach((link) => {
    link.addEventListener("click", () => {
      header.classList.remove("is-menu-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open navigation menu");
    });
  });
}

function updateFooterRevealHeight() {
  const footer = document.querySelector(".final");
  if (!footer) return;

  document.documentElement.style.setProperty(
    "--final-reveal-height",
    `${footer.getBoundingClientRect().height}px`
  );
}

updateFooterRevealHeight();
window.addEventListener("load", updateFooterRevealHeight);
window.addEventListener("resize", updateFooterRevealHeight);

const menuCards = document.querySelectorAll(".menu-card[data-category]");

document.querySelectorAll(".menu-tab[data-category]").forEach((tab) => {
  tab.addEventListener("click", () => {
    const category = tab.dataset.category;

    document.querySelectorAll(".menu-tab").forEach((item) => item.classList.remove("is-active"));
    tab.classList.add("is-active");

    menuCards.forEach((card) => {
      card.hidden = category !== "all" && card.dataset.category !== category;
    });
  });
});

document.querySelectorAll("[data-tile-link]").forEach((tile) => {
  tile.addEventListener("click", (event) => {
    if (event.target.closest("a")) return;
    window.location.href = tile.dataset.tileLink;
  });

  tile.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    window.location.href = tile.dataset.tileLink;
  });
});

document.querySelectorAll("[data-about-slideshow]").forEach((slideshow) => {
  const images = Array.from(slideshow.querySelectorAll("img"));
  if (images.length < 2) return;

  let activeIndex = 0;

  window.setInterval(() => {
    images[activeIndex].classList.remove("is-active");
    activeIndex = (activeIndex + 1) % images.length;
    images[activeIndex].classList.add("is-active");
  }, 1000);
});

const instagramFeed = document.querySelector("[data-instagram-feed]");
const instagramSlider = document.querySelector("[data-instagram-slider]");

if (instagramFeed || instagramSlider) {
  fetch("assets/instagram-feed.json", { cache: "no-store" })
    .then((response) => (response.ok ? response.json() : []))
    .then((posts) => {
      if (!Array.isArray(posts) || !posts.length) return;

      const postCards = posts
        .slice(0, 6)
        .map((post) => {
          const mediaUrl = post.thumbnail_url || post.media_url || "";
          const caption = post.caption || "Topboy Pizza on Instagram";

          return `
            <a class="instagram-post-card" href="${post.permalink}" target="_blank" rel="noopener noreferrer">
              <img src="${mediaUrl}" alt="${caption.replaceAll('"', "&quot;")}" loading="lazy" />
              <p>${caption}</p>
            </a>
          `;
        });

      if (instagramFeed) {
        instagramFeed.innerHTML = postCards.join("");
      }

      if (instagramSlider) {
        instagramSlider.innerHTML = [...postCards, ...postCards].join("");
      }
    })
    .catch(() => {});
}

const orderButtons = document.querySelectorAll("[data-order-choice]");

if (orderButtons.length) {
  const orderDialog = document.createElement("dialog");
  orderDialog.className = "order-dialog";
  orderDialog.setAttribute("aria-labelledby", "order-dialog-title");
  orderDialog.innerHTML = `
    <button class="order-dialog-close" type="button" aria-label="Close order options">&times;</button>
    <p class="order-dialog-kicker">Topboy Pizza</p>
    <h2 id="order-dialog-title">Order From.</h2>
    <div class="order-dialog-links">
      <a class="order-provider order-provider-swiggy" href="https://www.swiggy.com/menu/1152675?source=sharing" target="_blank" rel="noopener noreferrer">SWIGGY</a>
      <a class="order-provider order-provider-zomato" href="http://zoma.to/r/21441442" target="_blank" rel="noopener noreferrer">ZOMATO</a>
    </div>
  `;
  document.body.append(orderDialog);

  const closeOrderDialog = () => orderDialog.close();

  orderButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      orderDialog.showModal();
    });
  });

  orderDialog.querySelector(".order-dialog-close").addEventListener("click", closeOrderDialog);
  orderDialog.addEventListener("click", (event) => {
    if (event.target === orderDialog) closeOrderDialog();
  });
}
