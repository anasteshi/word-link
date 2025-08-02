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


	}

	draw(ctx) {
		ctx.fillStyle = this.color
		ctx.font = `${this.size}px Times New Roman`
		ctx.fillText(this.letter, this.x, this.y)
	}
}
