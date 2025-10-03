// Función para calcular el factorial
function factorial(n) {
  if (n === 0 || n === 1) return 1
  let result = 1
  for (let i = 2; i <= n; i++) {
    result *= i
  }
  return result
}

// Función para calcular P(X = k) en distribución de Poisson
function poissonProbability(lambda, k) {
  return (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k)
}

// Función para calcular la media
function poissonMean(lambda) {
  return lambda
}

// Función para calcular la varianza
function poissonVariance(lambda) {
  return lambda
}

// Función para calcular la desviación estándar
function poissonStdDev(lambda) {
  return Math.sqrt(lambda)
}

// Función principal de cálculo
function calculatePoisson() {
  const lambda = Number.parseFloat(document.getElementById("lambda").value)
  const k = Number.parseInt(document.getElementById("k").value)

  // Validaciones
  if (isNaN(lambda) || lambda <= 0) {
    showError("La tasa promedio λ debe ser mayor que 0")
    return
  }

  if (isNaN(k) || k < 0) {
    showError("El número de eventos debe ser mayor o igual a 0")
    return
  }

  // Calcular probabilidad
  const probability = poissonProbability(lambda, k)
  const mean = poissonMean(lambda)
  const variance = poissonVariance(lambda)
  const stdDev = poissonStdDev(lambda)

  // Mostrar resultados
  displayResults(probability, mean, variance, stdDev, lambda, k)
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

// Variable to track current chart instance
let currentChart = null

// Function to create Poisson distribution chart
function createPoissonChart(lambda, k) {
  const chartContainer = document.getElementById("chartContainer")
  const canvas = document.getElementById("distributionChart")

  chartContainer.style.display = "block"

  if (currentChart) {
    currentChart.destroy()
  }

  // Generate data for reasonable range (0 to lambda + 3*sqrt(lambda))
  const maxK = Math.ceil(lambda + 3 * Math.sqrt(lambda))

  const labels = []
  const probabilities = []
  const backgroundColors = []

  for (let i = 0; i <= maxK; i++) {
    labels.push(i.toString())
    const prob = poissonProbability(lambda, i)
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
          text: `Distribución de Poisson (λ=${lambda})`,
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
            text: "Número de eventos (k)",
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

function displayResults(probability, mean, variance, stdDev, lambda, k) {
  const resultsDiv = document.getElementById("results")

  resultsDiv.innerHTML = `
        <div class="result-item">
            <div class="result-label">Probabilidad P(X = ${k})</div>
            <div class="result-value">${probability.toFixed(6)}</div>
            <div class="result-value">${(probability * 100).toFixed(4)}%</div>
            <div class="result-explanation">Probabilidad de que ocurran exactamente ${k} eventos</div>
        </div>

        <div class="result-item">
            <div class="result-label">Media (μ)</div>
            <div class="result-value">${mean.toFixed(4)}</div>
            <div class="result-explanation">Valor esperado de eventos = λ</div>
        </div>

        <div class="result-item">
            <div class="result-label">Varianza (σ²)</div>
            <div class="result-value">${variance.toFixed(4)}</div>
            <div class="result-explanation">Varianza = λ (igual a la media)</div>
        </div>

        <div class="result-item">
            <div class="result-label">Desviación Estándar (σ)</div>
            <div class="result-value">${stdDev.toFixed(4)}</div>
            <div class="result-explanation">Raíz cuadrada de λ</div>
        </div>

        <div style="margin-top: 1.5rem; padding: 1rem; background-color: hsl(var(--secondary)); border-radius: 0.5rem;">
            <div style="font-size: 0.875rem; color: hsl(var(--muted-foreground));">
                <strong>Parámetros utilizados:</strong><br>
                λ = ${lambda} (tasa promedio de eventos)<br>
                k = ${k} (número de eventos observados)<br>
                e ≈ 2.71828 (constante de Euler)
            </div>
        </div>
    `

  createPoissonChart(lambda, k)
}

// Permitir cálculo con Enter
document.querySelectorAll("input").forEach((input) => {
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      calculatePoisson()
    }
  })
})


  
  