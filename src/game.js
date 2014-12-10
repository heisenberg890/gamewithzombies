var game = new Phaser.Game(1000, 800, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

function preload() {

//load the images
    //game.load.image('hero', 'assets/sprites/bus.png');
    game.load.image('road', 'assets/backgrounds/A-road.jpg');
    game.load.spritesheet('innocent', 'assets/sprites/innocent.png', 50, 70);
    game.load.spritesheet('button', 'assets/buttons/startButton.png', 264, 80);
    game.load.spritesheet('hero', 'assets/sprites/links.png', 80, 40);
    game.load.spritesheet('minion', 'assets/sprites/zombieChick.png', 90, 69);
    game.load.spritesheet('minion2', 'assets/sprites/zombieDudes.png', 90, 93);
    game.load.spritesheet('boss', 'assets/sprites/Zombie.png', 158, 255);
    game.load.audio('theme', ['assets/audio/theme.mp3', 'assets/audio/theme.ogg']);
    
}


//declare all variables
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
var minions2;
var health = 100;
var music;
var button;
var time = 0;
var timer;
var play = 0;





    
function create() {
    //play theme music
    timer = game.time.create(false);
    music = game.add.audio('theme');

    music.play();
    
    
    //Resize our game world to be a 2000 x 2000 square
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

    
    //add the minions to the collision group
    
    
    minions = game.add.group();
    minions.enableBody = true;

    for (var i = 0; i < 10; i++)
    {
        //var minion = minions.create(game.world.randomX, game.world.randomY, 'minion');
        var minion = group.create(game.rnd.integerInRange(-1000, 1000), game.rnd.integerInRange(-1000, 1000), 'minion', 20);
        minion.name='minion'+i;
        minion.body.velocity.set(game.rnd.integerInRange(10, 200), game.rnd.integerInRange(10, 200));
        minion.body.bounce.set(1, 1);
        minion.body.collideWorldBounds = true;
        minion.animations.add('walk');
        minion.animations.play('walk', 5, true);
    }
    
   minions2 = game.add.group();
    minions2.enableBody = true;
    
    for (var i = 0; i < 10; i++)
    {
        //var minion = minions.create(game.world.randomX, game.world.randomY, 'minion');
        var minion2 = group.create(game.rnd.integerInRange(-1000, 1000), game.rnd.integerInRange(-1000, 1000), 'minion2', 25);
        minion2.name='minion'+i;
        minion2.body.velocity.set(game.rnd.integerInRange(10, 200), game.rnd.integerInRange(10, 200));
        minion2.body.bounce.set(1, 1);
        minion2.body.collideWorldBounds = true;
        minion2.animations.add('walk');
        minion2.animations.play('walk', 5, true);
    }
    
    
    //add the boss minion
    
   boss = group.create(game.rnd.integerInRange(-1000, 1000), game.rnd.integerInRange(-1000, 1000), 'boss', 30);
   boss.anchor.setTo(0.5, 0.5);
   boss.enablebody = true;
   boss.animations.add('move');
   boss.animations.play('move', 5, true);
    
    
    //add the hero and add the anchor to half of the hero's height and weight
    hero = game.add.sprite(game.world.centerX/2, game.world.centerY, 'hero');
    hero.anchor.set(0.5);
    
     //  This will force it to decelerate and limit its speed
    game.physics.enable(hero, Phaser.Physics.ARCADE);
    hero.body.drag.set(0.2);
    hero.body.maxVelocity.setTo(400, 400);
    hero.body.collideWorldBounds = true;
    hero.animations.add('move');
    
    //  And enable the Sprite to have a physics body:
    game.physics.arcade.enable(hero);
    hero.bringToTop();
    
    //make the camera follow the sprite
    game.camera.follow(hero);
    //game.camera.deadzone = new Phaser.Rectangle(400, 200, 200, 300);
    //game.camera.focusOnXY(0, 0);
    
    
   button = group.create(game.world.centerX/3, 300, 'button', 40);
   button.anchor.setTo(0.5, 0.5);
   button.enablebody = true;
    
    
   for (var i = 0; i < 50; i++)
    {
        
        //make the innocent people to be picked up and add animation
        var c = group.create(game.rnd.integerInRange(-1000, 1000), game.rnd.integerInRange(-1000, 1000), 'innocent', 17);
        c.name='innocent'+i;
        c.body.immovable = true;
        c.animations.add('wave');
        c.anchor.setTo(0.5, 0.5);
        c.animations.play('wave', game.rnd.integerInRange(1, 20), true);
        innocentsLeft++;
        
    }
    




    
    
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
        
        hero.animations.play('move', 5, true);
         
    }
    else
    {
        if (currentSpeed > 0)
        {
            currentSpeed -= 10;
            
        }
        hero.animations.stop('move', 5, true);
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
    //minions2.forEach(game.physics.arcade.moveToPointer, game.physics.arcade, false, 100);

    
    
    
}

function collisionHandler (player, veg) {

    //  If the player collides with the chillis then they get eaten :)
    //  The Innocents frame ID is 17

    if (veg.frame == 17)
    {
         if (play == 1)
        {
            veg.kill();
            innocentsLeft--;
        }
        
    }
    else if(veg.frame == 30)
    {
         if (play == 1)
        {
            player.kill();
            health = 0;
        }
        
        
    }
    else if(veg.frame == 20)
    {
         if (play == 1)
        {
            veg.kill();
            player.kill();
            health -= 5;
            if(health>0)
            {
            player.revive();
            }
        }
    }
    else if(veg.frame == 25)
    {
        if (play == 1)
        {
            veg.kill();
            player.kill();
            health -= 10;
            if(health>0)
            {
            player.revive();
            }
        }
    }
    else if(veg.frame == 40){
        timer.start();
        timer.loop(1000, timedEvent, this);
        if(time<=9){
        button.animations.add('clicked');
        button.animations.play('clicked', 5, true);
        play = 1;
        }
       
    }
    
}
//timer function to add to time
function timedEvent(){
    
        
    time++;
    if(time<=5){
        button.animations.stop('clicked', 5, true);
        button.kill();
    }
    
}
function menu(){
    
}

function render () {

	//game.debug.inputInfo(32, 32);
    game.debug.text("" + innocentsLeft + " survivors left !", 32, 32);
    game.debug.text("HEALTH: " + health+"%" , 32, 50);
    
    if(innocentsLeft == 0)
    {
        game.debug.text("You Win", 32, 70);
    }

}