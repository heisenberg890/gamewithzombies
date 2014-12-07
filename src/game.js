
var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

function preload() {

//load the images
    game.load.image('hero', 'assets/sprites/car.png');

}

var hero;
var currentSpeed = 0;
var cursors;

function create() {
//  Resize our game world to be a 2000 x 2000 square
    game.world.setBounds(-1000, -1000, 2000, 2000);
    
    //  To make the sprite move we need to enable Arcade Physics
    game.physics.startSystem(Phaser.Physics.ARCADE);

    hero = game.add.sprite(game.world.centerX, game.world.centerY, 'hero');
    hero.anchor.set(0.5);

    //  And enable the Sprite to have a physics body:
    game.physics.arcade.enable(hero);
    
    //make the camera follow the sprite
    game.camera.follow(hero);
    game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);
    game.camera.focusOnXY(0, 0);
    
    //enable cursors into the keyboard functions

    cursors = game.input.keyboard.createCursorKeys();

}

function update () {

    //  If the sprite is > 8px away from the pointer then let's move to it
  /*  if (game.physics.arcade.distanceToPointer(hero, game.input.activePointer) > 8)
    {
        //  Make the object seek to the active pointer (mouse or touch).
        game.physics.arcade.moveToPointer(hero, 300);
    }
    else
    {
        //  Otherwise turn off velocity because we're close enough to the pointer
        hero.body.velocity.set(0);
    }*/
    
    
    
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
        currentSpeed = 300;
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

}

function render () {

	//game.debug.inputInfo(32, 32);

}