EnemyTank = function (index, game, player, bullets) {

    var x = game.world.randomX;
    var y = game.world.randomY;

    this.game = game;
    this.health = 3;
    this.player = player;
    this.bullets = bullets;
    this.fireRate = 1000;
    this.nextFire = 0;
    this.alive = true;

    this.shadow = game.add.sprite(x, y, 'enemy', 'shadow');
    this.tank = game.add.sprite(x, y, 'enemy', 'tank1');
    this.turret = game.add.sprite(x, y, 'enemy', 'turret');

    this.shadow.anchor.set(0.5);
    this.tank.anchor.set(0.5);
    this.turret.anchor.set(0.3, 0.5);

    this.tank.name = index.toString();
    game.physics.enable(this.tank, Phaser.Physics.ARCADE);
    this.tank.body.immovable = false;
    this.tank.body.collideWorldBounds = true;
    this.tank.body.bounce.setTo(1, 1);

    this.tank.angle = game.rnd.angle();

    game.physics.arcade.velocityFromRotation(this.tank.rotation, 100, this.tank.body.velocity);

};


EnemyTank.prototype.damage = function() {

    this.health -= 1;

    if (this.health <= 0)
    {
        this.alive = false;

        this.shadow.kill();
        this.tank.kill();
        this.turret.kill();

        return true;
    }

    return false;

}


var game = new Phaser.Game(1000, 800, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

function preload() {

//load the images
    game.load.image('hero', 'assets/sprites/car.png');
    game.load.image('road', 'assets/backgrounds/A-road.jpg');
    //game.load.image('cars', 'assets/sprites/car.png');
    game.load.spritesheet('innocent', 'assets/sprites/innocent.png', 50, 69);
    
    
    game.load.image('bullet', 'assets/games/tanks/bullet.png');
    game.load.image('kaboom', 'assets/games/tanks/innocent.png');
    game.load.image('enemy', 'assets/sprites/car.png');

}

var land;
var hero;
var currentSpeed = 0;
var cursors;
var group;
var innocent;
var innocentsLeft = 0;
var text;





    var style = { font: "65px Arial", fill: "#ff0044", align: "center" };
function create() {
//  Resize our game world to be a 2000 x 2000 square
    game.world.setBounds(-1000, -1000, 2000, 2000);
    
   
    
    //  Our tiled scrolling background
    land = game.add.tileSprite(0, 0, 1000, 800, 'road');
    land.fixedToCamera = true;
    
    
    //add group and enable the physics
    group = game.add.group();
    group.enableBody = true;
    group.physicsBodyType = Phaser.Physics.ARCADE;
    
    
    
    
    //  To make the sprite move we need to enable Arcade Physics
    game.physics.startSystem(Phaser.Physics.ARCADE);

    
    
    hero = game.add.sprite(game.world.centerX, game.world.centerY, 'hero');
    hero.anchor.set(0.5);
    
     //  This will force it to decelerate and limit its speed
    game.physics.enable(hero, Phaser.Physics.ARCADE);
    hero.body.drag.set(0.2);
    hero.body.maxVelocity.setTo(400, 400);
    hero.body.collideWorldBounds = true;

    //  And enable the Sprite to have a physics body:
    game.physics.arcade.enable(hero);
    hero.bringToTop();
    //make the camera follow the sprite
    game.camera.follow(hero);
    game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);
    game.camera.focusOnXY(0, 0);
    
    
    
    
    
    
   for (var i = 0; i < 20; i++)
    {
        //  Here we'll create some chillis which the player can pick-up. They are still part of the same Group.
        
        //c.name = 'innocent' + i;
        //var c = game.add.sprite(game.rnd.integerInRange(0, 2000), game.rnd.integerInRange(0, 2000), 'innocent', 17);
        var c = group.create(game.rnd.integerInRange(-1000, 1000), game.rnd.integerInRange(-1000, 1000), 'innocent', 17);
        c.name='innocent'+i;
        c.body.immovable = true;
        c.animations.add('wave');
        c.animations.play('wave', 10, true);
        innocentsLeft++;
        
    }
    
    
   // innocent = game.add.sprite(400, 400, 'innocent');
    //innocent.animations.add('wave');
    //innocent.animations.play('wave', 10, true);


    
    
    //enable cursors into the keyboard functions

    
    cursors = game.input.keyboard.createCursorKeys();

}

function update () {

  
    
    game.physics.arcade.collide(hero, group, collisionHandler, null, this);
    game.physics.arcade.collide(group, group);

    hero.body.velocity.x = 0;
    hero.body.velocity.y = 0;

    
     if (cursors.left.isDown)
    {
        hero.angle -= 4;
    }
    else if (cursors.right.isDown)
    {
        hero.angle += 4;
    }

    if (cursors.up.isDown)
    {
        //  The speed we'll travel at
        currentSpeed = 500;
    }
    else
    {
        if (currentSpeed > 0)
        {
            currentSpeed -= 4;
        }
    }

    if (currentSpeed > 0)
    {
        game.physics.arcade.velocityFromRotation(hero.rotation, currentSpeed, hero.body.velocity);
    }

    land.tilePosition.x = -game.camera.x;
    land.tilePosition.y = -game.camera.y;
    
      
    
        
    
}

function collisionHandler (player, veg) {

    //  If the player collides with the chillis then they get eaten :)
    //  The chilli frame ID is 17

    if (veg.frame == 17)
    {
        veg.kill();
        updateText();
        
    }
}

function updateText() {

    innocentsLeft--;

   // text.setText("- There are -\n" + innocentsLeft + " survivors left !");

}

function render () {

	//game.debug.inputInfo(32, 32);
    game.debug.text("" + innocentsLeft + " survivors left !", 32, 32);
    
    if(innocentsLeft == 0)
    {
        game.debug.text("You Win", 32, 50);
    }

}