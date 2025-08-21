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
    registrationForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const senha = document.getElementById("senha");
      const confirmarSenha = document.getElementById("confirmar-senha");

      if (senha.value !== confirmarSenha.value) {
        showToast("As senhas não coincidem. Por favor, tente novamente.");
        confirmarSenha.focus();
        return;
      }

      showToast("Cadastro realizado com sucesso!");
      registrationForm.reset();
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
    cepInput.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, "");
      if (value.length > 5) {
        value = value.slice(0, 5) + "-" + value.slice(5, 8);
      }
      e.target.value = value;
    });
  }

  // Handle Checkout Button
  const checkoutBtn = document.getElementById("checkoutBtn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      if (cart.length === 0) {
        showToast("Seu carrinho está vazio!");
        return;
      }

      if (selectedShippingCost === 0) {
        showToast("Por favor, calcule o frete antes de finalizar.");
        document.getElementById("cep-input")?.focus();
        return;
      }

      checkoutBtn.classList.add("loading");
      checkoutBtn.disabled = true;

      // Simulate a network request
      setTimeout(() => {
        // On success:
        localStorage.removeItem("cart"); // Clear the cart
        renderCart(); // Re-render to show it's empty
        showToast("Compra finalizada com sucesso!");

        // Reset button
        checkoutBtn.classList.remove("loading");
        checkoutBtn.disabled = false;
      }, 2500); // Simulate 2.5 seconds processing time
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
  },
  {
    id: "masc-preta-2",
    name: "Camiseta Gola Careca 100% Algodão",
    price: 59.9,
    image: "imagens/camisetas masculinas/camiseta preta frente 1.png",
    color: "Preta",
    sizes: ["P", "M", "G"],
  },
  {
    id: "masc-preta-3",
    name: "Camiseta Gola Careca 100% Algodão",
    price: 59.9,
    image: "imagens/camisetas masculinas/camiseta preta frente 2.png",
    color: "Preta",
    sizes: ["P", "M", "G"],
  },
  {
    id: "masc-branca-1",
    name: "Camiseta Gola Careca 100% Algodão",
    price: 59.9,
    image: "imagens/camisetas masculinas/camiseta branca frente.png",
    color: "Branca",
    sizes: ["P", "M", "G"],
  },
  {
    id: "fem-preta-1",
    name: "Camiseta 100% Algodão",
    price: 59.9,
    image: "imagens/camisetas femininas/camiseta preta frente 1.png",
    color: "Preta",
    sizes: ["P", "M", "G"],
  },
  // Note: fem-preta-2 is a duplicate in the HTML, linking to the same product.
  {
    id: "fem-rosa-1",
    name: "Camiseta 100% Algodão",
    price: 59.9,
    image: "imagens/camisetas femininas/camiseta rosa frente.png",
    color: "Rosa",
    sizes: ["P", "M", "G"],
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

  container.innerHTML = `
      <div class="product-detail-image-container">
          <img src="${product.image}" alt="${product.name}" id="detail-image">
      </div>
      <div class="product-detail-info">
          <h1 id="detail-name">${product.name}</h1>
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
      </div>
  `;

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
