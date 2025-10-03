// Función de distribución acumulada exponencial P(X <= x)
function exponentialCDF(x, lambda) {
    return 1 - Math.exp(-lambda * x)
  }
  
  // Función para calcular la media
  function exponentialMean(lambda) {
    return 1 / lambda
  }
  
  // Función para calcular la varianza
  function exponentialVariance(lambda) {
    return 1 / (lambda * lambda)
  }
  
  // Función para calcular la desviación estándar
  function exponentialStdDev(lambda) {
    return 1 / lambda
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
  function calculateExponential() {
    const lambda = Number.parseFloat(document.getElementById("lambda").value)
    const x = Number.parseFloat(document.getElementById("x").value)
    const calcType = document.getElementById("calcType").value
    const xMax = Number.parseFloat(document.getElementById("xMax").value)
  
    // Validaciones
    if (isNaN(lambda) || lambda <= 0) {
      showError("La tasa λ debe ser mayor que 0")
      return
    }
  
    if (isNaN(x) || x < 0) {
      showError("El tiempo debe ser mayor o igual a 0")
      return
    }
  
    if (calcType === "between" && (isNaN(xMax) || xMax <= x)) {
      showError("El tiempo máximo debe ser mayor que el tiempo mínimo")
      return
    }
  
    // Calcular según el tipo
    let probability
    let explanation
  
    switch (calcType) {
      case "less":
        probability = exponentialCDF(x, lambda)
        explanation = `Probabilidad de que el tiempo sea menor o igual a ${x}`
        break
      case "greater":
        probability = 1 - exponentialCDF(x, lambda)
        explanation = `Probabilidad de que el tiempo sea mayor que ${x}`
        break
      case "between":
        probability = exponentialCDF(xMax, lambda) - exponentialCDF(x, lambda)
        explanation = `Probabilidad de que el tiempo esté entre ${x} y ${xMax}`
        break
    }
  
    // Calcular estadísticas
    const mean = exponentialMean(lambda)
    const variance = exponentialVariance(lambda)
    const stdDev = exponentialStdDev(lambda)
  
    // Mostrar resultados
    displayResults(probability, explanation, mean, variance, stdDev, lambda, x)
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
  
  function displayResults(probability, explanation, mean, variance, stdDev, lambda, x) {
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
              <div class="result-explanation">Tiempo promedio entre eventos = 1/λ</div>
          </div>
  
          <div class="result-item">
              <div class="result-label">Varianza (σ²)</div>
              <div class="result-value">${variance.toFixed(4)}</div>
              <div class="result-explanation">Varianza = 1/λ²</div>
          </div>
  
          <div class="result-item">
              <div class="result-label">Desviación Estándar (σ)</div>
              <div class="result-value">${stdDev.toFixed(4)}</div>
              <div class="result-explanation">Desviación estándar = 1/λ</div>
          </div>
  
          <div style="margin-top: 1.5rem; padding: 1rem; background-color: hsl(var(--secondary)); border-radius: 0.5rem;">
              <div style="font-size: 0.875rem; color: hsl(var(--muted-foreground));">
                  <strong>Parámetros utilizados:</strong><br>
                  λ = ${lambda} (tasa de ocurrencia)<br>
                  x = ${x} (tiempo observado)<br>
                  e ≈ 2.71828 (constante de Euler)
              </div>
          </div>
      `
  }
  
  // Permitir cálculo con Enter
  document.querySelectorAll("input").forEach((input) => {
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        calculateExponential()
      }
    })
  })
  