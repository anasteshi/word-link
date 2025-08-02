export default class Letter {
	vx = (Math.random() - 0.5) * 2
	vy = (Math.random() - 0.5) * 2
	size = 40
	color = "black"

	constructor(letter, x, y, wordSequenceId) {
		this.letter = letter
		this.x = x
		this.y = y
		this.wordSequenceId = wordSequenceId
		this.color = `hsl(${(this.wordSequenceId * 40) % 360}, 80%, 60%)` // Give each sequence a unique, consistent color
	}

	updateLetter(letters, width, height) {
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

	draw(ctx) {
		ctx.fillStyle = this.color
		ctx.font = `${this.size}px Times New Roman`
		ctx.fillText(this.letter, this.x, this.y)
	}
}
