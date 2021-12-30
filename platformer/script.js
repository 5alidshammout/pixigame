let app = new PIXI.Application({ width: 30 * 32, height: 20 * 32 });
let folder = 'Sunnyland/PNG/';
PIXI.Loader.shared
	.add(folder + 'environment/layers/back.png')
	.add(folder + 'environment/layers/middle.png')
	.add(folder + 'environment/layers/tileset.png')
	.add('json', folder + 'environment/layers/tileset.json')
	.add('maps', 'maps/maps.json')
	.load(setup);

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

	console.log(arr);
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

	app.stage.addChild(back, middle, tilemap);
}

document.body.appendChild(app.view);
