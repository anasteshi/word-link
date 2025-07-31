const words = [
	"spaghetti",
	"noodles",
	"pasta",
	"sauce",
	"tomato",
	"cheese",
	"garlic",
	"basil",
	"olive",
	"fork",
]

function getRandomInt(max) {
	return Math.floor(Math.random() * max)
}

function shuffle(array) {
	return array.sort(() => Math.random() - 0.5)
}

function createSpaghettiWords() {
	const shuffledWords = shuffle(words)

	shuffledWords.forEach((word) => {
		const span = document.createElement("span")
		span.className = "word"
		span.textContent = word

		span.style.left = `${getRandomInt(window.innerWidth - 100)}px`
		span.style.top = `${getRandomInt(window.innerHeight - 40)}px`
		span.style.transform = `rotate(${getRandomInt(360)}deg)`

		document.body.appendChild(span)
	})
}

createSpaghettiWords()
