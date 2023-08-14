import { Point } from "./gamedata.js"
class Chart {
    constructor(canvas, y_axis) {
        this.ctx = canvas.getContext("2d")
        this.width = canvas.getAttribute("width")
        this.height = canvas.getAttribute("height")
        this.boarder = 20
        this.y_axis = y_axis
        this.array = []
        this.y_interval = 1
        this.x_point_quantity = 20

        this.bottom = this.height - this.boarder
        this.top = 0 + this.boarder
        this.right = this.width - this.boarder
        this.left = 0 + this.boarder

    }

    init() {
        let ctx = this.ctx
        ctx.beginPath()
        ctx.moveTo(this.right, 0 + this.bottom)
        ctx.lineTo(this.left, this.bottom)
        ctx.lineTo(this.left, this.top)
        ctx.stroke()

        ctx.fillText("time", this.right, this.bottom)
        ctx.fillText(this.y_axis, this.left, this.top)
        ctx.fillText(this.y_interval, this.left+20, this.top+30)
    }

    update_single_value(value) {
        this.ctx.clearRect(0, 0, this.width, this.height)
        this.init()
        let array = this.array
        array.push(value)

        let ctx = this.ctx

        let end_i = array.length - 1
        let begin_i = (end_i - this.x_point_quantity) >= 0 ? end_i - this.x_point_quantity : 0
        this.y_interval = Math.max(...array)
        if (this.y_interval == 0)
            return

        ctx.beginPath()
        let point = this.get_point(0, array[begin_i])
        ctx.moveTo(point.x, point.y)
        for (let i = begin_i; i <= end_i; i++) {
            point = this.get_point(i-begin_i, array[i])
            ctx.lineTo(point.x, point.y)
        }
        ctx.stroke()
    }

    get_point(x, y) {
        return new Point(this.left + (this.right - this.left) * x / this.x_point_quantity,
            this.bottom - (this.bottom - this.top) * y / this.y_interval)
    }



}



export { Chart }