import Letter from "./letter.js"

export default class WordBuilder {
	letters = []
	currentWordSequence = 0
	lastTypedTime = 0
	wordCheckTimeout = null
	dictionary = new Set()
	guessedWords = new Set()

	constructor(canvas) {
		this.canvas = canvas
		this.ctx = canvas.getContext("2d")
		this.resize()
		this.loadDictionary()
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

		if (
			this.dictionary.has(word.toLowerCase()) &&
			!(word.length < 3) &&
			!this.guessedWords.has(word)
		) {
			for (const letter of partsOfWord) {
				letter.isPartOfWord = true
			}
			this.guessedWords.add(word)
			this.snapWordIntoPlace(partsOfWord)
		} else {
			for (const letter of partsOfWord) {
				letter.invalidWord = true
			}
		}
	}

	loadDictionary() {
		fetch(
			"https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt"
		)
			.then((response) => {
				if (!response.ok) {
					throw new Error("Something went wrong while loading the dictionary")
				}
				return response.text()
			})
			.then((text) => {
				const words = text
					.split("\n")
					.map((word) => word.trim().toLowerCase())
					.filter((word) => word.length > 0)

				this.dictionary = new Set(words)
			})
			.catch((error) => {
				console.log("Error loading dictionary:", error)
			})
	}

	snapWordIntoPlace(wordLetters) {
		let centerX = 0
		let centerY = 0

		for (const letter of wordLetters) {
			centerX += letter.x
			centerY += letter.y
		}

		centerX /= wordLetters.length
		centerY /= wordLetters.length

		const spacing = 35

		for (let i = 0; i < wordLetters.length; i++) {
			const letter = wordLetters[i]
			const offset = i - (wordLetters.length - 1) / 2

			const targetX = centerX + offset * spacing
			const targetY = centerY

			letter.targetX = targetX
			letter.targetY = targetY
			letter.hasTarget = true
		}
	}
}
