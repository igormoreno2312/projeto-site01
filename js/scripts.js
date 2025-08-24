// --- Mobile nav toggle
(function () {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.getElementById("navLinks");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      links.classList.toggle("show");
    });
  }
})();

// --- Footer year
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ---- Modal (Login)
function openModal() {
  const m = document.getElementById("loginModal");
  if (m) {
    m.classList.add("open");
    m.setAttribute("aria-hidden", "false");
  }
}
function closeModal() {
  const m = document.getElementById("loginModal");
  if (m) {
    m.classList.remove("open");
    m.setAttribute("aria-hidden", "true");

    // Reset to login view when closing to ensure consistency
    const loginView = document.getElementById("loginView");
    const forgotPasswordView = document.getElementById("forgotPasswordView");
    if (loginView && forgotPasswordView) {
      // Use a timeout to avoid a visual flash while the modal closes
      setTimeout(() => {
        forgotPasswordView.classList.add("hidden");
        loginView.classList.remove("hidden");
      }, 250); // Should match the CSS transition duration
    }
  }
}
function togglePassword() {
  const pass = document.getElementById("loginSenha");
  if (!pass) return;
  pass.type = pass.type === "password" ? "text" : "password";
}
document.addEventListener("DOMContentLoaded", () => {
  // --- Theme Toggler
  const themeToggle = document.getElementById("theme-toggle");
  const htmlEl = document.documentElement;

  const applyTheme = (theme) => {
    htmlEl.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  };

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const currentTheme = htmlEl.getAttribute("data-theme") || "light";
      const newTheme = currentTheme === "light" ? "dark" : "light";
      applyTheme(newTheme);
    });
  }

  // Apply saved theme on load, or system preference
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (savedTheme) {
    applyTheme(savedTheme);
  } else if (prefersDark) {
    applyTheme("dark");
  }
  // --- End Theme Toggler

  // --- Active Nav Link ---
  const navLinksContainer = document.getElementById("navLinks");
  if (navLinksContainer) {
    const links = navLinksContainer.querySelectorAll("a");
    // Get the filename of the current page (e.g., "carrinho.html")
    const currentPage = window.location.pathname.split("/").pop();

    links.forEach((link) => {
      // Get the filename from the link's href
      const linkPage = link.getAttribute("href").split("/").pop().split("#")[0];

      // Add 'active' class if the link's page matches the current page
      if (linkPage && currentPage === linkPage) {
        link.classList.add("active");
      }
    });
  }

  // Open modal via nav button (index only)
  const link = document.getElementById("loginLink");
  if (link) {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      openModal();
    });
  }
  // Open via hash #login
  if (location.hash === "#login") {
    openModal();
  }

  // Show/Hide password
  const show = document.getElementById("showPass");
  if (show) {
    show.addEventListener("change", togglePassword);
  }

  // Preload saved credentials (if user chose to save)
  const savedEmail = localStorage.getItem("savedEmail");
  const savedPass = localStorage.getItem("savedPass");
  if (savedEmail) {
    const e = document.getElementById("loginEmail");
    if (e) e.value = savedEmail;
  }
  if (savedPass) {
    const s = document.getElementById("loginSenha");
    if (s) s.value = savedPass;
  }

  // Persist on submit
  const form = document.getElementById("loginForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const save = document.getElementById("savePass");
      if (save && save.checked) {
        localStorage.setItem(
          "savedEmail",
          document.getElementById("loginEmail").value
        );
        localStorage.setItem(
          "savedPass",
          document.getElementById("loginSenha").value
        );
      }
      closeModal();
      showToast("Login realizado!");
    });
  }

  // Handle Forgot Password flow
  const loginView = document.getElementById("loginView");
  const forgotPasswordView = document.getElementById("forgotPasswordView");
  const toForgotPasswordLink = document.getElementById("forgotPasswordLink");
  const toLoginLink = document.getElementById("backToLoginLink");
  const forgotPasswordForm = document.getElementById("forgotPasswordForm");

  if (toForgotPasswordLink) {
    toForgotPasswordLink.addEventListener("click", (e) => {
      e.preventDefault();
      if (loginView && forgotPasswordView) {
        loginView.classList.add("hidden");
        forgotPasswordView.classList.remove("hidden");
      }
    });
  }

  if (toLoginLink) {
    toLoginLink.addEventListener("click", (e) => {
      e.preventDefault();
      if (loginView && forgotPasswordView) {
        forgotPasswordView.classList.add("hidden");
        loginView.classList.remove("hidden");
      }
    });
  }

  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener("submit", (e) => {
      e.preventDefault();
      showToast("Link de recuperação enviado com sucesso!");
      closeModal();
    });
  }

  // Close modal logic
  const modal = document.getElementById("loginModal");
  if (modal) {
    const closeButton = modal.querySelector(".close-btn");
    // Close on backdrop click
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
    // Close on button click
    if (closeButton) {
      closeButton.addEventListener("click", closeModal);
    }
  }

  // --- Hero Carousel
  const carousel = document.querySelector(".carousel");
  if (carousel) {
    const slidesContainer = carousel.querySelector(".carousel-slides");
    const slides = Array.from(carousel.querySelectorAll(".carousel-slide"));
    const prevBtn = carousel.querySelector(".carousel-btn.prev");
    const nextBtn = carousel.querySelector(".carousel-btn.next");
    const dotsContainer = carousel.querySelector(".carousel-dots");
    let currentIndex = 0;
    let intervalId = null;

    if (slides.length > 0) {
      // Create dots
      slides.forEach((_, i) => {
        const dot = document.createElement("button");
        dot.classList.add("dot");
        dot.setAttribute("aria-label", `Ir para slide ${i + 1}`);
        dot.addEventListener("click", () => {
          goToSlide(i);
          resetInterval();
        });
        dotsContainer.appendChild(dot);
      });

      const dots = Array.from(dotsContainer.querySelectorAll(".dot"));

      const goToSlide = (index) => {
        slidesContainer.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach((dot) => dot.classList.remove("active"));
        dots[index].classList.add("active");
        currentIndex = index;
      };

      const showNextSlide = () => {
        const newIndex = (currentIndex + 1) % slides.length;
        goToSlide(newIndex);
      };

      const showPrevSlide = () => {
        const newIndex = (currentIndex - 1 + slides.length) % slides.length;
        goToSlide(newIndex);
      };

      const startInterval = () => {
        intervalId = setInterval(showNextSlide, 3000); // Change slide every 3 seconds
      };

      const resetInterval = () => {
        clearInterval(intervalId);
        startInterval();
      };

      nextBtn.addEventListener("click", () => {
        showNextSlide();
        resetInterval();
      });

      prevBtn.addEventListener("click", () => {
        showPrevSlide();
        resetInterval();
      });

      // Initialize
      goToSlide(0);
      startInterval();
    }
  }

  // Render cart if on carrinho.html
  renderCart();

  // Render product details if on produto-detalhe.html
  renderProductDetailsPage();

  // --- Unified Click Event Listener ---
  document.addEventListener("click", (e) => {
    // Add to Cart from Product List
    if (e.target.matches(".add-to-cart-btn")) {
      e.preventDefault();
      const btn = e.target;
      const card = btn.closest(".produto");
      if (!card) return;

      // Get product data from the DOM
      const name = card.querySelector("h2")?.textContent;
      const priceText = card.querySelector(".price")?.textContent;
      const color = btn.dataset.color;
      const image = card.querySelector(".produto-imagem")?.getAttribute("src");
      const size = getSelectedSizeFromButton(btn);

      if (!size) {
        showToast("Por favor, selecione um tamanho.");
        return;
      }

      // Validate data before adding to cart
      if (!name || !priceText || !color) {
        console.error("Dados do produto ausentes. Verifique o HTML.", {
          name,
          priceText,
          color,
        });
        showToast("Não foi possível adicionar o produto. Tente novamente.");
        return;
      }

      const price = parseFloat(priceText.replace("R$", "").replace(",", "."));
      addToCart(name, price, size, color, image || "");
    }

    // Remove from Cart Logic
    if (e.target.matches(".remove-item-btn")) {
      const itemId = e.target.dataset.itemId;
      if (itemId) {
        removeFromCart(itemId);
      }
    }
  });

  // Handle quantity changes in cart
  const cartItemsContainer = document.getElementById("cartItems");
  if (cartItemsContainer) {
    cartItemsContainer.addEventListener("change", (e) => {
      if (e.target.matches(".quantity-input")) {
        const itemId = e.target.dataset.itemId;
        // Ensure quantity is a positive number
        const newQuantity = Math.max(1, parseInt(e.target.value, 10) || 1);
        updateCartQuantity(itemId, newQuantity);
      }
    });
  }

  // Handle Registration Form
  const registrationForm = document.getElementById("registrationForm");
  if (registrationForm) {
    const fields = {
      nome: registrationForm.querySelector("#nome"),
      cpf: registrationForm.querySelector("#cpf"),
      cep: registrationForm.querySelector("#cep"),
      logradouro: registrationForm.querySelector("#logradouro"),
      numero: registrationForm.querySelector("#numero"),
      bairro: registrationForm.querySelector("#bairro"),
      cidade: registrationForm.querySelector("#cidade"),
      estado: registrationForm.querySelector("#estado"),
      telefone: registrationForm.querySelector("#telefone"),
      email: registrationForm.querySelector("#email"),
      senha: registrationForm.querySelector("#senha"),
      confirmarSenha: registrationForm.querySelector("#confirmar-senha"),
    };

    // Add event listeners for real-time validation
    for (const field of Object.values(fields)) {
      if (field) {
        field.addEventListener("input", () => validateField(field, fields));
      }
    }

    // Add specific listeners
    fields.telefone?.addEventListener("input", maskPhone);
    fields.cpf?.addEventListener("input", maskCpf);
    fields.cep?.addEventListener("input", maskCep);
    fields.senha?.addEventListener("input", () => {
      if (fields.confirmarSenha.value) {
        validateField(fields.confirmarSenha, fields);
      }
      // Check password strength on input
      checkPasswordStrength(fields.senha.value);
    });

    // Add CEP lookup listener
    fields.cep?.addEventListener("blur", () => {
      handleCepLookup(fields);
    });

    registrationForm.addEventListener("submit", function (e) {
      e.preventDefault();
      let isFormValid = true;
      // Validate all fields on submit and focus the first invalid one
      for (const field of Object.values(fields)) {
        if (field && !validateField(field, fields)) {
          isFormValid = false;
        }
      }

      if (isFormValid) {
        showToast("Cadastro realizado com sucesso!");
        this.reset();
        Object.values(fields).forEach(clearError);
      } else {
        showToast("Por favor, corrija os campos inválidos.");
      }
    });
  }

  // Handle Shipping Calculation
  const calculateShippingBtn = document.getElementById(
    "calculate-shipping-btn"
  );
  if (calculateShippingBtn) {
    calculateShippingBtn.addEventListener("click", handleShippingCalculation);
  }

  // CEP Input Mask
  const cepInput = document.getElementById("cep-input");
  if (cepInput) {
    cepInput.addEventListener("input", maskCep);
  }

  // Handle Checkout Button
  const checkoutBtn = document.getElementById("checkoutBtn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", async () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      if (cart.length === 0) {
        showToast("Seu carrinho está vazio!");
        return;
      }

      // No carrinho, o frete é obrigatório para finalizar
      const isCartPage = window.location.pathname.includes("carrinho.html");
      if (isCartPage && selectedShippingCost === 0) {
        showToast("Por favor, calcule o frete antes de finalizar.");
        document.getElementById("cep-input")?.focus();
        return;
      }

      checkoutBtn.classList.add("loading");
      checkoutBtn.disabled = true;

      try {
        // 1. Envia os dados do carrinho para o seu novo backend
        const response = await fetch(
          "http://localhost:4000/api/create-payment-preference",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cart, shippingCost: selectedShippingCost }),
          }
        );

        if (!response.ok)
          throw new Error("Não foi possível iniciar o pagamento.");
        const data = await response.json();

        // 2. Redireciona o usuário para a URL de pagamento retornada pelo backend
        if (data.redirectUrl) window.location.href = data.redirectUrl;
        else throw new Error("URL de pagamento não recebida.");
      } catch (error) {
        showToast(error.message || "Erro ao processar o pedido.");
        checkoutBtn.classList.remove("loading");
        checkoutBtn.disabled = false;
      }
    });
  }

  // --- Scroll-triggered Animations ---
  // Select all elements we want to animate
  const animatedElements = document.querySelectorAll(
    ".hero-content, .hero-media, .card, .produto, .form, .cart-items, .cart-summary, .product-detail-grid"
  );

  // Check if browser supports IntersectionObserver
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target); // Stop observing once visible
          }
        });
      },
      {
        rootMargin: "0px 0px -50px 0px", // Start animation a bit before it's fully visible
      }
    );

    animatedElements.forEach((el) => {
      el.classList.add("animate-on-scroll");
      observer.observe(el);
    });
  }

  // --- Back to Top Button ---
  const backToTopBtn = document.getElementById("back-to-top-btn");
  if (backToTopBtn) {
    // Show/hide button based on scroll position
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add("show");
      } else {
        backToTopBtn.classList.remove("show");
      }
    });

    // Scroll to top on click
    backToTopBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  // --- Cookie Consent Banner ---
  const cookieBanner = document.getElementById("cookie-consent-banner");
  const acceptCookiesBtn = document.getElementById("cookie-accept-btn");

  if (cookieBanner && acceptCookiesBtn) {
    // Check if user has already accepted
    if (!localStorage.getItem("cookies_accepted")) {
      cookieBanner.classList.add("show");
    }

    acceptCookiesBtn.addEventListener("click", () => {
      cookieBanner.classList.remove("show");
      localStorage.setItem("cookies_accepted", "true");
    });
  }
});

// ---- Cart

const allProducts = [
  {
    id: "masc-preta-1",
    name: "Camiseta Gola Careca 100% Algodão",
    price: 59.9,
    image: "imagens/camisetas masculinas/camiseta preta frente.png",
    color: "Preta",
    sizes: ["P", "M", "G"],
    material: "100% Algodão Fio 30.1 Penteado",
    gola: "Gola careca com reforço ombro a ombro",
    qualidade: "Não encolhe e não desbota após a lavagem.",
    rating: 4.5,
    reviews: 18,
    comments: [
      {
        author: "João S.",
        date: "12/05/2024",
        text: "Ótima qualidade, tecido muito confortável. Recomendo!",
      },
      {
        author: "Maria P.",
        date: "10/05/2024",
        text: "A camiseta é linda, mas achei a gola um pouco apertada.",
      },
    ],
  },
  {
    id: "masc-preta-2",
    name: "Camiseta Gola Careca 100% Algodão",
    price: 59.9,
    image: "imagens/camisetas masculinas/camiseta preta frente 1.png",
    color: "Preta",
    sizes: ["P", "M", "G"],
    material: "100% Algodão Fio 30.1 Penteado",
    gola: "Gola careca com reforço ombro a ombro",
    qualidade: "Não encolhe e não desbota após a lavagem.",
    rating: 4.8,
    reviews: 25,
    comments: [
      {
        author: "Carlos F.",
        date: "20/05/2024",
        text: "Caimento perfeito e a estampa é muito bonita.",
      },
      {
        author: "Ana L.",
        date: "18/05/2024",
        text: "Chegou rápido e o material é excelente.",
      },
    ],
  },
  {
    id: "masc-preta-3",
    name: "Camiseta Gola Careca 100% Algodão",
    price: 59.9,
    image: "imagens/camisetas masculinas/camiseta preta frente 2.png",
    color: "Preta",
    sizes: ["P", "M", "G"],
    material: "100% Algodão Fio 30.1 Penteado",
    gola: "Gola careca com reforço ombro a ombro",
    qualidade: "Não encolhe e não desbota após a lavagem.",
    rating: 4.7,
    reviews: 21,
    comments: [
      {
        author: "Pedro M.",
        date: "15/05/2024",
        text: "Gostei muito, comprarei outras cores.",
      },
    ],
  },
  {
    id: "masc-branca-1",
    name: "Camiseta Gola Careca 100% Algodão",
    price: 59.9,
    image: "imagens/camisetas masculinas/camiseta branca frente.png",
    color: "Branca",
    sizes: ["P", "M", "G"],
    material: "100% Algodão Fio 30.1 Penteado",
    gola: "Gola careca com reforço ombro a ombro",
    qualidade: "Não encolhe e não desbota após a lavagem.",
    rating: 4.6,
    reviews: 15,
    comments: [
      {
        author: "Juliana R.",
        date: "05/05/2024",
        text: "Camiseta básica e de ótima qualidade. Essencial!",
      },
      {
        author: "Marcos V.",
        date: "02/05/2024",
        text: "Tecido muito bom, não fica transparente.",
      },
    ],
  },
  {
    id: "fem-preta-1",
    name: "Camiseta 100% Algodão",
    price: 59.9,
    image: "imagens/camisetas femininas/camiseta preta frente 1.png",
    color: "Preta",
    sizes: ["P", "M", "G"],
    material: "100% Algodão Fio 30.1 Penteado",
    gola: "Gola careca com reforço ombro a ombro",
    qualidade: "Não encolhe e não desbota após a lavagem.",
    rating: 4.9,
    reviews: 32,
    comments: [
      {
        author: "Beatriz C.",
        date: "22/05/2024",
        text: "A melhor camiseta preta que já tive! Veste super bem.",
      },
      {
        author: "Fernanda A.",
        date: "21/05/2024",
        text: "Qualidade impecável, vale cada centavo.",
      },
    ],
  },
  {
    id: "fem-branca-1",
    name: "Camiseta 100% Algodão",
    price: 59.9,
    image: "imagens/camisetas femininas/camiseta branca frente.png",
    color: "Branca",
    sizes: ["P", "M", "G"],
    material: "100% Algodão Fio 30.1 Penteado",
    gola: "Gola careca com reforço ombro a ombro",
    qualidade: "Não encolhe e não desbota após a lavagem.",
    rating: 4.7,
    reviews: 19,
    comments: [
      {
        author: "Clara S.",
        date: "19/05/2024",
        text: "A camiseta branca perfeita! Não é transparente e veste muito bem.",
      },
    ],
  },
  // Note: fem-preta-2 is a duplicate in the HTML, linking to the same product.
  {
    id: "fem-rosa-1",
    name: "Camiseta 100% Algodão",
    price: 59.9,
    image: "imagens/camisetas femininas/camiseta rosa frente.png",
    color: "Rosa",
    sizes: ["P", "M", "G"],
    material: "100% Algodão Fio 30.1 Penteado",
    gola: "Gola careca com reforço ombro a ombro",
    qualidade: "Não encolhe e não desbota após a lavagem.",
    rating: 4.4,
    reviews: 12,
    comments: [
      {
        author: "Gabriela L.",
        date: "11/04/2024",
        text: "A cor é linda e o tecido é muito macio.",
      },
    ],
  },
];

let selectedShippingCost = 0;

// --- Toast Notification
function showToast(message) {
  // Check if a container exists, if not, create it
  let toastContainer = document.getElementById("toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "toast-container";
    document.body.appendChild(toastContainer);
  }

  // Create the toast element
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;

  // Add it to the container
  toastContainer.appendChild(toast);

  // Make it visible
  setTimeout(() => toast.classList.add("show"), 100);

  // Hide and remove it after 3 seconds
  setTimeout(() => {
    toast.classList.remove("show");
    toast.addEventListener("transitionend", () => toast.remove());
  }, 3000);
}

function getSelectedSizeFromButton(btn) {
  const card = btn.closest(".produto");
  if (!card) return "";
  const checked = card.querySelector(".tamanhos input:checked");
  return checked ? checked.value : "";
}

function addToCart(name, price, tamanho, cor, image) {
  let cart = JSON.parse(localStorage.getItem("cart") || "[]");

  // Cria um ID único para a variante do produto (nome, tamanho, cor)
  const itemId = `${name}-${tamanho}-${cor}`.replace(/\s+/g, "-").toLowerCase();

  const existingItem = cart.find((item) => item.id === itemId);

  if (existingItem) {
    // Se o item já existe, incrementa a quantidade
    existingItem.qty = (existingItem.qty || 1) + 1;
    showToast("Quantidade atualizada no carrinho!");
  } else {
    // Senão, adiciona o novo item
    // Usamos 'size' para consistência com o renderizador do carrinho
    cart.push({ id: itemId, name, price, size: tamanho, cor, qty: 1, image });
    showToast("Produto adicionado ao carrinho!");
  }

  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartQuantity(itemId, newQuantity) {
  let cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const itemToUpdate = cart.find((item) => String(item.id) === itemId);

  if (itemToUpdate) {
    itemToUpdate.qty = newQuantity;
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart(); // Re-render to update totals and prices
}

function removeFromCart(itemId) {
  let cart = JSON.parse(localStorage.getItem("cart") || "[]");
  // A comparação é robustecida convertendo o `item.id` para String.
  // Isso garante que itens "fantasmas" com um `id` de valor `undefined`
  // (que vêm de dados antigos no localStorage) possam ser removidos, pois
  // `String(undefined)` se torna a string `"undefined"`, permitindo a comparação correta.
  cart = cart.filter((item) => String(item.id) !== itemId);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart(); // Re-renderiza o carrinho
}

function updateCartSummary() {
  const subtotalEl = document.getElementById("cart-subtotal");
  const shippingEl = document.getElementById("cart-shipping");
  const totalEl = document.getElementById("cart-total");

  if (!subtotalEl || !totalEl || !shippingEl) return;

  const cart = JSON.parse(localStorage.getItem("cart") || "[]");

  const subtotal = cart.reduce((sum, item) => {
    return sum + item.price * item.qty;
  }, 0);

  // O frete só é aplicado se houver itens no carrinho
  const finalShippingCost = cart.length > 0 ? selectedShippingCost : 0;
  const total = subtotal + finalShippingCost;

  const formatPrice = (price) => `R$ ${price.toFixed(2).replace(".", ",")}`;

  subtotalEl.textContent = formatPrice(subtotal);

  if (cart.length === 0) {
    shippingEl.textContent = "R$ 0,00";
  } else if (finalShippingCost > 0) {
    shippingEl.textContent = formatPrice(finalShippingCost);
  } else {
    shippingEl.textContent = "A calcular";
  }

  totalEl.textContent = formatPrice(total);
}

async function handleShippingCalculation() {
  const cepInput = document.getElementById("cep-input");
  const resultsContainer = document.getElementById("shipping-results");
  const btn = document.getElementById("calculate-shipping-btn");

  if (!cepInput || !resultsContainer || !btn) return;

  const cep = cepInput.value.replace(/\D/g, "");

  if (cep.length !== 8) {
    resultsContainer.innerHTML = `<p class="error">Por favor, digite um CEP válido.</p>`;
    return;
  }

  btn.classList.add("loading");
  btn.disabled = true;
  resultsContainer.innerHTML = `<p>Calculando...</p>`;

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    if (!response.ok) throw new Error("Não foi possível consultar o CEP.");

    const data = await response.json();
    if (data.erro) throw new Error("CEP não encontrado.");

    const shippingOptions = getMockShippingOptions(data.uf);

    resultsContainer.innerHTML = `
      <p>Opções para ${data.localidade} - ${data.uf}:</p>
      <ul>
        ${shippingOptions
          .map(
            (opt, index) => `
          <li>
            <label>
              <input type="radio" name="shipping-option" value="${opt.price}" ${
              index === 0 ? "checked" : ""
            }>
              ${opt.name}
            </label>
            <span>R$ ${opt.price.toFixed(2).replace(".", ",")}</span>
          </li>`
          )
          .join("")}
      </ul>`;

    selectedShippingCost = shippingOptions[0].price;
    updateCartSummary();

    resultsContainer.addEventListener("change", (e) => {
      if (e.target.name === "shipping-option") {
        selectedShippingCost = parseFloat(e.target.value);
        updateCartSummary();
      }
    });
  } catch (error) {
    resultsContainer.innerHTML = `<p class="error">${error.message}</p>`;
    selectedShippingCost = 0;
    updateCartSummary();
  } finally {
    btn.classList.remove("loading");
    btn.disabled = false;
  }
}

function getMockShippingOptions(uf) {
  const northEast = [
    "AC",
    "AP",
    "AM",
    "PA",
    "RO",
    "RR",
    "TO",
    "AL",
    "BA",
    "CE",
    "MA",
    "PB",
    "PE",
    "PI",
    "RN",
    "SE",
  ];
  if (northEast.includes(uf.toUpperCase())) {
    return [
      { name: "Normal", price: 25.5 },
      { name: "Expresso", price: 45.0 },
    ];
  }
  return [
    { name: "Normal", price: 15.0 },
    { name: "Expresso", price: 28.8 },
  ];
}

/**
 * Renders star rating HTML based on a rating score.
 * @param {number} rating The product rating (e.g., 4.5).
 * @param {number} reviewCount The number of reviews.
 * @returns {string} The HTML string for the star rating.
 */
function renderStars(rating, reviewCount, isInteractive = false) {
  if (typeof rating !== "number" || typeof reviewCount !== "number") return "";

  let starsHTML = "";
  const roundedRating = Math.round(rating);

  for (let i = 1; i <= 5; i++) {
    const starClass = i <= roundedRating ? "filled" : "";
    starsHTML += `
      <svg class="star-icon ${starClass}" data-star-value="${i}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.007z" clip-rule="evenodd" />
      </svg>
    `;
  }

  const interactiveClass = isInteractive ? "interactive" : "";

  return `
    <div class="star-rating ${interactiveClass}" data-rating-value="${rating}">
      ${starsHTML}
      <span class="rating-text">${rating.toFixed(
        1
      )} (${reviewCount} avaliações)</span>
    </div>
  `;
}

function renderComments(comments) {
  if (!comments || comments.length === 0) {
    return '<p class="no-comments">Ainda não há comentários para este produto. Seja o primeiro a avaliar!</p>';
  }
  return `
      <ul class="comment-list">
          ${comments
            .map(
              (comment) => `
              <li class="comment-item">
                  <div class="comment-header">
                      <strong class="comment-author">${comment.author}</strong>
                      <span class="comment-date">${comment.date}</span>
                  </div>
                  <p class="comment-text">${comment.text}</p>
              </li>
          `
            )
            .join("")}
      </ul>
  `;
}

function renderProductDetailsPage() {
  const container = document.getElementById("product-detail-container");
  if (!container) return; // Not on the detail page

  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  // Handle duplicate product ID from HTML
  const finalProductId =
    productId === "fem-preta-2" ? "fem-preta-1" : productId;

  const product = allProducts.find((p) => p.id === finalProductId);

  if (!product) {
    container.innerHTML = "<p>Produto não encontrado.</p>";
    return;
  }

  document.title = `${product.name} - 2R`; // Update page title

  // Create a .webp version of the image path for modern browsers
  const webpSrc = product.image.replace(/\.(png|jpg|jpeg)$/, ".webp");

  // Generate star rating HTML
  const starsHTML = renderStars(product.rating, product.reviews, true);

  // Generate comments HTML
  const commentsHTML = renderComments(product.comments);

  container.innerHTML = `
      <div class="product-detail-image-container">
          <picture>
            <source srcset="${webpSrc}" type="image/webp">
            <img src="${product.image}" alt="${
    product.name
  }" id="detail-image" width="500" height="500">
          </picture>
      </div>
      <div class="product-detail-info">
          <h1 id="detail-name">${product.name}</h1>
          ${starsHTML}
          <p class="price" id="detail-price">R$ ${product.price
            .toFixed(2)
            .replace(".", ",")}</p>
          <p>Cor: ${product.color}</p>
          <div class="tamanhos" id="detail-sizes">
              ${product.sizes
                .map(
                  (size, index) => `
                  <label>
                      <input type="radio" name="detail-size" value="${size}" ${
                    index === 0 ? "checked" : ""
                  }>
                      ${size}
                  </label>
              `
                )
                .join("")}
          </div>
          <button class="btn primary" id="detail-add-to-cart-btn">Adicionar ao Carrinho</button>
          <div class="product-features">
            <h3>Características do Produto</h3>
            <ul>
              <li>${product.material}</li>
              <li>${product.gola}</li>
              <li>${product.qualidade}</li>
            </ul>
          </div>
          <div class="comments-section">
            <h3>Comentários</h3>
            <div id="comment-list-container">
              ${commentsHTML}
            </div>
            <form id="comment-form">
              <h4>Deixe seu comentário</h4>
              <div class="form-row">
                  <textarea id="comment-text" placeholder="Escreva sua opinião sobre o produto..." required rows="4"></textarea>
              </div>
              <div class="form-actions">
                  <button type="submit" class="btn primary">Enviar Comentário</button>
              </div>
            </form>
          </div>
      </div>
  `;

  // --- Interactive Stars Logic ---
  const starRatingContainer = container.querySelector(
    ".star-rating.interactive"
  );
  if (starRatingContainer) {
    const stars = Array.from(
      starRatingContainer.querySelectorAll(".star-icon")
    );
    const ratingText = starRatingContainer.querySelector(".rating-text");
    let currentRating = Math.round(
      parseFloat(starRatingContainer.dataset.ratingValue)
    );

    const updateStars = (rating) => {
      stars.forEach((star) => {
        const starValue = parseInt(star.dataset.starValue, 10);
        star.classList.toggle("filled", starValue <= rating);
      });
    };

    const handleMouseOver = (e) => {
      const star = e.target.closest(".star-icon");
      if (star) {
        updateStars(parseInt(star.dataset.starValue, 10));
      }
    };

    const handleMouseOut = () => {
      updateStars(currentRating); // Restore to the current (original or clicked) rating
    };

    const handleClick = (e) => {
      const star = e.target.closest(".star-icon");
      if (star) {
        const newRating = parseInt(star.dataset.starValue, 10);
        currentRating = newRating; // Update the "saved" rating for the session

        if (ratingText) {
          ratingText.textContent = `Sua avaliação: ${newRating}.0`;
        }
        showToast("Obrigado pela sua avaliação!");
        // Remove interactivity by removing the event listeners
        starRatingContainer.removeEventListener("mouseover", handleMouseOver);
        starRatingContainer.removeEventListener("mouseout", handleMouseOut);
        starRatingContainer.removeEventListener("click", handleClick);
        starRatingContainer.classList.remove("interactive");
      }
    };
    starRatingContainer.addEventListener("mouseover", handleMouseOver);
    starRatingContainer.addEventListener("mouseout", handleMouseOut);
    starRatingContainer.addEventListener("click", handleClick);
  }

  // --- Comment Form Logic ---
  const commentForm = container.querySelector("#comment-form");
  if (commentForm) {
    commentForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const textarea = container.querySelector("#comment-text");
      const commentText = textarea.value.trim();

      if (commentText) {
        const listContainer = container.querySelector(
          "#comment-list-container"
        );
        let commentList = listContainer.querySelector(".comment-list");
        const noCommentsP = listContainer.querySelector(".no-comments");

        // If the "no comments" message is present, remove it and create the list
        if (noCommentsP) {
          noCommentsP.remove();
          listContainer.innerHTML = '<ul class="comment-list"></ul>';
          commentList = listContainer.querySelector(".comment-list");
        }

        const newComment = document.createElement("li");
        newComment.className = "comment-item";
        const today = new Date();
        const formattedDate = `${today
          .getDate()
          .toString()
          .padStart(2, "0")}/${(today.getMonth() + 1)
          .toString()
          .padStart(2, "0")}/${today.getFullYear()}`;

        newComment.innerHTML = `
          <div class="comment-header">
              <strong class="comment-author">Você</strong>
              <span class="comment-date">${formattedDate}</span>
          </div>
          <p class="comment-text">${commentText}</p>
        `;

        commentList.prepend(newComment);
        textarea.value = "";
        showToast("Comentário enviado com sucesso!");
      }
    });
  }

  container
    .querySelector("#detail-add-to-cart-btn")
    .addEventListener("click", () => {
      const selectedSize = container.querySelector(
        'input[name="detail-size"]:checked'
      ).value;
      addToCart(
        product.name,
        product.price,
        selectedSize,
        product.color,
        product.image
      );
    });
}

function renderCart() {
  const container = document.getElementById("cartItems");
  if (!container) return;

  const cartSummary = document.querySelector(".cart-summary");
  let cart = JSON.parse(localStorage.getItem("cart") || "[]");

  if (cart.length === 0) {
    container.innerHTML = "<p>Seu carrinho está vazio.</p>";
    selectedShippingCost = 0;
    const resultsContainer = document.getElementById("shipping-results");
    if (resultsContainer) resultsContainer.innerHTML = "";
    if (cartSummary) cartSummary.style.display = "none";
    updateCartSummary(); // Garante que os totais sejam zerados
    return;
  }

  if (cartSummary) cartSummary.style.display = "block";

  container.innerHTML = cart
    .map(
      (item) => `
      <div class="cart-item" data-item-id="${item.id}">
          <img src="${item.image}" alt="${item.name}" class="cart-item-image">
          <div class="cart-item-details">
              <div class="cart-item-header">
                  <h3>${item.name}</h3>
                  <button class="remove-item-btn" data-item-id="${
                    item.id
                  }" title="Remover item">&times;</button>
              </div>
              <p>Tamanho: ${item.size}</p>
              <p>Cor: ${item.cor}</p>
              <div class="cart-item-quantity">
                <label for="qty-${item.id}">Qtd:</label>
                <input type="number" class="quantity-input" id="qty-${
                  item.id
                }" value="${item.qty}" min="1" data-item-id="${item.id}">
              </div>
              <p class="price">Total: R$ ${(item.price * item.qty)
                .toFixed(2)
                .replace(".", ",")}</p>
          </div>
      </div>`
    )
    .join("");

  updateCartSummary(); // Atualiza os totais sempre que o carrinho é renderizado
}

// --- Address Lookup via ViaCEP ---
async function handleCepLookup(fields) {
  const cepField = fields.cep;
  if (!cepField) return;

  const cep = cepField.value.replace(/\D/g, "");
  clearError(cepField);

  if (cep.length !== 8) {
    if (cep.length > 0) {
      showError(cepField, "CEP inválido. Deve conter 8 dígitos.");
    }
    return;
  }

  const addressFields = [
    fields.logradouro,
    fields.bairro,
    fields.cidade,
    fields.estado,
  ];

  // Set fields to a loading state
  addressFields.forEach((field) => {
    if (field) {
      field.value = "Buscando...";
      field.disabled = true;
    }
  });

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    if (!response.ok) throw new Error("Não foi possível consultar o CEP.");

    const data = await response.json();
    if (data.erro) throw new Error("CEP não encontrado. Verifique o número.");

    // Populate fields
    fields.logradouro.value = data.logradouro;
    fields.bairro.value = data.bairro;
    fields.cidade.value = data.localidade;
    fields.estado.value = data.uf;

    addressFields.forEach(clearError);
    fields.numero.focus(); // Move focus to the number field
  } catch (error) {
    showError(cepField, error.message);
    // Clear fields on error
    addressFields.forEach((field) => {
      if (field) field.value = "";
    });
  } finally {
    // Re-enable fields
    addressFields.forEach((field) => {
      if (field) field.disabled = false;
    });
  }
}

// --- Form Validation Helpers ---

function showError(field, message) {
  field.classList.add("invalid");
  const errorContainer = field.nextElementSibling;
  if (errorContainer && errorContainer.classList.contains("error-message")) {
    errorContainer.textContent = message;
  }
}

function clearError(field) {
  if (!field) return;
  field.classList.remove("invalid");
  const errorContainer = field.nextElementSibling;
  if (errorContainer && errorContainer.classList.contains("error-message")) {
    errorContainer.textContent = "";
  }
}

function validateCpf(cpf) {
  cpf = cpf.replace(/[^\d]+/g, "");
  if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;

  let sum = 0;
  let remainder;

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(9, 10))) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(10, 11))) return false;

  return true;
}

function validateField(field, allFields) {
  let isValid = false;
  const value = field.value.trim();

  // Clear previous error
  clearError(field);

  switch (field.id) {
    case "nome":
      if (value.length < 3) {
        showError(field, "O nome deve ter pelo menos 3 caracteres.");
      } else {
        isValid = true;
      }
      break;
    case "cpf":
      if (!validateCpf(value)) {
        showError(field, "CPF inválido.");
      } else {
        isValid = true;
      }
      break;
    case "cep":
      if (value.replace(/\D/g, "").length !== 8) {
        showError(field, "CEP inválido.");
      } else {
        isValid = true;
      }
      break;
    case "logradouro":
    case "bairro":
    case "cidade":
    case "estado":
    case "numero":
      if (value.length < 1) {
        showError(field, "Este campo é obrigatório.");
      } else {
        // A basic check is enough as some fields are auto-filled
        isValid = true;
      }
      break;
    case "telefone":
      // Regex for (XX) XXXXX-XXXX or (XX) XXXX-XXXX
      if (!/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(value)) {
        showError(field, "Formato de telefone inválido.");
      } else {
        isValid = true;
      }
      break;
    case "email":
      // Basic email regex
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        showError(field, "Por favor, insira um e-mail válido.");
      } else {
        isValid = true;
      }
      break;
    case "senha":
      if (value.length < 8) {
        showError(field, "A senha deve ter no mínimo 8 caracteres.");
      } else {
        isValid = true;
      }
      break;
    case "confirmar-senha":
      if (value !== allFields.senha.value) {
        showError(field, "As senhas não coincidem.");
      } else if (!value) {
        showError(field, "Confirmação de senha é obrigatória.");
      } else {
        isValid = true;
      }
      break;
    default:
      isValid = true; // For fields without validation
  }

  if (isValid) {
    clearError(field);
  }

  return isValid;
}

function maskPhone(event) {
  let value = event.target.value.replace(/\D/g, "");
  value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
  value = value.replace(/(\d)(\d{4})$/, "$1-$2");
  event.target.value = value;
}

function maskCpf(event) {
  let value = event.target.value.replace(/\D/g, "");
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  event.target.value = value;
}

function maskCep(event) {
  let value = event.target.value.replace(/\D/g, "");
  if (value.length > 5) {
    value = value.slice(0, 5) + "-" + value.slice(5, 8);
  }
  event.target.value = value;
}

function checkPasswordStrength(password) {
  const container = document.getElementById("password-strength-container");
  const barFill = container?.querySelector(".strength-bar-fill");
  const text = container?.querySelector(".strength-text");

  if (!container || !barFill || !text) return;

  // Verifica se há uma mensagem de erro ativa para o campo de senha
  const passwordField = document.getElementById("senha");
  const errorContainer = passwordField?.nextElementSibling;
  const hasError =
    errorContainer &&
    errorContainer.classList.contains("error-message") &&
    errorContainer.textContent.length > 0;

  // Oculta o indicador se não houver senha ou se houver um erro
  if (!password || hasError) {
    container.classList.remove("visible");
    return;
  }
  container.classList.add("visible");

  let score = 0;
  const checks = [
    /[a-z]/, // lowercase
    /[A-Z]/, // uppercase
    /[0-9]/, // numbers
    /[^a-zA-Z0-9]/, // special chars
  ];

  if (password.length < 8) {
    score = 1;
  } else {
    score = 1; // Base score for length
    checks.forEach((regex) => {
      if (regex.test(password)) {
        score++;
      }
    });
  }

  let message = "";
  let className = "";

  switch (score) {
    case 1:
      message = "Fraca";
      className = "weak";
      break;
    case 2:
      message = "Média";
      className = "medium";
      break;
    case 3:
      message = "Forte";
      className = "strong";
      break;
    case 4:
    case 5:
      message = "Muito Forte";
      className = "very-strong";
      break;
  }

  barFill.className = "strength-bar-fill"; // Reset
  if (className) barFill.classList.add(className);
  text.textContent = message;
  text.style.color = getComputedStyle(barFill).backgroundColor;
}
