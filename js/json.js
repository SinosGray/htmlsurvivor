var enemy_str = String.raw`
    [
        {
            "type": "e1",
            "speed": 10,
            "attack": 10,
            "life": 100,
            "hit_radius": 10,
            "img": "enemy1",
            "move_type": "circle",
            "move_detail": {
                "radius": 500
            },
            "bullet": false,
            "bullet_type": "b1",
            "bullet_interval": 3000,
            "bullet_column": 3,
            "size": [
                40,
                40
            ],
            "exp":20,
            "reborn":2
        },
        {
            "type": "e2",
            "speed": 20,
            "attack": 10,
            "life": 100,
            "hit_radius": 10,
            "img": "enemy2",
            "bullet": false,
            "move_type": "line",
            "size": [
                40,
                40
            ],
            "exp":100
        }, 
        {
            "type": "e3",
            "speed": 20,
            "attack": 10,
            "life": 100,
            "hit_radius": 10,
            "img": "enemy3",
            "bullet": false,
            "move_type": "circle",
            "move_detail": {
                "radius": 600
            },
            "size": [
                40,
                40
            ],
            "generate_enemy":true,
            "generate_enemy_type":"e4",
            "generate_interval":5000,
            "exp":500
        }, 
        {
            "type": "e4",
            "speed": 20,
            "attack": 10,
            "life": 100,
            "hit_radius": 10,
            "img": "enemy1",
            "bullet": false,
            "move_type": "line",
            "size": [
                40,
                40
            ],
            "exp":100
        }
    ]
    `

var player_str = String.raw`
    {
        "type": "player",
        "speed": 60,
        "attack": 0,
        "life": 100,
        "hit_radius": 100,
        "img": "main_role",
        "size": [
            50,
            50
        ],
        "move_type": "line",
        "bullet": true,
        "bullet_type": "b1",
        "bullet_interval": 1000,
        "bullet_column": 2
    }
    `

 var bullet_str = String.raw`
    [
        {
            "type": "b1",
            "speed": 40,
            "attack": 0,
            "life": 1,
            "hit_radius": 30,
            "img": "bullet1",
            "size":[20, 20],
            "explosion":true,
            "explosion_size":[80, 80],
            "explosion_img": "explosion",
            "explosion_attack":30,
            "explosion_radius":80
            
        }, 
        {
            "type": "b2",
            "speed": 20,
            "attack": 100,
            "life": 5,
            "hit_radius": 30,
            "img": "bullet2",
            "size":[20, 20]
        }
    ]    
    `
    export{enemy_str, player_str, bullet_str}