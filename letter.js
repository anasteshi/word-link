export default class Letter {
	vx = (Math.random() - 0.5) * 2
	vy = (Math.random() - 0.5) * 2
	size = 40
	alpha = 1
	isPartOfWord = false
	toBeRemoved = false
	invalidWord = false

	constructor(letter, x, y, sequenceId) {
		this.letter = letter
		this.x = x
		this.y = y
		this.sequenceId = sequenceId
		this.color = `hsl(${(this.sequenceId * 40) % 360}, 80%, 60%)` // Give each sequence a unique, consistent color
	}

	updateLetter(letters, width, height) {
		if (this.invalidWord) {
			this.alpha -= 0.02
			if (this.alpha <= 0) {
				this.toBeRemoved = true
			}
		}

		this.x += this.vx
		this.y += this.vy

		const radius = this.size / 2

		if (this.x < radius || this.x > width - radius) {
			this.vx *= -1
		}

		if (this.y < radius || this.y > height - radius) {
			this.vy *= -1
		}

		for (const otherLetter of letters) {
			if (otherLetter == this) {
				continue
			}

			const dx = this.x - otherLetter.x
			const dy = this.y - otherLetter.y
			const distance = Math.hypot(dx, dy)

			if (distance < this.size) {
				const force = (this.size - distance) * 0.05

				this.vx += (dx / distance) * force
				this.vy += (dy / distance) * force
			}
		}

		this.vx *= 0.98
		this.vy *= 0.98
	}

	drawLetter(ctx) {
		if (this.isPartOfWord) {
			ctx.fillStyle = "gold"
			ctx.shadowColor = "yellow"
			ctx.shadowBlur = 10
		} else {
			ctx.fillStyle = this.color
			ctx.shadowColor = "transparent"
			ctx.shadowBlur = 0
		}
		ctx.globalAlpha = this.alpha
		ctx.font = `${this.size}px Times New Roman`
		ctx.fillText(this.letter, this.x, this.y)
		ctx.shadowColor = "transparent"
		ctx.shadowBlur = 0
		ctx.globalAlpha = 1
	}
}
