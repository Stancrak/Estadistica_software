// Función para calcular el coeficiente binomial C(n, k)
function binomialCoefficient(n, k) {
  if (k > n) return 0
  if (k === 0 || k === n) return 1

  k = Math.min(k, n - k)

  let result = 1
  for (let i = 0; i < k; i++) {
    result *= n - i
    result /= i + 1
  }
  return result
}

// Función para calcular P(X = k) en distribución hipergeométrica
function hypergeometricProbability(N, K, n, k) {
  const numerator = binomialCoefficient(K, k) * binomialCoefficient(N - K, n - k)
  const denominator = binomialCoefficient(N, n)
  return numerator / denominator
}

// Función para calcular la media
function hypergeometricMean(N, K, n) {
  return (n * K) / N
}

// Función para calcular la varianza
function hypergeometricVariance(N, K, n) {
  return (n * K * (N - K) * (N - n)) / (N * N * (N - 1))
}

// Función para calcular la desviación estándar
function hypergeometricStdDev(N, K, n) {
  return Math.sqrt(hypergeometricVariance(N, K, n))
}

// Variable para trackear la instancia actual del gráfico
let currentChart = null

// Función para crear el gráfico de distribución hipergeométrica
function createHypergeometricChart(N, K, n, k) {
  const chartContainer = document.getElementById("chartContainer")
  const canvas = document.getElementById("distributionChart")

  chartContainer.style.display = "block"

  if (currentChart) {
    currentChart.destroy()
  }

  // Calcular rango de valores posibles
  const minK = Math.max(0, n - (N - K))
  const maxK = Math.min(n, K)

  const labels = []
  const probabilities = []
  const backgroundColors = []

  for (let i = minK; i <= maxK; i++) {
    labels.push(i.toString())
    const prob = hypergeometricProbability(N, K, n, i)
    probabilities.push(prob)
    backgroundColors.push(i === k ? "hsl(142 76% 36%)" : "hsl(217 91% 60%)")
  }

  currentChart = new window.Chart(canvas, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Probabilidad",
          data: probabilities,
          backgroundColor: backgroundColors,
          borderColor: backgroundColors.map((color) => color.replace("60%", "70%")),
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: `Distribución Hipergeométrica (N=${N}, K=${K}, n=${n})`,
          color: "hsl(0 0% 98%)",
          font: {
            size: 16,
          },
        },
        tooltip: {
          callbacks: {
            label: (context) => `P(X = ${context.label}) = ${context.parsed.y.toFixed(6)}`,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Probabilidad",
            color: "hsl(0 0% 98%)",
          },
          ticks: {
            color: "hsl(0 0% 70%)",
          },
          grid: {
            color: "hsl(0 0% 20%)",
          },
        },
        x: {
          title: {
            display: true,
            text: "Éxitos en la muestra (k)",
            color: "hsl(0 0% 98%)",
          },
          ticks: {
            color: "hsl(0 0% 70%)",
          },
          grid: {
            color: "hsl(0 0% 20%)",
          },
        },
      },
    },
  })
}

// Función principal de cálculo
function calculateHypergeometric() {
  const N = Number.parseInt(document.getElementById("N").value)
  const K = Number.parseInt(document.getElementById("K").value)
  const n = Number.parseInt(document.getElementById("n").value)
  const k = Number.parseInt(document.getElementById("k").value)

  // Validaciones
  if (isNaN(N) || N < 1) {
    showError("El tamaño de la población debe ser mayor o igual a 1")
    return
  }

  if (isNaN(K) || K < 0 || K > N) {
    showError("Los éxitos en la población deben estar entre 0 y N")
    return
  }

  if (isNaN(n) || n < 1 || n > N) {
    showError("El tamaño de la muestra debe estar entre 1 y N")
    return
  }

  if (isNaN(k) || k < 0 || k > n || k > K) {
    showError("Los éxitos en la muestra deben estar entre 0 y min(n, K)")
    return
  }

  // Calcular probabilidad
  const probability = hypergeometricProbability(N, K, n, k)
  const mean = hypergeometricMean(N, K, n)
  const variance = hypergeometricVariance(N, K, n)
  const stdDev = hypergeometricStdDev(N, K, n)

  // Mostrar resultados
  displayResults(probability, mean, variance, stdDev, N, K, n, k)
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

function displayResults(probability, mean, variance, stdDev, N, K, n, k) {
  const resultsDiv = document.getElementById("results")

  resultsDiv.innerHTML = `
        <div class="result-item">
            <div class="result-label">Probabilidad P(X = ${k})</div>
            <div class="result-value">${probability.toFixed(6)}</div>
            <div class="result-value">${(probability * 100).toFixed(4)}%</div>
            <div class="result-explanation">Probabilidad de obtener exactamente ${k} éxitos en una muestra de ${n} elementos</div>
        </div>

        <div class="result-item">
            <div class="result-label">Media (μ)</div>
            <div class="result-value">${mean.toFixed(4)}</div>
            <div class="result-explanation">Valor esperado de éxitos en la muestra</div>
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
                N = ${N} (tamaño de la población)<br>
                K = ${K} (éxitos en la población)<br>
                n = ${n} (tamaño de la muestra)<br>
                k = ${k} (éxitos en la muestra)
            </div>
        </div>
    `

  // Generar gráfico después de mostrar resultados
  createHypergeometricChart(N, K, n, k)
}

// Permitir cálculo con Enter
document.querySelectorAll("input").forEach((input) => {
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      calculateHypergeometric()
    }
  })
})


  