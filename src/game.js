var game = new Phaser.Game(1000, 800, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });
var level = 1;
function preload() {

//load the images
    //game.load.image('hero', 'assets/sprites/bus.png');
    game.load.image('road', 'assets/backgrounds/A-road.jpg');
        
    
    game.load.spritesheet('innocent', 'assets/sprites/swordguy.png', 48, 32);
    game.load.spritesheet('ibutton', 'assets/buttons/ibutton.png', 262, 62);
    game.load.spritesheet('button', 'assets/buttons/startButton.png', 264, 80);
    game.load.spritesheet('hero', 'assets/sprites/links.png', 80, 40);
    game.load.spritesheet('minion', 'assets/sprites/zombieChick.png', 90, 69);
    game.load.spritesheet('minion2', 'assets/sprites/zombieDudes.png', 90, 93);
    game.load.spritesheet('angels', 'assets/sprites/cheer.png', 65, 100);
    game.load.spritesheet('boss', 'assets/sprites/Zombie.png', 158, 255);
    game.load.audio('theme', ['assets/audio/theme.mp3', 'assets/audio/theme.ogg']);
    game.load.audio('heroDieAudio', ['assets/audio/heroDie.mp3', 'assets/audio/heroDie.ogg']);
    game.load.audio('zombieDieGirl', ['assets/audio/zombieDieGirl.mp3', 'assets/audio/zombieDieGirl.ogg']);
    game.load.audio('zombieDieGuy', ['assets/audio/zombieDieGuy.mp3', 'assets/audio/zombieDieGuy.ogg']);
    game.load.audio('initialize', ['assets/audio/initialize.mp3', 'assets/audio/initialize.ogg']);
    game.load.audio('zombieSound', ['assets/audio/zombieSound.mp3', 'assets/audio/zombieSound.ogg']);
    game.load.audio('savior', ['assets/audio/savior.mp3', 'assets/audio/savior.ogg']);
    game.load.audio('cheer', ['assets/audio/cheer.mp3', 'assets/audio/cheer.ogg']);
    game.load.audio('pickup', ['assets/audio/pickup.mp3', 'assets/audio/pickup.ogg']);
    game.load.image('menu', 'assets/sprites/hero.png');
    game.load.image('healthPack', 'assets/powerups/healthPack.png');
    game.load.image('armour', 'assets/powerups/armour.png');
    game.load.image('pauseMenu', 'assets/menus/pauseMenu.png');
    game.load.spritesheet('zombieDie', 'assets/sprites/zombieDying.png', 100, 100);
    
}
var upKey;
var downKey;
var leftKey;
var rightKey;
var pauseButton;

    

//declare all variables
var pickup;
var cheer
var healthPack;
var armour;
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
var angels;

//sound
var music;
var heroDie;
var zombieDieGirl;
var zombieDieGuy;
var initialize;
var savior;
var zombieSound;


var button;
var ibutton;


var time = 0;
var timer;
var timer2;
var play = 0;
var pause_label;
//dying animation variables
var die;
var numberOfBaddies = 5;
var numberOfBaddies2 = 0;
var numberOfBosses = 0;

var score = 0;



    
function create() {
    pauseButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    
    //play theme music
    timer = game.time.create(false);
    timer2 = game.time.create(false);
    music = game.add.audio('theme');
    music.volume=0.3;
    
    zombieDieGuy = game.add.audio('zombieDieGuy');
    cheer = game.add.audio('cheer');
    cheer.volume = 0.2;
    pickup = game.add.audio('pickup');
    initialize = game.add.audio('initialize');
    initialize.volume=1.0;
    heroDie = game.add.audio('heroDieAudio');
    zombieDieGirl = game.add.audio('zombieDieGirl');
    savior = game.add.audio('savior');
    savior.volume=1.0;
    zombieSound = game.add.audio('zombieSound');
    zombieSound.volume = 0.1;
    zombieSound.play();
    
    
    
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

    for (var i = 0; i < numberOfBaddies; i++)
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
    
    for (var i = 0; i < numberOfBaddies2; i++)
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
   boss.body.collideWorldBounds = true;
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
    
    
   button = group.create(game.world.centerX/2, 300, 'button', 40);
   button.anchor.setTo(0.5, 0.5);
   button.enablebody = true;
    button.body.collideWorldBounds = true;
        button.body.immovable = true;
    
    
    iButton = group.create(game.world.centerX/2, 500, 'ibutton', 45);
   iButton.anchor.setTo(0.5, 0.5);
   iButton.enablebody = true;
        iButton.body.immovable = true;
    iButton.body.collideWorldBounds = true;
    
    for(var i = 0; i<1; i++){
        
        setTimeout(function(){ createHealth(); }, game.rnd.integerInRange(10000, 100000));
           
    }
    function createHealth(){
    healthPack = group.create(game.rnd.integerInRange(-1000, 1000), game.rnd.integerInRange(-1000, 1000), 'healthPack', 70);
           healthPack.anchor.setTo(0.5, 0.5);
           healthPack.enablebody = true;
           healthPack.body.collideWorldBounds = true;
        healthPack.body.immovable = true;
    }
    
    for(var i = 0; i<1; i++){
        
        setTimeout(function(){ createArmour(); }, game.rnd.integerInRange(10000, 100000));
           
    }
    function createArmour(){
    armour = group.create(game.rnd.integerInRange(-1000, 1000), game.rnd.integerInRange(-1000, 1000), 'armour', 80);
           armour.anchor.setTo(0.5, 0.5);
           armour.enablebody = true;
           armour.body.collideWorldBounds = true;
        armour.body.immovable = true;
    }
   for (var i = 0; i < 10; i++)
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
    for (var i = 0; i < 10; i++)
    {
        
        var angel = group.create(game.rnd.integerInRange(-1000, 1000), game.rnd.integerInRange(-1000, 1000), 'angels', 18);
        angel.name='angel'+i;
        
        angel.body.immovable = true;
        angel.animations.add('walk');
        angel.animations.play('walk', game.rnd.integerInRange(5, 10), true);
        innocentsLeft++;
    }
    




    
    
    //enable cursors into the keyboard functions

    
    cursors = game.input.keyboard.createCursorKeys();
    
    
 

    /*
        Code for the pause menu
    */
    
    
    // Create a label to use as a button
    var pause_label = game.add.text(0, 0, "Pause", { font: "32px Arial", fill: "#ffffff", align: "center" });
    
    pause_label.fixedToCamera = true;
    pause_label.cameraOffset.setTo(875, 20);
    pause_label.inputEnabled = true;
    pause_label.events.onInputUp.add(function () {
        // When the pause button is pressed, we pause the game
        game.paused = true;

        
    });

    // Add a input listener that can help us return from being paused
    game.input.onDown.add(unpause, self);

    // And finally the method that handels the pause menu
    function unpause(event){
        // Only act if paused
        if(game.paused){
            game.paused = 'false';
        }
            
    };
   
}

function update () {
   if(health<=0){
       health = 0;
       var text = "YOU HAVE DIED, Click Space to Restart";
    var style = { font: "40px Cursive", fill: "black", align: "center" };
       var text2 = "Your Score: " + score ;
   

    var x = game.add.text(0, 0, text, style);
       x.anchor.setTo(0.5, 0.5);
        x.fixedToCamera = true;
        x.cameraOffset.setTo(480, 400);
       var y = game.add.text(0, 0, text2, style);
       y.anchor.setTo(0.5, 0.5);
        y.fixedToCamera = true;
        y.cameraOffset.setTo(480, 500);
       
       
   }
  if(pauseButton.isDown){
      location.href='';
  }
  
    game.physics.arcade.collide(hero, group, collisionHandler, null, this);
    
    game.physics.arcade.collide(group, group);
    
    //set the hero's speed to 0 initially
    hero.body.velocity.x = 0;
    hero.body.velocity.y = 0;
    
//change direction and speed of the hero
    
     if (leftKey.isDown)
    {
        hero.angle -= 4;
    }
    else if (rightKey.isDown)
    {
        hero.angle += 4;
    }

    if (upKey.isDown)
    {
        //  The speed we'll travel at
        currentSpeed = 300;
        
        hero.animations.play('move', 5, true);
         
    }else if(downKey.isDown){
        currentSpeed = 0;
        
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
    
    
   
    
}
function collisionHandler (player, veg) {

    //  If the player collides with the innocents then they get eaten :)
    //  The Innocents frame ID is 17
            
    if (veg.frame == 17)
    {
         if (play == 1)
        {
            
           savior.play();
           veg.kill();
           innocentsLeft--;
            score = score + 25;
        }
        
    }
    else if(veg.frame == 18)
    {
         if (play == 1)
        {
            
           cheer.play();
           veg.kill();
           innocentsLeft--;
            score = score + 25;
        }
        
    }
    else if(veg.frame == 30)
    {
         if (play == 1)
        {
            player.kill();
            health -= 100;
            if(health>0)
            {
            player.revive();
            }
            veg.kill();
        }
        
        
    }
    else if(veg.frame == 20)
    {
         if (play == 1)
        {
            
            die = game.add.sprite(veg.x, veg.y, 'zombieDie', 5);
            
            die.animations.add('die');
            
            die.animations.play('die', 15, true);
            setTimeout(function(){ die.animations.stop('die', 5, true); die.kill(); }, 800);
            //play the zombie dying sound
            zombieDieGirl.play();
            
            
            player.kill();
            health -= 5;
            if(health>0)
            {
            player.revive();
            }
            veg.kill();
            
            
        }
    }
    else if(veg.frame == 25)
    {
        if (play == 1)
        {
            //play the zombie dying sound
            zombieDieGuy.play();
            die = game.add.sprite(veg.x, veg.y, 'zombieDie', 5);
            die.animations.add('die');
            die.animations.play('die', 15, true);
            setTimeout(function(){ die.animations.stop('die', 15, true); }, 3000);
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
        initialize.play();
        music.play();
        
        button.animations.add('clicked');
        button.animations.play('clicked', 5, true);
        
        play = 1;
        setTimeout(function(){ button.animations.stop('click', 5, true); 
                             button.kill();
                              iButton.kill();
                             }, 1000);
    }
    else if(veg.frame == 45){
        initialize.play();
        
        iButton.animations.add('click');
        iButton.animations.play('click', 5, true);
        iButton.enablebody = true;
        iButton.body.immovable = true;
        setTimeout(function(){ iButton.animations.stop('click', 5, true); }, 1000);
        
        var t = game.add.sprite(0, 0, 'pauseMenu');
        t.anchor.setTo(0.5, 0.5);
        t.fixedToCamera = true;
        t.cameraOffset.setTo(480, 400);
        setTimeout(function(){ t.kill() }, 5000);
        
       
    }
    else if(veg.frame == 70){
        if(play==1){
        health = 100;
        veg.kill();
            pickup.play();
        }
    }
    else if(veg.frame == 80){
        if(play == 1){
        health = 150;
        veg.kill();
            pickup.play();
        }
    }
  
    if(health<=0){
        heroDie.play();
    }
    
    if(innocentsLeft == 0) {
        level++;
        numberOfBaddies2 = numberOfBaddies2 + 2;
        health = 100;
        numberOfBaddies = numberOfBaddies + 2;
        innocentsLeft = 0;
        preload();
        create();
        iButton.kill();
        button.kill();
        
    }
}




function animationLooped(sprite, animation) {

    if (animation.loopCount === 1)
    {
        loopText = game.add.text(32, 64, 'Animation looped', { fill: 'white' });
    }
    else
    {
        loopText.text = 'Animation looped x2';
        animation.loop = false;
    }

}

function render () {

	//game.debug.inputInfo(32, 32);
    game.debug.text("" + innocentsLeft + " survivors left !", 32, 32);
    game.debug.text("HEALTH: " + health+"%" , 32, 50);
    game.debug.text("Level: "+level, 32, 70);
    game.debug.text("Score: "+score, 32, 90);
    
   
}