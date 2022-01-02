let app = new PIXI.Application({ width: 30 * 32, height: 20 * 32 });
let folder = 'Sunnyland/PNG/';
PIXI.Loader.shared
	.add(folder + 'environment/layers/back.png')
	.add(folder + 'environment/layers/middle.png')
	.add('json', folder + 'environment/layers/tileset.json')
	.add('player', folder + 'spritesheets/player.json')
	.add('maps', 'maps/maps.json')
	.load(setup);

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

function setup() {
	let back = new PIXI.TilingSprite(
		PIXI.Loader.shared.resources[
			folder + 'environment/layers/back.png'
		].texture,
		app.screen.width,
		app.screen.height
	);
	back.scale.set(app.screen.height / 240);

	let middle = new PIXI.TilingSprite(
		PIXI.Loader.shared.resources[
			folder + 'environment/layers/middle.png'
		].texture,
		app.screen.width + 50,
		368
	);
	middle.position.y = app.screen.height - middle.height;
	middle.position.x -= 50;

	let tilemap = new PIXI.tilemap.CompositeRectTileLayer();

	let textures = PIXI.Loader.shared.resources['json'].textures;

	let size = 32;

	let maps = PIXI.Loader.shared.resources['maps'].data.maps;
	let arr = maps.LVL1.map;

	for (let i = 0; i < arr.length; i++) {
		for (let j = 0; j < arr[i].length; j++) {
			if (arr[i][j] == '---') continue;
			tilemap.addFrame(
				textures['tile---' + arr[i][j] + '.png'],
				j * size,
				i * size
			);
		}
	}

	let playersheet = PIXI.Loader.shared.resources['player'];

	let player = new PIXI.AnimatedSprite(
		playersheet.spritesheet.animations['player-idle']
	);

	player.animationSpeed = 0.1;
	player.anchor.set(0, 1);
	player.position.set(0, app.screen.height - 32 * 4);
	player.scale.set((2 * size) / player.width);
	player.play();

	console.log(playersheet.spritesheet.animations['player-idle']);

	app.stage.addChild(back, middle, tilemap, player);
}

document.body.appendChild(app.view);
