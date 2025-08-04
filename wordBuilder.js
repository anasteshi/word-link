import Letter from "./letter.js"

export default class WordBuilder {
	letters = []
	currentWordSequence = 0
	lastTypedTime = 0
	wordCheckTimeout = null
	dictionary = new Set()
	guessedWords = new Set()
	placedWords = []

	constructor(canvas) {
		this.canvas = canvas
		this.ctx = canvas.getContext("2d")
		this.resize()
		this.loadDictionary()
	}

	resize() {
		this.canvas.width = window.innerWidth
		this.canvas.height = window.innerHeight
		this.placedWords = []
	}

	addLetter(letter) {
		const now = performance.now()
		if (now - this.lastTypedTime > 1500) {
			// If it's been over 1.5 seconds, start a new sequence
			this.currentWordSequence++
		}
		this.lastTypedTime = now

		const margin = 0.1
		const x =
			Math.random() * this.canvas.width * (1 - margin * 2) +
			this.canvas.width * margin
		const y =
			Math.random() * this.canvas.height * (1 - margin * 2) +
			this.canvas.height * margin
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
		if (partsOfWord.length === 0) return

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
			this.findPositionAndSnapWord(partsOfWord)
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

	findPositionAndSnapWord(wordLetters) {
		const letterSize = 40
		const padding = 5
		this.ctx.font = `${letterSize}px Times New Roman`

		let totalWordWidth = 0
		for (const letter of wordLetters) {
			totalWordWidth += this.ctx.measureText(letter.letter).width
		}
		totalWordWidth += (wordLetters.length - 1) * padding

		const wordHeight = letterSize

		let targetCenterX, targetCenterY
		let foundPosition = false
		let attempts = 0
		const maxAttempts = 50

		let initialX =
			wordLetters.reduce((sum, l) => sum + l.x, 0) / wordLetters.length
		let initialY =
			wordLetters.reduce((sum, l) => sum + l.y, 0) / wordLetters.length

		while (!foundPosition && attempts < maxAttempts) {
			if (attempts === 0) {
				targetCenterX = initialX
				targetCenterY = initialY
			} else {
				const margin = 20
				targetCenterX =
					Math.random() * (this.canvas.width - totalWordWidth - margin * 2) +
					totalWordWidth / 2 +
					margin
				targetCenterY =
					Math.random() * (this.canvas.height - wordHeight - margin * 2) +
					wordHeight / 2 +
					margin
			}

			const newWordBox = {
				x: targetCenterX - totalWordWidth / 2,
				y: targetCenterY - wordHeight / 2,
				width: totalWordWidth,
				height: wordHeight,
			}

			let isColliding = false
			for (const placedWord of this.placedWords) {
				if (
					newWordBox.x < placedWord.box.x + placedWord.box.width &&
					newWordBox.x + newWordBox.width > placedWord.box.x &&
					newWordBox.y < placedWord.box.y + placedWord.box.height &&
					newWordBox.y + newWordBox.height > placedWord.box.y
				) {
					isColliding = true
					break
				}
			}

			if (!isColliding) {
				foundPosition = true
				this.placedWords.push({box: newWordBox, letters: wordLetters})
			}
			attempts++
		}

		if (!foundPosition) {
			targetCenterX = initialX
			targetCenterY = initialY
		}

		let currentX = targetCenterX - totalWordWidth / 2

		for (const letter of wordLetters) {
			const letterWidth = this.ctx.measureText(letter.letter).width

			letter.targetX = currentX
			letter.targetY = targetCenterY
			letter.hasTarget = true

			currentX += letterWidth + padding
		}
	}
}
