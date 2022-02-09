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

let player;
let size = 32;
let collidingTiles = ['000', '001', '002', '075', '076', '077'];
let gravity = 8;
let speed = 4;
let velocity = { x: 0, y: 1 };

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

	player = new PIXI.AnimatedSprite(
		playersheet.spritesheet.animations['player-idle']
	);

	player.animationSpeed = 0.1;
	player.anchor.set(0, 1);
	player.position.set(size * 6, size * 2);
	player.scale.set((2 * size) / player.width);
	player.play();

	PIXI.Ticker.shared.add(_ => {
		let y = Math.ceil(player.position.y / 32);
		let x = Math.ceil(player.position.x / 32);
		x = [x - 1, x, x + 1].filter(
			cx =>
				cx >= 0 &&
				cx <
					PIXI.Loader.shared.resources['maps'].data.maps.LVL1.map[0].length - 1
		);
		let isAble = true;
		x.forEach(x => {
			let tile = [getTileData(x, y), tileCollide(player, getTileData(x, y))];

			if (velocity.y == 1) {
				if (tile[1] === true) {
					isAble = false;
				}
			}
		});
		if (isAble) {
			player.position.y += gravity * velocity.y;
		}

		let tiles = [
			[getTileData(x[0], y - 1), tileCollide(player, getTileData(x, y))],
			[getTileData(x[2], y - 1), tileCollide(player, getTileData(x, y))],
		];
		isAble = true;
		if (velocity.x == 1) {
			if (
				player.position.x >= 28 * 32 ||
				(tiles[1][0][1] == true && tiles[1][1] == true)
			)
				isAble = false;
		} else if (velocity.x == -1) {
			if (
				player.position.x <= 0 ||
				(tiles[0][0][1] == true && tiles[0][1] == true)
			)
				isAble = false;
		}
		isAble && (player.position.x += velocity.x * speed);
	});

	window.addEventListener('keydown', e => {
		if (e.keyCode === 39) {
			velocity.x = 1;
		}
		if (e.keyCode === 37) {
			velocity.x = -1;
		}
	});
	window.addEventListener('keyup', e => {
		velocity.x = 0;
	});

	app.stage.addChild(back, middle, tilemap, player);
}

document.body.appendChild(app.view);

function getTileData(x, y) {
	let arr = PIXI.Loader.shared.resources['maps'].data.maps.LVL1.map;
	return [
		arr[y][x],
		collidingTiles.includes(arr[y][x]),
		{
			x: x * size,
			y: y * size,
			width: size,
			height: size,
		},
	];
}
function tileCollide(sprite, tile) {
	if (!collidingTiles.includes(tile[0])) return false;

	let abox = sprite.getBounds();
	let bbox = tile[2];

	return (
		abox.x + abox.width >= bbox.x &&
		abox.x <= bbox.x + bbox.width &&
		abox.y + abox.height >= bbox.y &&
		abox.y <= bbox.y + bbox.height
	);
}
