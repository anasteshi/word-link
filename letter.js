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

	rewriteLetter(letters, width, height) {
		this.x += this.vx
		this.y += this.vy
	}

	draw(ctx) {
		ctx.fillStyle = this.color
		ctx.font = `${this.size}px Times New Roman`
		ctx.fillText(this.letter, this.x, this.y)
	}
}
