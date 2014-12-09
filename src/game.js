var game = new Phaser.Game(1000, 800, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

function preload() {

//load the images
    game.load.image('hero', 'assets/sprites/bus.png');
    game.load.image('road', 'assets/backgrounds/A-road.jpg');
    game.load.spritesheet('innocent', 'assets/sprites/innocent.png', 50, 69);
    game.load.image('minion', 'assets/sprites/minion.png');
    game.load.spritesheet('boss', 'assets/sprites/Zombie.png', 158, 255);
}

var boss;
var land;
var hero;
var currentSpeed = 0;
var cursors;
var group;
var innocent;
var innocentsLeft = 0;
var zombiesLeft = 0;
var minions;





    var style = { font: "65px Arial", fill: "#ff0044", align: "center" };
function create() {
//  Resize our game world to be a 2000 x 2000 square
    game.world.setBounds(-1000, -1000, 2000, 2000);
    
   
    
    //  Our tiled scrolling background
    land = game.add.tileSprite(0, 0, 1000, 800, 'road');
    land.fixedToCamera = true;
    
    
   
   
    
 /*   for (var counter = 0; counter < 20; counter++)
    {
        //  Here we'll create some zombies which the player can pick-up. They are still part of the same Group.
        
        
        var c = group.create(game.rnd.integerInRange(-1000, 1000), game.rnd.integerInRange(-1000, 1000), 'tank');
        //c.name='tank'+counter;
       // c.body.immovable = true;
        //c.animations.add('move');
        //c.animations.play('move', 10, true);
        zombiesLeft++;
        
    }*/
    
    
    
    
    
    //add group and enable the physics
    group = game.add.group();
    group.enableBody = true;
    group.physicsBodyType = Phaser.Physics.ARCADE;
    
    
    
    
    //  To make the sprite move we need to enable Arcade Physics
    game.physics.startSystem(Phaser.Physics.ARCADE);

    
    minions = game.add.group();
    minions.enableBody = true;

    for (var i = 0; i < 10; i++)
    {
        //var minion = minions.create(game.world.randomX, game.world.randomY, 'minion');
        var minion = group.create(game.rnd.integerInRange(-1000, 1000), game.rnd.integerInRange(-1000, 1000), 'minion', 21);
        minion.name='innocent'+i;
        minion.body.velocity.set(200, 200);
        minion.body.bounce.set(1, 1);
        minion.body.collideWorldBounds = true;
        //var c = group.create(game.rnd.integerInRange(-1000, 1000), game.rnd.integerInRange(-1000, 1000), 'innocent', 17);
    }
    
    
    
    //add the hero and add the anchor to half of the hero's height and weight
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
    game.camera.deadzone = new Phaser.Rectangle(400, 200, 500, 300);
    game.camera.focusOnXY(0, 0);
    
    
    
    
    
    
   for (var i = 0; i < 20; i++)
    {
        //  Here we'll create some chillis which the player can pick-up. They are still part of the same Group.
        
        
        //var c = game.add.sprite(game.rnd.integerInRange(0, 2000), game.rnd.integerInRange(0, 2000), 'innocent', 17);
        var c = group.create(game.rnd.integerInRange(-1000, 1000), game.rnd.integerInRange(-1000, 1000), 'innocent', 17);
        c.name='innocent'+i;
        c.body.immovable = true;
        c.animations.add('wave');
        c.animations.play('wave', 10, true);
        innocentsLeft++;
        
    }
    
    //  The boss
   boss = group.create(game.rnd.integerInRange(-1000, 1000), game.rnd.integerInRange(-1000, 1000), 'boss', 20);
   boss.anchor.setTo(0.5, 0.5);
   boss.enablebody = true;
   boss.animations.add('move');
   boss.animations.play('move', 5, true);



    
    
    //enable cursors into the keyboard functions

    
    cursors = game.input.keyboard.createCursorKeys();

}

function update () {
   
  
    
    game.physics.arcade.collide(hero, group, collisionHandler, null, this);
    
    game.physics.arcade.collide(group, group);
    
    //set the hero's speed to 0 initially
    hero.body.velocity.x = 0;
    hero.body.velocity.y = 0;
    
//change direction and speed of the hero
    
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
        currentSpeed = 400;
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
    
    
    /*if (game.input.mousePointer.isDown)
    {
        //  First is the callback
        //  Second is the context in which the callback runs, in this case game.physics.arcade
        //  Third is the parameter the callback expects - it is always sent the Group child as the first parameter
        minions.forEach(game.physics.arcade.moveToPointer, game.physics.arcade, false, 200);
    }
    else
    {
        minions.setAll('body.velocity.x', 0);
        minions.setAll('body.velocity.y', 0);
    }*/
   // minions = group.create(game.rnd.integerInRange(-1000, 1000), game.rnd.integerInRange(-1000, 1000), 'minion', 30);
    minions.forEach(game.physics.arcade.moveToPointer, game.physics.arcade, false, 100);

    
    
    
}

function collisionHandler (player, veg) {

    //  If the player collides with the chillis then they get eaten :)
    //  The Innocents frame ID is 17

    if (veg.frame == 17)
    {
        veg.kill();
        updateText();
        
    }
    else if(veg.frame = 20)
    {
        player.kill();
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