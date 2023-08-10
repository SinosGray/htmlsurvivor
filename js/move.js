import { canvas_root, datas, attack_internal } from "./gamedata.js"

function move_all(interval) {
    interval *= 0.01
    let player_cha = datas.player.play_character
    player_cha.move(interval)
    canvas_root.center_phy_p_change_root(player_cha.point)

    for (let i = 0; i < datas.enemy_list.length; i++) {
        let enemy = datas.enemy_list[i]
        enemy.move(interval)
    }

    let bullet_list = datas.bullet_list
    for (let j = 0; j < bullet_list.length; j++) {
        let bullet = bullet_list[j]
        bullet.move(interval)
    }
    remove_out_canvas_cha()
}



function attack_detect(interval) {
    if (typeof attack_detect.time == 'undefined') {
        attack_detect.time = 0.0;
    }
    attack_detect.time += interval

    if (attack_detect.time > attack_internal) {
        let enemy_list = datas.enemy_list
        let play_cha = datas.player.play_character
        let player_bullets = play_cha.bullet_list
        for (let i = enemy_list.length - 1; i >= 0; i--) {
            let enemy = enemy_list[i]
            // player_cha attack enemy
            // enemy attack player_cha
            deal_attack(play_cha, enemy)
            deal_attack(enemy, play_cha)

            // player_cha_bullet attack enemy
            for (let j = player_bullets.length - 1; j >= 0; j--) {
                let bullet = player_bullets[j]
                deal_attack(bullet, enemy)

            }
            if (enemy.life <= 0) {
                datas.player.get_exp(enemy.exp)
                if (enemy.bullet_setinterval != undefined)
                    clearInterval(enemy.bullet_setinterval)
                if (enemy.enemy_setinterval != undefined)
                    clearInterval(enemy.enemy_setinterval)
                enemy_list.splice(i, 1)
            }
        }

        for (let i = enemy_list.length - 1; i >= 0; i--) {
            let enemy = enemy_list[i]
            // enemy_bullet attack player_cha
            for (let j = enemy.bullet_list.length - 1; j >= 0; j--) {
                let enemy_bullet = enemy.bullet_list[j]
                deal_attack(enemy_bullet, play_cha)
                if (enemy_bullet) {
                    // enemy_bullet attack player_cha_bullet
                    for (let k = player_bullets.length - 1; k >= 0; k--) {
                        let player_bullet = player_bullets[k]
                        deal_attack(enemy_bullet, player_bullet)
                        if (!enemy_bullet) { break }
                    }
                }
            }
        }
        attack_detect.time = 0
    }
}


function deal_attack(attacker, attacked) {

    if (distance2p(attacker.point, attacked.point) <= attacker.hit_radius + attacked.size[0]) {

        if (attacker.constructor.name == "Bullet") {

            attacker.bullet_be_attacked()
        }
        let damage = attacker.attack

        if (attacked.constructor.name == "Bullet") {
            attacked.bullet_be_attacked()
        }
        else {
            attacked.enemy_be_attacked(damage)
        }

        return true
    }
    return false
}

function distance2p(point_a, point_b) {
    return Math.sqrt((point_a.x - point_b.x) ** 2 + (point_a.y - point_b.y) ** 2)
}


function remove_out_canvas_cha() {
    let bullet_list = datas.bullet_list
    let center_point = datas.player.play_character.point
    let boarder = 100
    let rate = canvas_root.__map_rate


    bullet_list.forEach(bullet => {
        if (distance2p(bullet.point, center_point) >= (canvas_root.__canvas_width + boarder) * rate) {
            bullet.parent.remove_bullet(bullet.uid)
        }
    });
}


export { move_all, attack_detect, remove_out_canvas_cha }

