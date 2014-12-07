var heroImage;

var game = new Phaser.Game(
    800, 600, Phaser.AUTO, '',
    {preload: preload, create: create, update: update}
);

function preload(){
    game.load.image('hero', 'images/hero.png');
}

function create(){
    
}

function update(){
    
}