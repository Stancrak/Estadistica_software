// Función para calcular el factorial
function factorial(n) {
    if (n === 0 || n === 1) return 1
    let result = 1
    for (let i = 2; i <= n; i++) {
      result *= i
    }
    return result
  }
  
  // Función para calcular el coeficiente binomial C(n, k)
  function binomialCoefficient(n, k) {
    if (k > n) return 0
    if (k === 0 || k === n) return 1
  
    // Optimización: C(n, k) = C(n, n-k)
    k = Math.min(k, n - k)
  
    let result = 1
    for (let i = 0; i < k; i++) {
      result *= n - i
      result /= i + 1
    }
    return result
  }
  
  // Función para calcular P(X = k) en distribución binomial
  function binomialProbability(n, k, p) {
    const coef = binomialCoefficient(n, k)
    const prob = coef * Math.pow(p, k) * Math.pow(1 - p, n - k)
    return prob
  }
  
  // Función para calcular P(X <= k)
  function binomialCumulativeLess(n, k, p) {
    let sum = 0
    for (let i = 0; i <= k; i++) {
      sum += binomialProbability(n, i, p)
    }
    return sum
  }
  
  // Función para calcular P(X >= k)
  function binomialCumulativeGreater(n, k, p) {
    let sum = 0
    for (let i = k; i <= n; i++) {
      sum += binomialProbability(n, i, p)
    }
    return sum
  }
  
  // Función para calcular P(a <= X <= b)
  function binomialBetween(n, a, b, p) {
    let sum = 0
    for (let i = a; i <= b; i++) {
      sum += binomialProbability(n, i, p)
    }
    return sum
  }
  
  // Función para calcular la media
  function binomialMean(n, p) {
    return n * p
  }
  
  // Función para calcular la varianza
  function binomialVariance(n, p) {
    return n * p * (1 - p)
  }
  
  // Función para calcular la desviación estándar
  function binomialStdDev(n, p) {
    return Math.sqrt(binomialVariance(n, p))
  }
  
  // Mostrar/ocultar campo kMax según el tipo de cálculo
  document.getElementById("calcType").addEventListener("change", function () {
    const kMaxGroup = document.getElementById("kMaxGroup")
    if (this.value === "between") {
      kMaxGroup.style.display = "block"
    } else {
      kMaxGroup.style.display = "none"
    }
  })
  
  // Función principal de cálculo
  function calculateBinomial() {
    // Obtener valores
    const n = Number.parseInt(document.getElementById("n").value)
    const p = Number.parseFloat(document.getElementById("p").value)
    const k = Number.parseInt(document.getElementById("k").value)
    const calcType = document.getElementById("calcType").value
    const kMax = Number.parseInt(document.getElementById("kMax").value)
  
    // Validaciones
    if (isNaN(n) || n < 1) {
      showError("Por favor ingresa un número válido de ensayos (n ≥ 1)")
      return
    }
  
    if (isNaN(p) || p < 0 || p > 1) {
      showError("La probabilidad debe estar entre 0 y 1")
      return
    }
  
    if (isNaN(k) || k < 0 || k > n) {
      showError("El número de éxitos debe estar entre 0 y n")
      return
    }
  
    if (calcType === "between" && (isNaN(kMax) || kMax < k || kMax > n)) {
      showError("El valor máximo debe ser mayor o igual a k y menor o igual a n")
      return
    }
  
    // Calcular según el tipo
    let probability
    let explanation
  
    switch (calcType) {
      case "exact":
        probability = binomialProbability(n, k, p)
        explanation = `Probabilidad de obtener exactamente ${k} éxitos en ${n} ensayos`
        break
      case "less":
        probability = binomialCumulativeLess(n, k, p)
        explanation = `Probabilidad de obtener ${k} o menos éxitos en ${n} ensayos`
        break
      case "greater":
        probability = binomialCumulativeGreater(n, k, p)
        explanation = `Probabilidad de obtener ${k} o más éxitos en ${n} ensayos`
        break
      case "between":
        probability = binomialBetween(n, k, kMax, p)
        explanation = `Probabilidad de obtener entre ${k} y ${kMax} éxitos en ${n} ensayos`
        break
    }
  
    // Calcular estadísticas
    const mean = binomialMean(n, p)
    const variance = binomialVariance(n, p)
    const stdDev = binomialStdDev(n, p)
  
    // Mostrar resultados
    displayResults(probability, explanation, mean, variance, stdDev, n, p)
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
  
  function displayResults(probability, explanation, mean, variance, stdDev, n, p) {
    const resultsDiv = document.getElementById("results")
  
    resultsDiv.innerHTML = `
          <div class="result-item">
              <div class="result-label">Probabilidad</div>
              <div class="result-value">${probability.toFixed(6)}</div>
              <div class="result-value">${(probability * 100).toFixed(4)}%</div>
              <div class="result-explanation">${explanation}</div>
          </div>
  
          <div class="result-item">
              <div class="result-label">Media (μ)</div>
              <div class="result-value">${mean.toFixed(4)}</div>
              <div class="result-explanation">Valor esperado de éxitos</div>
          </div>
  
          <div class="result-item">
              <div class="result-label">Varianza (σ²)</div>
              <div class="result-value">${variance.toFixed(4)}</div>
              <div class="result-explanation">Medida de dispersión</div>
          </div>
  
          <div class="result-item">
              <div class="result-label">Desviación Estándar (σ)</div>
              <div class="result-value">${stdDev.toFixed(4)}</div>
              <div class="result-explanation">Raíz cuadrada de la varianza</div>
          </div>
  
          <div style="margin-top: 1.5rem; padding: 1rem; background-color: hsl(var(--secondary)); border-radius: 0.5rem;">
              <div style="font-size: 0.875rem; color: hsl(var(--muted-foreground));">
                  <strong>Parámetros utilizados:</strong><br>
                  n = ${n} ensayos<br>
                  p = ${p} (probabilidad de éxito)<br>
                  q = ${(1 - p).toFixed(4)} (probabilidad de fracaso)
              </div>
          </div>
      `
  }
  
  // Permitir cálculo con Enter
  document.querySelectorAll("input").forEach((input) => {
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        calculateBinomial()
      }
    })
  })
  
  