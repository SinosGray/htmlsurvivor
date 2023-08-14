"use strict"

import { EnemyGenerator, datas, canvas_root, init, frame_interval } from "./gamedata.js"
import { DrawAll } from "./Draw.js"
import { move_all, attack_detect } from "./move.js"
import { Chart } from "./chart.js"


var canvas = document.getElementById("html_canvas")
if (canvas)
  console.log("canvas ok")
else
  console.log("canvas failed")

canvas.addEventListener('keydown', (event) => {
  if (event.defaultPrevented) {
    return;
  }
  var direction = -1
  if (event.code === "KeyS") {
    direction = 1 / 2
  } else if (event.code === "KeyW") {
    direction = 3 / 2
  } else if (event.code === "KeyA") {
    direction = 1
  } else if (event.code === "KeyD") {
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
  if (event.code === "KeyS" || event.code === "KeyW" || event.code === "KeyA" || event.code === "KeyD") {
    datas.player.play_character.speed = 0
  } else {
    return
  }
}, false)

// canvas.addEventListener("mousemove", (e)=>{
//   document.getElementById("mouse_x").innerHTML = e.offsetX
//   document.getElementById("mouse_y").innerHTML = e.offsetY
// })
// function update_html() {
//   document.getElementById("interval").innerHTML = passing_time
// }

var ctx = canvas.getContext("2d")
var timestamp = Date.now()

var turn = 0
var turn_time = 60
var request_animate_id
document.getElementById("levelup_end").onclick = () => {
  end_levelup()
  begin_game()
}
init()
datas.clear_datas()
var chart = new Chart(document.getElementById("chart_canvas"), "enemy_quantity")
begin_game()


function begin_game() {
  change_game_title("gaming")
  datas.generator = new EnemyGenerator(1000)
  datas.generator.generate()
  datas.startup()
  timer_countdown(turn_time)
  game_loop()
}

function end_game() {
  console.log("game end")
  datas.clear_datas()
  turn = turn + 1
  cancelAnimationFrame(request_animate_id)
  begin_levelup()
}

function begin_levelup() {
  change_game_title("level up")
}

function end_levelup() {
  console.log("levelup end")
}


function game_loop() {
  var interval = (Date.now() - timestamp)
  if (interval > frame_interval) {
    ctx.clearRect(0, 0, canvas_root.__canvas_width, canvas_root.__canvas_height)
    move_all(interval)
    DrawAll(ctx)
    attack_detect(interval)
    timestamp = Date.now()
  }
  request_animate_id = requestAnimationFrame(game_loop)
}


function timer_countdown(turn_time) {
  let total_time = turn_time
  let timer_bias = 2
  let html_countdown = document.getElementById("countdown")
  var timer
  setTimeout(() => {
    clearInterval(timer)
    end_game()
  }, 1e3 * (total_time + timer_bias))
  timer = setInterval(() => {
    html_countdown.innerHTML = total_time
    chart.update_single_value(datas.enemy_list.length)
    total_time--
  }, 1e3)
}

function change_game_title(text) {
  document.getElementById("game_status").innerHTML = text
}






