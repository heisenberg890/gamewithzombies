/*

File Name: game.js
Author: Robin Calamatta
Last Modified by: Robin Calamatta
Date Last Modified: DEC 10, 2014
Description: This is the main javascript file, this starts by loading the canvas, then all of the assets, such as audio and sprites/spritesheets.
            All of the variables are defined for the game which are used throughout the game. The game consists of a human player who wanders around avoiding 
            enemies, there are three types of enemies, one which, if touched, deals 5 damage. One which, if touched deals 10 damage, and then one which deals                   100 damage. The player's objective is to collect all of the surviving sprites on the map while avoiding the threats. there are two powerups for health  
            , one is a health pack and one is a armour, giving 100 and 150 health. The player can check instructions by walking into the instructions button or                 start the game in the same way. All of the player stats are displayed in the top left corner and when the player dies he is granted the ability to reset             the game by pressing the space bar.

*/


var game = new Phaser.Game(1000, 800, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });
var level = 1;

//preloading all of the assets
function preload() {

//load the images
    //game.load.image('hero', 'assets/sprites/bus.png');
    game.load.image('road', 'assets/backgrounds/A-road.jpg');
    game.load.image('road2', 'assets/backgrounds/grass.jpg');
    game.load.spritesheet('innocent', 'assets/sprites/swordguy.png', 48, 32);
    game.load.spritesheet('ibutton', 'assets/buttons/iButton.png', 262, 62);
    game.load.spritesheet('button', 'assets/buttons/startButton.png', 264, 80);
    game.load.spritesheet('hero', 'assets/sprites/mainHero.png', 72, 32);
    game.load.spritesheet('minion', 'assets/sprites/zombieChicker.png', 65, 37);
    game.load.spritesheet('minion2', 'assets/sprites/zombieduder.png', 65, 22);
    game.load.spritesheet('angels', 'assets/sprites/cheer.png', 65, 100);
    game.load.spritesheet('boss', 'assets/sprites/bossZomb.png', 208, 130);
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
    game.load.spritesheet('zombieGuyDie', 'assets/sprites/zombieGuyDying.png', 100, 100);
    game.load.spritesheet('bossDie', 'assets/sprites/bossDying.png', 200, 200);
    game.load.image('bullet', 'assets/sprites/bullet.png');
    game.load.audio('bulletSound', ['assets/audio/gun.mp3', 'assets/audio/gun.ogg']);
    
}
//declare the arrow keys
var upKey;
var downKey;
var leftKey;
var rightKey;
var restartButton;
var fullScreen = 0;

var bullets;
var nextFire = 0;
var fireRate = 100;
var bulletSound;

//declare all variables
var zombieHealth = 100;
var zombie2Health = 100;
var bossHealth = 100;
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
var minion = [];
var minion2 = [];
var lives = 5;
var angels;
var ghouliesLeft;

//sound
var music;
var heroDie;
var zombieDieGirl;
var zombieDieGuy;
var initialize;
var savior;
var zombieSound;
var highScore = 0;

var button;
var iButton;



var play = 0;
var pause_label;
var fullScreen_label;
//dying animation variables
var die;
var bossDie;

var numberOfBaddies = 5;
var numberOfBaddies2 = 1;
var numberOfBosses = 0;

var score = 0;

var baddies;


//gun stuff
var multiGunPowerUp = 0;

    //create the game
function create() {
    //game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
    //game.input.onDown.add(gofull, this);
    
    restartButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    upKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
    downKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
    leftKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
    rightKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
    
    
    
    //play theme music
    music = game.add.audio('theme',1,true);
    music.volume=0.3;
    
    //add all of the audio files to the game
    zombieDieGuy = game.add.audio('zombieDieGuy');
    bulletSound = game.add.audio('bulletSound');
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
    
    //play the zombie sounds
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
    
    //minions = game.add.group();
    //minions.enableBody = true;

    
    
    
   
    
    
    //add the boss minion
    
   boss = group.create(game.rnd.integerInRange(-900, 900), game.rnd.integerInRange(-900, 900), 'boss', 30);
   boss.anchor.setTo(0.5, 0.5);
   boss.enablebody = true;
   boss.body.collideWorldBounds = true;
    boss.body.immovable = 'true';
    //boss.body.velocity.set(game.rnd.integerInRange(10, 200), game.rnd.integerInRange(10, 200));
        //boss.body.bounce.set(1, 1);
   boss.animations.add('move');
   boss.animations.play('move', 10, true);
    

    //  Our bullet group
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(50, 'bullet', 0, false);
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 0.5);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);
    
    
    
    
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
    
    
    //add the start button
   button = group.create(game.world.centerX/2, 300, 'button', 40);
   button.anchor.setTo(0.5, 0.5);
   button.enablebody = true;
    button.body.collideWorldBounds = true;
        button.body.immovable = true;
    
    //add the instructions button
    iButton = group.create(game.world.centerX/2, 500, 'ibutton', 45);
   iButton.anchor.setTo(0.5, 0.5);
   iButton.enablebody = true;
        iButton.body.immovable = true;
    iButton.body.collideWorldBounds = true;
    
    //randomly place one health pack at a random time
    for(var i = 0; i<1; i++){
        
        setTimeout(function(){ createHealth(); }, game.rnd.integerInRange(10000, 100000));
           
    }
    
    //randomly place one health pack at a random time
    function createHealth(){
    healthPack = group.create(game.rnd.integerInRange(-1000, 1000), game.rnd.integerInRange(-1000, 1000), 'healthPack', 70);
           healthPack.anchor.setTo(0.5, 0.5);
           healthPack.enablebody = true;
           healthPack.body.collideWorldBounds = true;
        healthPack.body.immovable = true;
    }
    
    
    //randomly place one armour pack at a random time
    for(var i = 0; i<1; i++){
        
        setTimeout(function(){ createArmour(); }, game.rnd.integerInRange(10000, 100000));
           
    }
    
    //randomly place one armour pack at a random time
    function createArmour(){
    armour = group.create(game.rnd.integerInRange(-1000, 1000), game.rnd.integerInRange(-1000, 1000), 'armour', 80);
           armour.anchor.setTo(0.5, 0.5);
           armour.enablebody = true;
           armour.body.collideWorldBounds = true;
        armour.body.immovable = true;
    }
    
    
    //make the innocent people to be picked up and add animation
   for (var i = 0; i < 1; i++)
    {
        
        var c = group.create(game.rnd.integerInRange(-900, 900), game.rnd.integerInRange(-900, 900), 'innocent', 17);
        c.name='innocent'+i;
        c.body.immovable = true;
        c.animations.add('wave');
        c.anchor.setTo(0.5, 0.5);
        c.animations.play('wave', game.rnd.integerInRange(1, 20), true);
        innocentsLeft++;
        
    }
    
    //make the innocent people to be picked up and add animation
    for (var i = 0; i < 1; i++)
    {
        
        var angel = group.create(game.rnd.integerInRange(-900, 900), game.rnd.integerInRange(-900, 900), 'angels', 18);
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
    
    for (var i = 0; i < numberOfBaddies; i++)
    {
        //var minion = minions.create(game.world.randomX, game.world.randomY, 'minion');
        minion[i] = group.create(game.rnd.integerInRange(-900, 900), game.rnd.integerInRange(-900, 900), 'minion', 20);
        minion[i].name='minion'+i;
        
        //minion[i].body.velocity.set(game.rnd.integerInRange(10, 200), game.rnd.integerInRange(10, 200));
        //minion[i].body.bounce.set(1, 1);
        minion[i].body.collideWorldBounds = true;
        minion[i].animations.add('walk');
        minion[i].animations.play('walk', 10, true);
        //minion[i].body.immovable = 'true';
        
       
    }
    
     //add the minions to the collision group
   // minions2 = game.add.group();
    //minions2.enableBody = true;
    
    for (var i = 0; i < numberOfBaddies2; i++)
    {
        //var minion2 = minions.create(game.world.randomX, game.world.randomY, 'minion');
        minion2[i] = group.create(game.rnd.integerInRange(-900, 900), game.rnd.integerInRange(-900, 900), 'minion2', 25);
        minion2[i].name='minion2'+i;
        //minion2[i].body.velocity.set(game.rnd.integerInRange(10, 200), game.rnd.integerInRange(10, 200));
        //minion2[i].body.bounce.set(1, 1);
        //minion2[i].body.immovable = 'true';
        minion2[i].body.collideWorldBounds = true;
        minion2[i].animations.add('walk');
        minion2[i].animations.play('walk', 10, true);
        
    }
    
   
}

//start the update function, the game loop
function update () {
  if(play == 1){
    for(var i = 0; i<minion.length;i++){minion[i].rotation = this.game.physics.arcade.moveToObject(minion[i], hero, 100);}
    for(var i = 0; i<minion2.length;i++){minion2[i].rotation = this.game.physics.arcade.moveToObject(minion2[i], hero, 100);}
  
    
   boss.rotation = this.game.physics.arcade.moveToObject(boss, hero, 200);
  }
    
    if(bossHealth <=0){
    setTimeout(function(){ bossHealth = 100;}, 1000);
    }
    if(zombieHealth <=0){
    setTimeout(function(){ zombieHealth = 100;}, 1000);
    }
    if(zombie2Health <=0){
    setTimeout(function(){ zombie2Health = 100;}, 1000);
    }
    
    
    //do this if the player dies
   if(lives<=0){
       
       play = 0
       lives = 0;
       var text = "YOU HAVE DIED, Click Space to Restart";
        var style = { font: "40px Cursive", fill: "black", align: "center" };
       var text2 = "Your Score: " + score ;
       var text3 = "High Score: " + highScore ;
       hero.kill();
   

    var x = game.add.text(0, 0, text, style);
       x.anchor.setTo(0.5, 0.5);
        x.fixedToCamera = true;
        x.cameraOffset.setTo(480, 400);
       var y = game.add.text(0, 0, text2, style);
       y.anchor.setTo(0.5, 0.5);
        y.fixedToCamera = true;
        y.cameraOffset.setTo(480, 500);
       
       
       
   }
    //allow the user to restart with the space button if he is dead
  if(restartButton.isDown){
      
      if (play == 0) 
      {
    // Restart
          location.href='';
      } else 
      {
    // Do nothing!
    
      }
      
  }
  
    //add the hero to the collision handler
    game.physics.arcade.collide(hero, group, collisionHandler, null, this);
    game.physics.arcade.collide(bullets, group, collisionBulletHandler, null, this);
    game.physics.arcade.collide(group, group);
    
    //set the hero's speed to 0 initially
    hero.body.velocity.x = 0;
    hero.body.velocity.y = 0;
    
    //bullets
    if (game.input.activePointer.isDown)
    {
        //  Boom!
        fire();
       // minion.forEach(game.physics.arcade.moveToPointer, game.physics.arcade, false, 200);
       
        
    }
    
    
    hero.rotation = game.physics.arcade.angleToPointer(hero);
//change direction and speed of the hero
   
    
    
  
     if (leftKey.isDown)
    {
        hero.body.velocity.x = -350;
        hero.animations.play('move', 10, true);
    }
    else if (rightKey.isDown)
    {
       hero.body.velocity.x = 350;
        hero.animations.play('move', 10, true);
    }

    if (upKey.isDown)
    {
        hero.body.velocity.y = -350;
        
        hero.animations.play('move', 10, true);
         
    }else if(downKey.isDown){
        hero.body.velocity.y = 350;
        
        hero.animations.play('move', 10, true);
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

 function collisionBulletHandler (bullet, minion) {
     if(minion.frame == 30)
     {
         if(play==1){
             bossHealth = bossHealth - 5 ;
             if(bossHealth == 0){
                 
                 die = game.add.sprite(minion.x - 100, minion.y - 100, 'bossDie', 5);
            die.animations.add('die');
            die.animations.play('die', 10, true);
            setTimeout(function(){ die.animations.stop('die', 5, true); die.kill(); }, 800);
            //play the zombie dying sound
             minion.kill();
                 score = score + 100;
                 
             }
         }
         bullet.kill();
     }
     else if(minion.frame == 20)
     {
       
            
            zombieHealth = zombieHealth - 50;
            
            if(zombieHealth == 0)
            {
                 if(play==1)
                 {
                    die = game.add.sprite(minion.x, minion.y, 'zombieDie', 5);
                    die.animations.add('die');
                    die.animations.play('die', 15, true);
                    setTimeout(function(){ die.animations.stop('die', 5, true); die.kill(); }, 800);
                    //play the zombie dying sound
                    zombieDieGirl.play();
                     minion.kill();
                     zombieHealth = 100;
                     score = score + 20;
                 }
            }
         bullet.kill();
     }
     else if(minion.frame == 25)
     {
         zombie2Health = zombie2Health - 100;
            
            if(zombie2Health == 0)
            {
         if(play==1){
             //play the zombie dying sound
            zombieDieGuy.play();
            die = game.add.sprite(minion.x, minion.y, 'zombieGuyDie', 5);
            die.animations.add('die');
            die.animations.play('die', 15, true);
             minion.kill();
             zombie2Health = 100;
             score = score + 50;
         }
            }
         bullet.kill();
     }
     else if(minion.frame == 17)
     {
            bullet.kill();
     }
     else if(minion.frame == 18)
     {
             bullet.kill();
         
     }
     else
     {
         setTimeout(function(){ bullet.kill(); }, 10);
         
     }
 }
  
function collisionHandler (player, veg) {

    //  If the player collides with the innocents, they are saved
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
    //innocent angel id is 18
    else if(veg.frame == 18)
    {
         if (play == 1)
        {
            
           cheer.play();
           veg.kill();
           innocentsLeft--;
            score = score + 35;
        }
        
    }
    //boss id is 30
    else if(veg.frame == 30)
    {
         if (play == 1)
        {
            
            
            die = game.add.sprite(veg.x - 100, veg.y - 100, 'bossDie', 5);
            die.animations.add('die');
            die.animations.play('die', 10, true);
            setTimeout(function(){ die.animations.stop('die', 5, true); die.kill(); }, 800);
            //play the zombie dying sound
            
            
            player.kill();
            veg.kill();
            setTimeout(function(){ player.revive();}, 2000);
            lives--;
            multiGunPowerUp = 0;
            play = 0;
            setTimeout(function(){ play = 1}, 10000);
        }
        
        
    }
    //zombie girl ID is 20
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
            veg.kill();
            setTimeout(function(){ player.revive();}, 2000);
            lives--;
            multiGunPowerUp = 0;
            play = 0;
            setTimeout(function(){ play = 1}, 10000);
            
        }
    }
    
    //zombie guys ID is 25
    else if(veg.frame == 25)
    {
        if (play == 1)
        {
            //play the zombie dying sound
            zombieDieGuy.play();
            die = game.add.sprite(veg.x, veg.y, 'zombieGuyDie', 5);
            die.animations.add('die');
            die.animations.play('die', 15, true);
            setTimeout(function(){ die.animations.stop('die', 15, true); }, 3000);
            veg.kill();
            player.kill();
            multiGunPowerUp = 0;
            
            setTimeout(function(){ player.revive();}, 2000);
            lives--;
            play = 0;
            setTimeout(function(){ play = 1}, 10000);
        }
    }
    
    //start button's id is 40
    else if(veg.frame == 40){
        initialize.play();
        music.play('',0,1,true);
        
        button.animations.add('clicked');
        button.animations.play('clicked', 5, true);
        
        play = 1;
        setTimeout(function(){ button.animations.stop('click', 5, true); 
                             button.kill();
                              iButton.kill();
                             }, 1000);
    }
    
    //instructions button id is 45
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
    //heath pack id is 70
    else if(veg.frame == 70){
        if(play==1){
        lives++;
        veg.kill();
            pickup.play();
        }
    }
    //armour pack id is 80
    else if(veg.frame == 80){
        if(play == 1){
        //lives = lives + 2;
        veg.kill();
            pickup.play();
            multiGunPowerUp ++;
             
            
        }
    }
  //if the hero dies, play this sound.
    if(lives<=0){
        heroDie.play();
    }
    
    //if you collect all of the innocents
    if(innocentsLeft == 0) {
        level++;
        
        numberOfBaddies2 = numberOfBaddies2 + 4;
        numberOfBaddies = numberOfBaddies + 4;
        innocentsLeft = 0;
        preload();
        //create();
        //iButton.kill();
        //button.kill();
        bossHealth = 100;
        
        
         //add the minions to the collision group
    
    //minions = game.add.group();
    //minions.enableBody = true;

    for (var i = 0; i < numberOfBaddies; i++)
    {
        //var minion = minions.create(game.world.randomX, game.world.randomY, 'minion');
        minion[i] = group.create(game.rnd.integerInRange(-900, 900), game.rnd.integerInRange(-900, 900), 'minion', 20);
        minion[i].name='minion'+i;
        
       //  minion[i].body.velocity.set(game.rnd.integerInRange(10, 200), game.rnd.integerInRange(10, 200));
       
        //minion[i].body.bounce.set(1, 1);
        minion[i].body.collideWorldBounds = true;
        minion[i].animations.add('walk');
        minion[i].animations.play('walk', 5, true);
        //minion[i].body.immovable = 'true';
       
    }
    
    
    //add the minions to the collision group
   // minions2 = game.add.group();
    //minions2.enableBody = true;
    
    for (var i = 0; i < numberOfBaddies2; i++)
    {
        //var minion2 = minions.create(game.world.randomX, game.world.randomY, 'minion');
        minion2[i] = group.create(game.rnd.integerInRange(-900, 900), game.rnd.integerInRange(-900, 900), 'minion2', 25);
        minion2[i].name='minion'+i;
        //minion2[i].body.velocity.set(game.rnd.integerInRange(10, 200), game.rnd.integerInRange(10, 200));
        //minion2[i].body.bounce.set(1, 1);
        //minion2[i].body.immovable = 'true';
        minion2[i].body.collideWorldBounds = true;
        minion2[i].animations.add('walk');
        minion2[i].animations.play('walk', 5, true);
        
    }
    
    
    //add the boss minion
    for(var i = 0; i<=level; i++){
   boss = group.create(game.rnd.integerInRange(-900, 900), game.rnd.integerInRange(-900, 900), 'boss', 30);
   boss.anchor.setTo(0.5, 0.5);
    
   boss.enablebody = true;
   boss.body.collideWorldBounds = true;
   boss.body.immovable = 'true';
   boss.body.velocity.set(game.rnd.integerInRange(10, 200), game.rnd.integerInRange(10, 200));
   boss.body.bounce.set(1, 1);
   boss.animations.add('move');
   boss.animations.play('move', 10, true);
    }
    
//make the innocent people to be picked up and add animation
   for (var i = 0; i < 5; i++)
    {
        
        var c = group.create(game.rnd.integerInRange(-900, 900), game.rnd.integerInRange(-900, 900), 'innocent', 17);
        c.name='innocent'+i;
        c.body.immovable = true;
        c.animations.add('wave');
        c.anchor.setTo(0.5, 0.5);
        c.animations.play('wave', game.rnd.integerInRange(1, 20), true);
        innocentsLeft++;
        
    }
    
    //make the innocent people to be picked up and add animation
    for (var i = 0; i < 5; i++)
    {
        
        var angel = group.create(game.rnd.integerInRange(-900, 900), game.rnd.integerInRange(-900, 900), 'angels', 18);
        angel.name='angel'+i;
        
        angel.body.immovable = true;
        angel.animations.add('walk');
        angel.animations.play('walk', game.rnd.integerInRange(5, 10), true);
        innocentsLeft++;
    }
        
        
    }
}


function fire () {

    if (game.time.now > nextFire && bullets.countDead() > 0)
    {
    bulletSound.play();
        nextFire = game.time.now + fireRate;

        var bullet = bullets.getFirstExists(false);

        bullet.reset(hero.x, hero.y);
        bullet.lifespan=300; 
        bullet.rotation = game.physics.arcade.moveToPointer(bullet, 1000, game.input.activePointer, 400);
        
        if(multiGunPowerUp == 1){
        var bullet2 = bullets.getFirstExists(false);

        bullet2.reset(hero.x+20, hero.y+5);
            bullet.lifespan=400; 
        bullet2.rotation = game.physics.arcade.moveToPointer(bullet2, 2000, game.input.activePointer, 400);
        
        
    
        var bullet3 = bullets.getFirstExists(false);

        bullet3.reset(hero.x-20, hero.y-5);
            bullet.lifespan=400; 
        bullet3.rotation = game.physics.arcade.moveToPointer(bullet3, 2000, game.input.activePointer, 400);
        }
        
        
    }
    

}

function gofull() {
    game.scale.startFullScreen();

}
//show the rendered info on the top left corner of the screen including 
//health remaining and survivors remaining, level and score
function render () {

	//game.debug.inputInfo(32, 32);
    game.debug.text("" + innocentsLeft + " survivors left", 32, 32);
    game.debug.text("Lives: " + lives, 32, 50);
    game.debug.text("Level: "+level, 32, 70);
    game.debug.text("Score: "+score, 32, 90);
    game.debug.text("Boss Health: "+bossHealth, 32, 110);
    //game.debug.text("Zombie Girl Health: "+zombieHealth, 32, 130);
    //game.debug.text("Zombie Guy Health: "+zombie2Health, 32, 150);
    
   
}