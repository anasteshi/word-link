export default class Letter {
	vx = (Math.random() - 0.5) * 2
	vy = (Math.random() - 0.5) * 2
	size = 40
	color = "black"

	constructor(letter, x, y) {
		this.letter = letter
		this.x = x
		this.y = y
	}

	updateLetter(letters, width, height) {
		this.x += this.vx
		this.y += this.vy

		if (this.x < this.size || this.x > width - this.size) {
			this.vx *= -0.8
		}

		if (this.y < this.size || this.y > height - this.size) {
			this.vy *= -0.8
		}

		for (const otherLetter of letters) {
			if (otherLetter == this) {
				continue
			}

			const dx = this.x - otherLetter.x
			const dy = this.y - otherLetter.y
			const distance = Math.hypot(dx, dy)

			if (distance < 40) {
				const force = (40 - distance) * 0.05

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
