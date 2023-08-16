import { enemy_str, player_str, bullet_str, equipment_str } from "./json.js"
import { ArrayHas } from "./utils.js"
class Point {
    constructor(x, y) {
        this.x = x
        this.y = y
    }

    clone() {
        return new Point(this.x, this.y)
    }
}

class CanvasRoot {
    constructor() {
        this.__root_point = new Point(0, 0)
        this.__map_rate = 2.0
        var canvas = document.getElementById("html_canvas")
        this.__canvas_width = Number(canvas.getAttribute("width"))
        this.__canvas_height = Number(canvas.getAttribute("height"))
    }

    phy_p2canvas_p(phy_point) {
        var canvas_x = (phy_point.x - this.__root_point.x) / this.__map_rate
        var canvas_y = (phy_point.y - this.__root_point.y) / this.__map_rate
        return new Point(canvas_x, canvas_y)
    }

    canvas_p2phy_p(canvas_point) {
        var phy_x = canvas_point.x * this.__map_rate + this.__root_point.x
        var phy_y = canvas_point.y * this.__map_rate + this.__root_point.y
        return new Point(phy_x, phy_y)
    }

    center_phy_p_change_root(phy_point) {
        var canvas_midx = this.__canvas_width / 2
        var canvas_midy = this.__canvas_height / 2
        this.__root_point.x = phy_point.x - canvas_midx * this.__map_rate
        this.__root_point.y = phy_point.y - canvas_midy * this.__map_rate
    }
}

function distance2p(point_a, point_b) {
    return Math.sqrt((point_a.x - point_b.x) ** 2 + (point_a.y - point_b.y) ** 2)
}

class Datas {
    constructor() {
        this.enemy_list = []
        this.bullet_list = []
        this.player = null
        this.enemy_generator = null
        this.equipment_generator = new EquipmentGenerator()

    }

    clear_datas() {
        if (this.enemy_generator) {
            this.enemy_generator.stop_generate()
        }
        if (this.player) {
            this.player.play_character.clear_self()
        }
        for (let i = this.enemy_list.length - 1; i >= 0; i--)
            this.enemy_list[i].clear_self(i)
        this.bullet_list = []

    }

    startup() {
        if (this.player) {
            this.player.play_character.start_up()
        }
    }


}

class Character {
    constructor(point, uid, direction, dst_cha, json) {
        this.point = point
        this.uid = uid
        this.direction = direction
        this.dst_cha = dst_cha
        this.generate_id = 0

        this.datas = datas
        this.bullet_json = bullet_json
        this.enemy_json = enemy_json

        this.init_from_json(json)
        this.origin_life = this.life

        this.move_func = this.direction_straight
        switch (this.move_type) {
            case "circle":
                this.move_func = this.direction_around
                break
            case "line":
                this.move_func = this.direction_line
                break
        }

    }

    direction_line() {
        if (this.dst_cha === null) {
            return this.direction
        } else {
            var x = this.dst_cha.point.x - this.point.x
            var y = this.dst_cha.point.y - this.point.y
            var angle = Math.atan2(y, x)
            if (y < 0.0)
                angle = 2 * Math.PI + angle
            return angle
        }
    }

    direction_straight() {
        return this.direction
    }

    direction_around() {
        if (distance2p(this.point, this.dst_cha.point) > this.move_detail["radius"])
            return this.direction_line()
        else {
            return this.direction_line() + Math.PI / 2
        }
    }

    init_from_json(json) {
        for (let key in json) {
            if (Object.prototype.hasOwnProperty.call(json, key)) {
                this[key] = json[key];
            }
        }
    }

    move(time) {
        this.direction = this.move_func()
        this.point.x += time * this.speed * Math.cos(this.direction)
        this.point.y += time * this.speed * Math.sin(this.direction)
    }

    string() {
        return " life:" + this.life
        //"x:" + (this.point.x).toFixed(2) + " y:" + (this.point.y).toFixed(2) + "\nuid:" + this.uid + "\ndirec:" + (this.direction / Math.PI).toFixed(2) + "π speed:" + this.speed + " img:" + this.img + 
    }

    generate_uid(child_type) {
        let uid = this.uid + "_" + child_type + "-" + this.generate_id;
        this.generate_id++;
        return uid
    }


}

class Player {
    constructor(player_character) {
        this.play_character = player_character
        this.level = 0
        this.leveled = 0
        this.exp = 0
        this.play_character.origin_speed = player_character.speed
        this.play_character.speed = 0
    }

    get_exp(exp) {
        var max_exp = this.level * 100 + 100
        this.exp += exp
        if (this.exp >= max_exp) {
            this.exp -= max_exp
            this.level++
            this.play_character.bullet_column += 1
            console.log("level up to " + this.level)
            console.log("exp: " + max_exp)
        }
    }

    clear_player_char() {
        this.clear_player_char.clear_self()
    }
}

class Enemy extends Character {
    constructor(point, uid, direction, dst_cha, json) {
        super(point, uid, direction, dst_cha, json)
        this.bullet_list = []
        this.start_up()

    }
    start_up() {
        if (this.bullet == true)
            this.bullet_setinterval = setInterval(() => {
                this.generate_bullet(this.generate_uid("bullet"), this.bullet_type)
            }, this.bullet_interval);
        if (this.generate_enemy == true)
            this.enemy_setinterval = setInterval(() => {
                var generate_enemy_data = this.enemy_json.find(data => data.type == this.generate_enemy_type)
                this.datas.enemy_list.push(new Enemy(this.point.clone(), this.generate_uid("generate_enemy"), 0, this.dst_cha, generate_enemy_data, this.bullet_json, this.enemy_json, this.datas))
            }, this.generate_interval);
    }
    generate_bullet(uid, bullet_type) {
        var bullet_data = this.bullet_json.find(data => data.type == bullet_type)

        var start_angle = this.direction_line() - Math.PI / 2
        var edge_angle = Math.PI / (this.bullet_column + 1)

        var interval_angle = (Math.PI - 2 * edge_angle) / (this.bullet_column - 1)

        for (let i = 0; i < this.bullet_column; i++) {
            var bullet = new Bullet(this.point.clone(), uid + "_split-" + i, start_angle + edge_angle + interval_angle * i, this.dst_cha, bullet_data, this)
            this.bullet_list.push(bullet)
            this.datas.bullet_list.push(bullet)
        }
    }

    remove_bullet(uid) {
        let bullet_list = this.bullet_list
        for (let i = bullet_list.length - 1; i >= 0; i--) {
            let bullet = bullet_list[i]
            if (bullet.uid == uid) {
                clearTimeout(bullet.timeout)
                bullet_list.splice(i, 1)
                break
            }
        }

        bullet_list = this.datas.bullet_list
        for (let i = bullet_list.length - 1; i >= 0; i--) {
            let bullet = bullet_list[i]
            if (bullet.uid == uid) {
                bullet_list.splice(i, 1)
                break
            }
        }
    }

    enemy_be_attacked(damage) {
        this.life -= damage
        if (this.type != "player") {
            var back_direction = this.direction_line() + Math.PI
            damage *= 2
            this.point.x += Math.cos(back_direction) * damage
            this.point.y += Math.sin(back_direction) * damage
        }
        if (this.life <= 0 && this.reborn !== undefined && this.reborn > 0) {
            this.reborn -= 1
            this.life = this.origin_life
        }
    }

    clear_self(number = NaN) {
        if (this.bullet_setinterval != undefined)
            clearInterval(this.bullet_setinterval)
        if (this.enemy_setinterval != undefined)
            clearInterval(this.enemy_setinterval)
        this.bullet_list = []
        if (!isNaN(number))
            this.datas.enemy_list.splice(number, 1)
    }

}

class Bullet extends Character {
    constructor(point, uid, direction, dst_cha, json, parent) {
        super(point, uid, direction, dst_cha, json)
        this.parent = parent
        this.exploded = false
        this.timeout = null
    }

    bullet_be_attacked() {
        // todo
        this.life -= 1
        if (this.life <= 0) {
            if (this.explosion == true && this.exploded == false) {
                this.exploded = true
                this.size = this.explosion_size
                this.img = this.explosion_img
                this.attack = this.explosion_attack
                this.hit_radius = this.explosion_radius
                this.speed = 0

                this.timeout = setTimeout(() => {
                    this.attack = 0
                    setTimeout(() => {
                        this.parent.remove_bullet(this.uid)
                    }, explode_img_time)
                }, frame_interval * 2)

            } else if (this.explosion != true) {
                this.parent.remove_bullet(this.uid)
            }

        }
    }

}

class EnemyGenerator {
    constructor(timeout) {
        this.canvas_root = canvas_root
        this.datas = datas
        this.timeout = timeout
        this.enemy_json = enemy_json
        this.bullet_json = bullet_json
        this.generator = null
    }

    generate_edge_enemy(uid, dst_cha, direction = 0) {
        var random_enemy_data = this.enemy_json[Math.floor(Math.random() * this.enemy_json.length)]

        var enemy = new Enemy(this.get_random_point_on_edge(), uid, direction, dst_cha, random_enemy_data, this.bullet_json, this.enemy_json, this.datas)
        this.datas.enemy_list.push(enemy)
    }

    generate() {
        var enemy_number = 0
        var dst_cha = this.datas.player.play_character
        this.generator = setInterval(() => {
            this.generate_edge_enemy("enemy" + enemy_number++, dst_cha)
        }, this.timeout);
    }

    get_random_point_on_edge() {
        var choice = Math.random() * 4
        if (choice > 3)
            return this.canvas_root.canvas_p2phy_p(new Point(this.canvas_root.__canvas_width * Math.random(), 0))
        else if (choice > 2)
            return this.canvas_root.canvas_p2phy_p(new Point(this.canvas_root.__canvas_width, this.canvas_root.__canvas_height * Math.random()))
        else if (choice > 1)
            return this.canvas_root.canvas_p2phy_p(new Point(this.canvas_root.__canvas_width * Math.random(), this.canvas_root.__canvas_height))
        else
            return this.canvas_root.canvas_p2phy_p(new Point(0, this.canvas_root.__canvas_height * Math.random()))
    }

    stop_generate() {
        clearInterval(this.generator)
    }
}

class Equipment {
    constructor(json) {
        this.json = json
        for (let key in json) {
            if (Object.prototype.hasOwnProperty.call(json, key)) {
                this[key] = json[key];
            }
        }
    }
}

class EquipmentGenerator {
    constructor() {
        this.equipment_json = equipment_json
    }

    generate_random_equipments(equipment_quantity) {
        let equipments = new Array(3)
        let i = 0
        while (i < equipment_quantity) {
            var random_equipment_data = this.equipment_json[Math.floor(Math.random() * this.equipment_json.length)]
            var equipment = new Equipment(random_equipment_data)
            if (!ArrayHas(equipments, equipment)) {
                equipments[i] = equipment
                i++
            }
        }

        return equipments
    }

}

function equip(cha, equipment) {
    for (let cha_key in cha) {
        for (let equipment_key in equipment) {
            if (cha_key == equipment_key) {
                cha[cha_key] += equipment[equipment_key][0] * equipment[equipment_key][1]
                continue
            }
        }
    }
}

var canvas_root
var datas
var enemy_json
var player_json
var bullet_json
var equipment_json
var attack_internal
var explode_img_time
var frame_interval


function init() {
    canvas_root = new CanvasRoot()
    enemy_json = JSON.parse(enemy_str)
    player_json = JSON.parse(player_str)
    bullet_json = JSON.parse(bullet_str)
    equipment_json = JSON.parse(equipment_str)


    datas = new Datas()
    datas.player = new Player(new Enemy(new Point(canvas_root.__canvas_width / 2, canvas_root.__canvas_height / 2), "player", 0, null, player_json, bullet_json))
    frame_interval = 1000 / 24
    explode_img_time = frame_interval * 5
    attack_internal = frame_interval * 2


}
export { Enemy, Bullet, EnemyGenerator, Point, canvas_root, datas, init, attack_internal, frame_interval, equip }