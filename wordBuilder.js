import Letter from "./letter.js"

export default class WordBuilder {
	letters = []
	currentWordSequence = 0
	lastTypedTime = 0
	dictionary = new Set(["hello", "world", "test", "word", "cat", "dog"])
	wordCheckTimeout = null

	constructor(canvas) {
		this.canvas = canvas
		this.ctx = canvas.getContext("2d")
		this.resize()
	}

	resize() {
		this.canvas.width = window.innerWidth
		this.canvas.height = window.innerHeight
	}

	addLetter(letter) {
		const now = performance.now()
		if (now - this.lastTypedTime > 1500) {
			// If it's been over 1.5 seconds, start a new sequence
			this.currentWordSequence++
		}
		this.lastTypedTime = now

		const x = Math.random() * this.canvas.width * 0.8 + this.canvas.width * 0.1
		const y =
			Math.random() * this.canvas.height * 0.8 + this.canvas.height * 0.1
		this.letters.push(new Letter(letter, x, y, this.currentWordSequence))

		this.scheduleWordCheck(this.currentWordSequence)
	}

	update() {
		for (const letter of this.letters) {
			letter.updateLetter(this.letters, this.canvas.width, this.canvas.height)
		}
		this.letters = this.letters.filter((letter) => !letter.toBeRemoved)
	}

	draw() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
		for (const letter of this.letters) {
			letter.drawLetter(this.ctx)
		}
	}

	scheduleWordCheck(sequenceId) {
		if (this.wordCheckTimeout) {
			clearTimeout(this.wordCheckTimeout)
		}

		this.wordCheckTimeout = setTimeout(() => {
			this.validate(sequenceId)
		}, 1500)
	}

	validate(sequenceId) {
		const partsOfWord = this.letters.filter(
			(letter) => letter.sequenceId === sequenceId
		)
		const word = partsOfWord.map((letter) => letter.letter).join("")

		if (word.length < 0) {
			return
		}

		if (this.dictionary.has(word.toLowerCase())) {
			console.log(`SUCCESS: ${word}`)
			for (const letter of partsOfWord) {
				letter.isPartOfWord = true
			}
		} else {
			console.log(`FAILURE! ${word} is not a word`)
			for (const letter of partsOfWord) {
				letter.invalidWord = true
			}
		}
	}
}
