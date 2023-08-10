"use strict"

import { EnemyGenerator, datas, canvas_root, init, frame_interval } from "./gamedata.js"
import { DrawAll } from "./Draw.js"
import { move_all, attack_detect } from "./move.js"



var canvas = document.getElementById("html_canvas")
if (canvas)
  console.log("canvas ok")
else
  console.log("canvas failed")



var ctx = canvas.getContext("2d")
var timestamp = Date.now()


canvas.addEventListener('keydown', (event) => {
  if (event.defaultPrevented) {
    return;
  }
  var direction = -1
  if (event.code === "ArrowDown") {
    direction = 1 / 2
  } else if (event.code === "ArrowUp") {
    direction = 3 / 2
  } else if (event.code === "ArrowLeft") {
    direction = 1
  } else if (event.code === "ArrowRight") {
    direction = 0
  }
  if (direction != -1) {
    datas.player.play_character.speed = datas.player.play_character.origin_speed
    datas.player.play_character.direction = Math.PI * direction
  }
}, false)

canvas.addEventListener('keyup', (event) => {
  if (event.defaultPrevented) {
    return;
  }
  if (event.code === "ArrowDown" || event.code === "ArrowUp" || event.code === "ArrowLeft" || event.code === "ArrowRight") {
    datas.player.play_character.speed = 0
  } else {
    return
  }
}, false)

// canvas.addEventListener("mousemove", (e)=>{
//   document.getElementById("mouse_x").innerHTML = e.offsetX
//   document.getElementById("mouse_y").innerHTML = e.offsetY
// })

canvas.focus()

init()
var interval = 0
var generator = new EnemyGenerator(1000)
generator.generate()
mainloop()
function mainloop() {
  interval = (Date.now() - timestamp)
  if (interval > frame_interval) {
    update_html()
    ctx.clearRect(0, 0, canvas_root.__canvas_width, canvas_root.__canvas_height)
    move_all(interval)
    DrawAll(ctx)
    attack_detect(interval)

    timestamp = Date.now()
  }
  requestAnimationFrame(mainloop)

}


function update_html(){
  document.getElementById("interval").innerHTML = interval
}






