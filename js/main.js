import WordBuilder from "./wordBuilder.js"

const canvas = document.getElementById("game-canvas")
const wordBuilder = new WordBuilder(canvas)
const message = document.getElementById("message")

window.addEventListener("resize", () => {
	wordBuilder.resize()
})

window.addEventListener("keydown", (e) => {
	if (message.classList.contains("fade-message")) {
		message.classList.add("hidden")
	}

	if (e.key.length === 1 && /^[a-zA-Z]$/.test(e.key)) {
		// Regex to check if the key is an english letter
		wordBuilder.addLetter(e.key.toUpperCase())
	}
})

function gameLoop() {
	wordBuilder.update()
	wordBuilder.draw()
	requestAnimationFrame(gameLoop)
}

gameLoop()
