/* ============================================================
   FUNCIÓN PÚBLICA PARA PERMITIR QUE LAS FLECHAS FUNCIONEN
   (usada por moveCarousel('estilo', 1) en el HTML)
============================================================ */

const carousels = {};

function moveCarousel(type, direction) {
    if (carousels[type]) {
        if (direction === 1) carousels[type].next();
        else carousels[type].prev();
    }
}

/* ============================
   SISTEMA DE CARRUSEL
============================ */
class Carousel {
  constructor(type, visibleItems, autoPlay = true, intervalMs = 2500) {
    this.type = type;
    this.visibleItems = visibleItems;
    this.autoPlay = autoPlay;
    this.intervalMs = intervalMs;

    this.track = document.getElementById(`carousel-${type}`);
    this.container = document.querySelector(`.carousel-container[data-carousel="${type}"]`);
    this.items = Array.from(this.track?.children || []);
    this.total = this.items.length;
    this.position = 0;
    this.timer = null;

    if (!this.track) return;

    window.addEventListener("load", () => {
      this.itemWidth = this.items[0]?.offsetWidth || 0;
      const style = window.getComputedStyle(this.track);
      this.gap = parseInt(style.gap) || 0;
      this.step = this.itemWidth + this.gap;
      this.update();
    });

    const style = window.getComputedStyle(this.track);
    this.gap = parseInt(style.gap) || 0;
    this.step = (this.items[0]?.offsetWidth || 0) + this.gap;

    this.indicatorsContainer = document.querySelector(
      `.carousel-indicators[data-carousel="${type}"]`
    );

    this.createIndicators();
    this.update();

    if (this.autoPlay) {
      this.startAuto();
      this.container?.addEventListener("mouseenter", () => this.stopAuto());
      this.container?.addEventListener("mouseleave", () => this.startAuto());
    }

    // Swipe
    this.startX = null;
    this.container?.addEventListener("touchstart", (e) => this.onTouchStart(e), { passive: true });
    this.container?.addEventListener("touchend", (e) => this.onTouchEnd(e));
  }

  createIndicators() {
    if (!this.indicatorsContainer) return;

    const count = this.total - this.visibleItems + 1;

    for (let i = 0; i < count; i++) {
      const dot = document.createElement("span");
      dot.className = "indicator-dot";
      if (i === 0) dot.classList.add("active");
      dot.dataset.index = i;

      dot.addEventListener("click", () => {
        this.position = i;
        this.update();
        this.resetAuto();
      });

      this.indicatorsContainer.appendChild(dot);
    }
  }

  update() {
    if (!this.track || this.items.length === 0) return;

    this.step = this.items[0].offsetWidth + this.gap;
    const offset = this.position * -this.step;
    this.track.style.transform = `translateX(${offset}px)`;

    if (this.indicatorsContainer) {
      const dots = this.indicatorsContainer.querySelectorAll(".indicator-dot");
      dots.forEach((dot, index) =>
        dot.classList.toggle("active", index === this.position)
      );
    }
  }

  next() {
    const maxPosition = this.total - this.visibleItems;
    this.position++;

    if (this.position > maxPosition) this.position = 0;
    this.update();
  }

  prev() {
    const maxPosition = this.total - this.visibleItems;
    this.position--;

    if (this.position < 0) this.position = maxPosition;
    this.update();
  }

  startAuto() {
    if (!this.autoPlay) return;
    this.stopAuto();
    this.timer = setInterval(() => this.next(), this.intervalMs);
  }

  stopAuto() {
    if (this.timer) clearInterval(this.timer);
  }

  resetAuto() {
    this.stopAuto();
    this.startAuto();
  }

  onTouchStart(e) {
    this.startX = e.touches[0].clientX;
  }

  onTouchEnd(e) {
    if (this.startX === null) return;
    const endX = e.changedTouches[0].clientX;
    const deltaX = endX - this.startX;

    if (Math.abs(deltaX) > 40) {
      deltaX < 0 ? this.next() : this.prev();
      this.resetAuto();
    }

    this.startX = null;
  }
}

/* ============================
   DISPONIBILIDAD DE TALLAS POR MATERIAL + COLOR
============================ */

/*  
   🔥🔥🔥 PROTECCIÓN IMPORTANTE 🔥🔥🔥  
   Solo ejecutar este código SI existe "materialOptions" (solo en personalizar.html)
*/
if (document.getElementById("materialOptions")) {

  const sizeAvailability = {
    cuero: {
      negro: ["XS", "S", "M", "L", "XL"],
      gris: ["S", "M", "L", "XL"],
      cafe: ["M", "L", "XL"],
      beige: ["XS", "S", "M"]
    },

    jean: {
      "azul-oscuro": ["S", "M", "L"],
      "azul-claro": ["S", "M"],
      negro: ["M", "L"]
    },

    gaban: {
      negro: ["M", "L", "XL"],
      gris: ["M", "L"],
      cafe: ["M", "L"],
      beige: ["M", "L", "XL"],
      "azul-oscuro": ["M", "L", "XL"]
    },

    blazer: {
      negro: ["XS", "S", "M", "L"],
      gris: ["S", "M", "L"],
      cafe: ["XS", "S", "M"],
      beige: ["XS", "S", "M", "L"]
    }
  };


  /* ============================
     PREVIEW DE CHAQUETAS
  ============================ */

  const jacketImages = {
    cuero: {
      negro: { frente: "Frente-Cuero-Color-Negro.jpg", espalda: "Espalda-Cuero-Color-Negro.jpg" },
      gris: { frente: "Frente-Cuero-Color-Gris.png", espalda: "Espalda-Cuero-Color-Gris.png" },
      cafe: { frente: "Frente-Cuero-Color-Cafe.png", espalda: "Espalda-Cuero-Color-Cafe.png" },
      beige: { frente: "Frente-Cuero-Color-Beige.png", espalda: "Espalda-Cuero-Color-Beige.png" }
    },

    blazer: {
      negro: { frente: "Frente-Blazer-Color-Negro.png", espalda: "Espalda-Blazer-Color-Negro.png" },
      gris: { frente: "Frente-Blazer-Color-Gris.png", espalda: "Espalda-Blazer-Color-Gris.png" },
      cafe: { frente: "Frente-Blazer-Color-Cafe.png", espalda: "Espalda-Blazer-Color-Cafe.png" },
      beige: { frente: "Frente-Blazer-Color-Beige.png", espalda: "Espalda-Blazer-Color-Beige.png" }
    },

    gaban: {
      negro: { frente: "Frente-Gaban-Color-Negro.png", espalda: "Espalda-Gaban-Color-Negro.png" },
      gris: { frente: "Frente-Gaban-Color-Gris.png", espalda: "Espalda-Gaban-Color-Gris.png" },
      cafe: { frente: "Frente-Gaban-Color-Cafe.png", espalda: "Espalda-Gaban-Color-Cafe.png" },
      beige: { frente: "Frente-Gaban-Color-Beige.png", espalda: "Espalda-Gaban-Color-Beige.png" },
      "azul-oscuro": {
        frente: "Frente-Gaban-Color-Azul-Oscuro.png",
        espalda: "Espalda-Gaban-Color-Azul-Oscuro.png"
      }
    },

    jean: {
      "azul-oscuro": { frente: "Frente-Jean-Color-Azul.png", espalda: "Espalda-Jean-Color-Azul.png" },
      "azul-claro": {
        frente: "Frente-Jean-Color-Azul-Claro.png",
        espalda: "Espalda-Jean-Color-Azul-Claro.png"
      },
      negro: { frente: "Frente-Jean-Color-Negro.png", espalda: "Espalda-Jean-Color-Negro.png" }
    }
  };

  let selectedMaterial = "cuero";
  let selectedColor = "negro";
  let selectedSize = "M"; 
  let selectedAcabado = "Estampado";


  function updateAvailableSizes() {
    const allowed = sizeAvailability[selectedMaterial]?.[selectedColor];
    if (!allowed) return;

    document.querySelectorAll("#sizeOptions button").forEach(btn => {
      // Si no existe data-size, usamos el texto del botón
      const size = btn.dataset.size || btn.textContent.trim();

      if (allowed.includes(size)) {
        btn.disabled = false;
        btn.classList.remove("disabled-size");
      } else {
        btn.disabled = true;
        btn.classList.add("disabled-size");

        // Si la talla seleccionada deja de ser válida, saltamos a la primera permitida
        if (selectedSize === size) {
          selectedSize = allowed[0];
        }
      }
    });

    // Quitar selección visual y marcar la talla válida actual
    document.querySelectorAll("#sizeOptions button").forEach(btn =>
      btn.classList.remove("selected")
    );

    document
      .querySelector(`#sizeOptions button[data-size="${selectedSize}"], #sizeOptions button:nth-child(${["XS","S","M","L","XL"].indexOf(selectedSize)+1 || 3})`)
      ?.classList.add("selected");
  }


  /* ---------------- PREVIEW ---------------- */
  function updateJacketPreview() {
    const data = jacketImages[selectedMaterial]?.[selectedColor];

    if (!data) return;

    document.getElementById("preview-frente").src =
      `assets/img/modelos de chaquetas/${data.frente}`;

    document.getElementById("preview-espalda").src =
      `assets/img/modelos de chaquetas/${data.espalda}`;
  }

  /* 🔥 ESTAS LÍNEAS VAN AQUÍ — FUERA DE LA FUNCIÓN 🔥 */
  window.updateJacketPreview = updateJacketPreview;
  window.updateAvailableSizes = updateAvailableSizes;
  window.applySizeScale = applySizeScale;
  // NO usar esto porque NO existe aún → rompería todo
  // window.actualizarColoresPermitidos = actualizarColoresPermitidos;



  const sizeScale = { XS:0.88, S:0.95, M:1, L:1.07, XL:1.15 };

  function applySizeScale() {
    const scale = sizeScale[selectedSize] || 1;

    document.querySelectorAll(".preview-card img").forEach(img => {
      img.style.transform = `scale(${scale})`;
      img.style.transition = "transform 0.25s ease";
    });
  }


  /* ---------------- BOTONES ---------------- */

  function marcarSeleccion(btn) {
    const parent = btn.parentElement;
    parent.querySelectorAll(".option-btn").forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
  }

  /* ---------- MATERIAL ---------- */
  document.getElementById("materialOptions").addEventListener("click", (e) => {
    if (!e.target.dataset.material) return;

    selectedMaterial = e.target.dataset.material;
    marcarSeleccion(e.target);

    let coloresValidos = [];

    if (selectedMaterial === "jean") {
      coloresValidos = ["negro", "azul-oscuro", "azul-claro"];
    } else if (selectedMaterial === "gaban") {
      coloresValidos = ["negro", "gris", "cafe", "beige", "azul-oscuro"];
    } else {
      coloresValidos = ["negro", "gris", "cafe", "beige"];
    }

    document.querySelectorAll("#colorOptions button").forEach(btn => {
      const color = btn.dataset.color;
      btn.disabled = !coloresValidos.includes(color);

      if (btn.classList.contains("selected") && !coloresValidos.includes(color)) {
        btn.classList.remove("selected");
      }
    });

    if (!coloresValidos.includes(selectedColor)) {
      selectedColor = coloresValidos[0];
      const btnSeleccionar =
        document.querySelector(`#colorOptions button[data-color="${selectedColor}"]`);
      marcarSeleccion(btnSeleccionar);
    }

    updateJacketPreview();
    updateAvailableSizes();
    applySizeScale();
  });


  /* ---------- COLOR ---------- */
  document.getElementById("colorOptions").addEventListener("click", (e) => {
    if (!e.target.dataset.color || e.target.disabled) return;

    selectedColor = e.target.dataset.color;
    marcarSeleccion(e.target);

    updateJacketPreview();
    updateAvailableSizes();
    applySizeScale();
  });


  /* ---------- TALLA ---------- */
  document.getElementById("sizeOptions").addEventListener("click", (e) => {
    if (!e.target.classList.contains("option-btn")) return;

    selectedSize = e.target.textContent.trim();

    marcarSeleccion(e.target);
    applySizeScale();
  });


  /* ---------- ACABADO ---------- */
  document.querySelectorAll("#acabadoOptions .option-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      selectedAcabado = btn.textContent.trim();
      marcarSeleccion(btn);
    });
  });


  /* ---------- PREVIEW DISEÑOS SUBIDOS ---------- */
  function previewDesign(input, idDestino) {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      document.getElementById(idDestino).src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  window.previewDesign = previewDesign;


  /* =============== ENVIAR DISEÑO =============== */

  document.getElementById("btnEnviar").addEventListener("click", () => {

    const nombre = document.getElementById("clienteNombre").value.trim();
    const email = document.getElementById("clienteEmail").value.trim();
    const telefono = document.getElementById("clienteTelefono").value.trim();

    if (!nombre || !email || !telefono) {
      alert("Por favor completa todos los datos para continuar.");
      return;
    }

    document.getElementById("modalConfirm").classList.remove("hidden");
  });


  /* =============== CERRAR MODAL =============== */

  document.getElementById("closeModal").addEventListener("click", () => {
    document.getElementById("modalConfirm").classList.add("hidden");

    window.scrollTo({ top: 0, behavior: "smooth" });

    setTimeout(() => {
      location.reload();
    }, 800);
  });

} 

/* ============================
   INICIALIZACIÓN GENERAL
============================ */
window.addEventListener("DOMContentLoaded", () => {

  // Guardar instancias accesibles desde moveCarousel()
  carousels["estilo"] = new Carousel("estilo", 3, true, 2500);
  carousels["inspiracion"] = new Carousel("inspiracion", 3, true, 2500);
  carousels["reviews"] = new Carousel("reviews", 4, true, 2500);

  // Carruseles de la GALERÍA
  carousels["gal-cuero"]  = new Carousel("gal-cuero", 3, true, 2500);
  carousels["gal-jean"]   = new Carousel("gal-jean", 3, true, 2500);
  carousels["gal-gaban"]  = new Carousel("gal-gaban", 3, true, 2500);
  carousels["gal-blazer"] = new Carousel("gal-blazer", 3, true, 2500);

  // SOLO ejecutar funciones del personalizador si existen
  if (document.getElementById("materialOptions")) {
      if (window.actualizarColoresPermitidos) window.actualizarColoresPermitidos();
      if (window.updateJacketPreview) window.updateJacketPreview();
      if (window.updateAvailableSizes) window.updateAvailableSizes();
      if (window.applySizeScale) window.applySizeScale();
  }
});



/* =============== ENVIAR DISEÑO =============== */

document.getElementById("btnEnviar").addEventListener("click", () => {

  // Capturar datos
  const nombre = document.getElementById("clienteNombre").value.trim();
  const email = document.getElementById("clienteEmail").value.trim();
  const telefono = document.getElementById("clienteTelefono").value.trim();

  // Validación simple
  if (!nombre || !email || !telefono) {
    alert("Por favor completa todos los datos para continuar.");
    return;
  }

  // Podrías enviar estos datos a un backend aquí si quieres
  console.log({
    nombre,
    email,
    telefono,
    material: selectedMaterial,
    color: selectedColor,
    talla: selectedSize,
    acabado: selectedAcabado
  });

  // Mostrar modal final
  document.getElementById("modalConfirm").classList.remove("hidden");
});

document.getElementById("closeModal").addEventListener("click", () => {
  document.getElementById("modalConfirm").classList.add("hidden");
});


document.getElementById("closeModal").addEventListener("click", () => {
  document.getElementById("modalConfirm").classList.add("hidden");
});

/* =============== BOTÓN "CERRAR" DEL MODAL FINAL =============== */
document.getElementById("closeModal").addEventListener("click", () => {
  document.getElementById("modalConfirm").classList.add("hidden");

  // 🔝 Subir al inicio
  window.scrollTo({ top: 0, behavior: "smooth" });

  // 🔄 Reiniciar después de 800ms para que dé tiempo de subir
  setTimeout(() => {
    location.reload();
  }, 800);
});


