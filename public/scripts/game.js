var cell = 19;
var box = $('#game').width() / cell;

class Position {
    posX;
    posY;

    constructor(x, y) {
        if (x && y) {
            this.posX = x;
            this.posY = y;
        } else {
            this.posX = 0;
            this.posY = 0;
        }
    }
}



class UnitTexture {
    image = new Image();

    constructor(src) {
        this.image.src = src;
    }
}



class GameStatistic {
    score;
    direction;

    constructor() {
        this.score = 0;
        this.direction = "top";
    }
}



class Player {
    texture;
    position;
    tail;
    tailSrc;
    lastTailPosition;

    constructor(src, tail_src, posX, posY) {
        this.texture = new UnitTexture(src);
        if (posX && posY)
            this.position = new Position(posX, posY);
        else
            this.position = new Position();
        this.tail = [];
        this.tailSrc = tail_src;
    }

    draw(context) {
        context.drawImage(this.texture.image, this.position.posX, this.position.posY, box, box);
        this.tail.forEach((e) => {
            e.draw(context);
        });
    }

    isIntersectTail(nextPosition) {
        let result = false;
        this.tail.forEach((e) => {
            if (e.position.posX == nextPosition.posX && e.position.posY == nextPosition.posY)
                result = true;
        });
        return result;
    }

    move(coord, newTail = false) {
        // this.lastTailPosition = new Position(
        //     this.tail[this.tail.length - 1].position.posX,
        //     this.tail[this.tail.length - 1].position.posY
        // );



        if (newTail) {
            this.tail.unshift(new GameObject(this.tailSrc, this.position.posX, this.position.posY));
            this.position = coord;
        } else {
            let stack = [];
            stack.push(this.position);
            this.tail.forEach((e) => {
                stack.push(e.position);
            });
            this.position = coord;
            this.tail.forEach((e) => {
                e.position = stack.shift();
            });
        }

        // if (stack.length >= (this.tail.length + 2))
        //     this.tail.push(new GameObject(this.tailSrc, this.lastTailPosition.posX, this.lastTailPosition.posY));
    }
}

class GameObject {
    texture;
    position;

    constructor(src, posX, posY) {
        this.texture = new UnitTexture(src);
        if (posX && posY)
            this.position = new Position(posX, posY);
        else
            this.position = new Position();
    }

    draw(context) {
        context.drawImage(this.texture.image, this.position.posX, this.position.posY, box, box);
    }
}


class Game {
    canvas;
    ground;
    statistic;
    player;
    objects;
    context;
    game;

    /**
     * 
     * @param {*} options состоит из объектов body,player,object:
     * body {canvasSelector,src}
     * player{src,tail_src [ ,posX,posY ]}
     * objects[] {src[ ,posX,posY ]}
     */
    constructor(options) {
        this.canvas = $(options.body.canvasSelector)[0];
        this.ground = new UnitTexture(options.body.src);
        this.statistic = new GameStatistic();
        this.player = new Player(options.player.src, options.player.tail_src, options.player.posX, options.player.posY);
        this.objects = [];
        options.objects.forEach(e => {
            this.objects.push(new GameObject(e.src, e.posX, e.posY));
        });
        this.context = this.canvas.getContext('2d');
    }

    startGame() {
        if (!this.game && !this.draw) {
            this.pressKeyHandler();
            this.game = setInterval(jQuery.proxy(this.play, this), 60);
            this.draw = setInterval(jQuery.proxy(this.drawGame, this), 30);
        }
    }

    pause() {
        clearInterval(this.game);
        clearInterval(this.draw);

        this.game = undefined;
        this.draw = undefined;
    }

    play() {
        console.log(this);

        let border = this.checkIntersectWithBorder();




        if (this.checkIntersectWithObject()) {

            if (border) {
                this.player.move(border, true);
            } else {
                this.player.move(this.getNextPosition(), true);
            }
        } else {
            if (border) {
                this.player.move(border);
            } else {
                this.player.move(this.getNextPosition());
            }
        }
        //this.drawGame();
    }

    pressKeyHandler() {
        document.addEventListener('keydown', (event) => {

            if (event.keyCode == 37 && this.statistic.direction != "right")
                this.statistic.direction = "left";
            else if (event.keyCode == 38 && this.statistic.direction != "bottom")
                this.statistic.direction = "top";
            else if (event.keyCode == 39 && this.statistic.direction != "left")
                this.statistic.direction = "right";
            else if (event.keyCode == 40 && this.statistic.direction != "top")
                this.statistic.direction = "bottom";
            console.log(this.statistic.direction);
            console.log(this.play.position);
        });
    }

    drawGame() {
        this.context.drawImage(this.ground.image, 0, 0, box * cell, box * cell);

        this.objects.forEach((obj) => {
            obj.draw(this.context);
        });
        this.player.draw(this.context);

        this.context.fillStyle = "white";
        this.context.font = "50px Ubuntu";
        this.context.fillText(this.statistic.score, box * 2.5, box * 1.7);
    }

    checkIntersectWithObject() {
        let result = false;
        this.objects.forEach((e) => {
            if (this.player.position.posX == e.position.posX &&
                this.player.position.posY == e.position.posY) {
                this.statistic.score++;
                e.position.posX = Math.floor(Math.random() * 17 + 1) * box;
                e.position.posY = Math.floor(Math.random() * 15 + 3) * box;

                result = true;
            }
        });
        return result;
    }

    checkIntersectWithBorder() {
        if (this.player.position.posX < box) {
            console.log('объект слева');
            return new Position(box * 17, this.player.position.posY);
        }
        if (this.player.position.posX > box * 17) {
            console.log('объект справа');
            return new Position(box, this.player.position.posY);
        }
        if (this.player.position.posY < box * 3) {
            console.log('объект наверху');
            return new Position(this.player.position.posX, box * 17);
        }
        if (this.player.position.posY > box * 17) {
            console.log('объект внизу');
            return new Position(this.player.position.posX, box * 3);
        }
        return false;
    }

    getNextPosition() {
        let newCoord = new Position(this.player.position.posX, this.player.position.posY);

        switch (this.statistic.direction) {
            case 'left':
                newCoord.posX -= box;
                break;

            case 'right':
                newCoord.posX += box;
                break;

            case 'top':
                newCoord.posY -= box;
                break;

            case 'bottom':
                newCoord.posY += box;
                break;
            default:
                break;
        }
        return newCoord;
    }


}




var game = new Game({
    body: {
        canvasSelector: "#game",
        src: "images/ground.png"
    },
    player: {
        src: "images/body.png",
        tail_src: "images/rainbow.png",
        posX: 9 * box,
        posY: 10 * box
    },
    objects: [{
        src: "images/food.png",
        posX: box * 12,
        posY: box * 8
    }]
});

$('#start').click(jQuery.proxy(game.startGame, game));
$('#pause').click(jQuery.proxy(game.pause, game));