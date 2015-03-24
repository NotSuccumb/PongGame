(function(){
    var canvas, ctx;

    var UP = 38;
    var DOWN = 40;

    var controls = [];

    var HEIGHT = 500, WIDTH = 500;

    var player, ai, ball;

    var paddleWidth = 15;
    var paddleHeight = 80;

    var paddleMaxVel = 7;
    var ballMaxSpeed = 10;

    var score =[0, 0];

    var Paddle = function(){
        this.width = paddleWidth;
        this.height = paddleHeight;
        this.x = (WIDTH - this.width)/2;
        this.y = (HEIGHT - this.height)/2;

        this.vy = 0;

        this.draw = function(){
            ctx.fillStyle = 'white';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    var Player = function(){
        Paddle.apply(this, arguments);

        this.update = function(){
            if(controls[UP]){
                this.vy = -paddleMaxVel;
            } else if(controls[DOWN]){
                this.vy = paddleMaxVel;
            } else this.vy = 0;

            this.y += this.vy;

            if(this.y + this.height > HEIGHT){
                this.y = HEIGHT - this.height;
            }
            if(this.y < 0){
                this.y = 0;
            }
        }
    }
    Player.prototype = Object.create(Paddle.prototype);
    Player.prototype.constructor = Paddle;


    var AI = function(){
        Paddle.apply(this, arguments);
        this.update = function(){
            this.vy = (ball.y - (this.height - ball.side)/2 - this.y) * 0.1;
            if(this.vy < 0) {
                if(this.vy < -paddleMaxVel){ this.vy = -paddleMaxVel; }
            } else {
                if(this.vy > paddleMaxVel){ this.vy = paddleMaxVel }
            }
            this.y += this.vy;
            if(this.y + this.height > HEIGHT){
                this.y = HEIGHT - this.height;
            }
            if(this.y < 0){
                this.y = 0;
            }
        }
    }
    AI.prototype = Object.create(Paddle.prototype);
    AI.prototype.constructor = Paddle;

    var Ball = function(){
        this.side = 15;
        this.x = (WIDTH - this.side)/2;
        this.y = (HEIGHT - this.side)/2;

        this.vx = ballMaxSpeed;
        this.vy = 0;

        if(Math.random() > .5) {
            this.vx *= -1;
        }
        if(Math.random() > .5) {
            this.vy *= -1;
        }

        this.update = function(){

            this.x += this.vx;
            this.y += this.vy;

            if(this.x > WIDTH){
                this.x = ai.x - ai.width - this.side;
                this.y = ai.y + (ai.height - this.side)/2;
                this.vx *= -1;
                score[0]++;
            }
            if(this.x + this.side < 0){
                this.x = player.x + player.width;
                this.y = player.y + (player.height - this.side)/2;
                this.vx *= -1;
                score[1]++;
            }

            if(this.y + this.side > HEIGHT){
                this.y = HEIGHT - this.side;
                this.vy *= -1;
            } else if(this.y - this.side < 0){
                this.y = this.side;
                this.vy *= -1;
            }
        }

        this.draw = function(){
            ctx.fillStyle = 'white';
            ctx.fillRect(this.x, this.y, this.side, this.side);
        }
    }

    function main(){
        canvas = document.createElement("canvas");
        canvas.width = WIDTH;
        canvas.height = HEIGHT;
        document.body.appendChild(canvas);
        ctx = canvas.getContext("2d");

        document.addEventListener('keydown', function(e){
            if(e.keyCode === UP || e.keyCode === DOWN){
                controls[e.keyCode] = true;
            }
        }, false);

        document.addEventListener('keyup', function(e){
            if(e.keyCode === UP || e.keyCode === DOWN){
                delete controls[e.keyCode];
            }
        }, false);

        init();

        loop();
    }

    function init(){
        player = new Player();
        player.x = paddleWidth;

        ai = new AI();
        ai.x = WIDTH - paddleWidth - ai.width;

        ball = new Ball();
    }

    function loop(){
        ctx.clearRect(0, 0, WIDTH, HEIGHT);

        ctx.fillRect((WIDTH - 5)/2, 0, 5, HEIGHT);
        ctx.fillRect(0, 0, WIDTH, 5);
        ctx.fillRect(0, HEIGHT - 5, WIDTH, 5);

        ctx.fillStyle = "white";
        ctx.strokeStyle = "white";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.font = 'bold 40pt VectorFont';
        ctx.strokeText(""+score[0], 190, 20);
        ctx.strokeText(""+score[1], 310, 20);



        update();

        checkCollisions(ball, ball.vx < 0 ? player : ai);

        window.requestAnimationFrame(loop);
    }

    function update(){
        player.draw();
        ai.draw();
        ball.draw();

        player.update();
        ball.update();
        ai.update();
    }

    function checkCollisions(ball, paddle){
        if(ball.x < paddle.x + paddle.width && ball.y < paddle.y + paddle.height && paddle.x < ball.x + ball.side && paddle.y < ball.y + ball.side){
            var normal = (ball.y + ball.side - paddle.y)/(ball.side + paddle.height);
            var angle = Math.PI/4 * (2 * normal - 1);
            ball.vx = (paddle === player ? 1 : -1) * ballMaxSpeed * Math.cos(angle);
            ball.vy = ballMaxSpeed * Math.sin(angle);
        }
    }

    main();
}());
