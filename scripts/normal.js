// Función de error (aproximación de Abramowitz y Stegun)
function erf(x) {
    const sign = x >= 0 ? 1 : -1
    x = Math.abs(x)
  
    const a1 = 0.254829592
    const a2 = -0.284496736
    const a3 = 1.421413741
    const a4 = -1.453152027
    const a5 = 1.061405429
    const p = 0.3275911
  
    const t = 1.0 / (1.0 + p * x)
    const y = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x)
  
    return sign * y
  }
  
  // Función de distribución acumulada normal estándar
  function normalCDF(x) {
    return 0.5 * (1 + erf(x / Math.sqrt(2)))
  }
  
  // Función de distribución acumulada normal con media y desviación estándar
  function normalCDFWithParams(x, mu, sigma) {
    const z = (x - mu) / sigma
    return normalCDF(z)
  }
  
  // Mostrar/ocultar campo xMax según el tipo de cálculo
  document.getElementById("calcType").addEventListener("change", function () {
    const xMaxGroup = document.getElementById("xMaxGroup")
    if (this.value === "between") {
      xMaxGroup.style.display = "block"
    } else {
      xMaxGroup.style.display = "none"
    }
  })
  
  // Función principal de cálculo
  function calculateNormal() {
    const mu = Number.parseFloat(document.getElementById("mu").value)
    const sigma = Number.parseFloat(document.getElementById("sigma").value)
    const x = Number.parseFloat(document.getElementById("x").value)
    const calcType = document.getElementById("calcType").value
    const xMax = Number.parseFloat(document.getElementById("xMax").value)
  
    // Validaciones
    if (isNaN(mu)) {
      showError("Por favor ingresa un valor válido para la media μ")
      return
    }
  
    if (isNaN(sigma) || sigma <= 0) {
      showError("La desviación estándar debe ser mayor que 0")
      return
    }
  
    if (isNaN(x)) {
      showError("Por favor ingresa un valor válido para x")
      return
    }
  
    if (calcType === "between" && (isNaN(xMax) || xMax <= x)) {
      showError("El valor máximo debe ser mayor que el valor mínimo")
      return
    }
  
    // Calcular según el tipo
    let probability
    let explanation
  
    switch (calcType) {
      case "less":
        probability = normalCDFWithParams(x, mu, sigma)
        explanation = `Probabilidad de que X sea menor o igual a ${x}`
        break
      case "greater":
        probability = 1 - normalCDFWithParams(x, mu, sigma)
        explanation = `Probabilidad de que X sea mayor o igual a ${x}`
        break
      case "between":
        probability = normalCDFWithParams(xMax, mu, sigma) - normalCDFWithParams(x, mu, sigma)
        explanation = `Probabilidad de que X esté entre ${x} y ${xMax}`
        break
    }
  
    // Calcular valor Z
    const z = (x - mu) / sigma
  
    // Mostrar resultados
    displayResults(probability, explanation, mu, sigma, x, z)
  }
  
  function showError(message) {
    const resultsDiv = document.getElementById("results")
    resultsDiv.innerHTML = `
          <div style="color: hsl(0 84% 60%); text-align: center;">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style="margin-bottom: 1rem;">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                  <path d="M12 8V12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  <circle cx="12" cy="16" r="1" fill="currentColor"/>
              </svg>
              <p><strong>Error:</strong> ${message}</p>
          </div>
      `
  }
  
  function displayResults(probability, explanation, mu, sigma, x, z) {
    const resultsDiv = document.getElementById("results")
  
    resultsDiv.innerHTML = `
          <div class="result-item">
              <div class="result-label">Probabilidad</div>
              <div class="result-value">${probability.toFixed(6)}</div>
              <div class="result-value">${(probability * 100).toFixed(4)}%</div>
              <div class="result-explanation">${explanation}</div>
          </div>
  
          <div class="result-item">
              <div class="result-label">Valor Z (estandarizado)</div>
              <div class="result-value">${z.toFixed(4)}</div>
              <div class="result-explanation">Número de desviaciones estándar desde la media</div>
          </div>
  
          <div class="result-item">
              <div class="result-label">Media (μ)</div>
              <div class="result-value">${mu.toFixed(4)}</div>
              <div class="result-explanation">Centro de la distribución</div>
          </div>
  
          <div class="result-item">
              <div class="result-label">Desviación Estándar (σ)</div>
              <div class="result-value">${sigma.toFixed(4)}</div>
              <div class="result-explanation">Dispersión de los datos</div>
          </div>
  
          <div style="margin-top: 1.5rem; padding: 1rem; background-color: hsl(var(--secondary)); border-radius: 0.5rem;">
              <div style="font-size: 0.875rem; color: hsl(var(--muted-foreground));">
                  <strong>Parámetros utilizados:</strong><br>
                  μ = ${mu} (media)<br>
                  σ = ${sigma} (desviación estándar)<br>
                  x = ${x} (valor observado)<br>
                  Z = ${z.toFixed(4)} (valor estandarizado)
              </div>
          </div>
      `
  }
  
  // Permitir cálculo con Enter
  document.querySelectorAll("input").forEach((input) => {
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        calculateNormal()
      }
    })
  })
  