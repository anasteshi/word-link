import WordBuilder from "./wordBuilder.js"

const canvas = document.getElementById("game-canvas")
const wordBuilder = new WordBuilder(canvas)

window.addEventListener("resize", () => {
	wordBuilder.resize()
})

window.addEventListener("keydown", (e) => {
	if (e.key.length === 1 && /^[a-zA-Z]$/.test(e.key)) { // Regex to check if the key is an english letter
		wordBuilder.addLetter(e.key.toUpperCase())
	}
})

function gameLoop() {
	wordBuilder.update()
	wordBuilder.draw()
	requestAnimationFrame(gameLoop)
}

gameLoop()
