import { datas, canvas_root } from "./gamedata.js"
function DrawAll(ctx) {
    let bullet_list = datas.bullet_list
    let object_list = []
    object_list.push(...datas.enemy_list)
    object_list.push(...bullet_list)
    object_list.push(datas.player.play_character)

    for (let i = 0; i < object_list.length; i++) {
        let object = object_list[i]
        let object_canvas_point = canvas_root.phy_p2canvas_p(object.point)
        ctx.drawImage(document.getElementById(object.img), object_canvas_point.x - object.size[0] / 2, object_canvas_point.y - object.size[1] / 2, object.size[0], object.size[1])
        ctx.fillText(object.string(), object_canvas_point.x + object.size[0] / 2, object_canvas_point.y)
    }
}

export { DrawAll }




