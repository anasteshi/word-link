import Letter from "./letter.js"

export default class WordBuilder {
	constructor(canvas) {
		this.canvas = canvas
		this.ctx = canvas.getContext("2d")
		this.letters = []
		this.currentWordSequence = 0
		this.lastTypedTime = 0
		this.resize()
	}

	resize() {
		this.canvas.width = window.innerWidth
		this.canvas.height = window.innerHeight
	}

	addLetter(letter) {
		const now = performance.now()

		if (now - this.lastTypedTime > 1500) { // If it's been over 1.5 seconds, start a new sequence
			this.currentWordSequence++
		}
		this.lastTypedTime = now
		const x = Math.random() * this.canvas.width * 0.8 + this.canvas.width * 0.1
		const y = Math.random() * this.canvas.height * 0.8 + this.canvas.height * 0.1
		this.letters.push(new Letter(letter, x, y, this.currentWordSequence))
	}

	update() {
		for (const letter of this.letters) {
			letter.updateLetter(this.letters, this.canvas.width, this.canvas.height)
		}
	}

	draw() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
		for (const letter of this.letters) {
			letter.draw(this.ctx)
		}
	}
}
