import WordBuilder from "./wordBuilder.js"

const canvas = document.getElementById("game-canvas")
const wordBuilder = new WordBuilder(canvas)

wordBuilder.addLetter("A")
wordBuilder.addLetter("B")
wordBuilder.addLetter("C")

function gameLoop() {
	wordBuilder.update()
	wordBuilder.draw()
	requestAnimationFrame(gameLoop)
}

window.addEventListener("resize", () => {
	wordBuilder.resize()
})

window.addEventListener("keydown", (e) => {
	if (e.key.length === 1 && /^[a-zA-Z]$/.test(e.key)) {
		wordBuilder.addLetter(e.key.toUpperCase())
	}
})

gameLoop()
