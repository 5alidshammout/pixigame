let app = new PIXI.Application({ width: 1000, height: 600 });
let folder = 'Sunnyland/PNG/';
PIXI.Loader.shared
	.add(folder + 'environment/layers/back.png')
	.add(folder + 'environment/layers/middle.png')
	.add(folder + 'environment/layers/tilemap.png')
	.add('json', folder + 'environment/layers/tilemap.json')
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

	tilemap.addFrame(textures['tile---001.png'], size * 1, size * 1);

	app.stage.addChild(back, middle, tilemap);
}

document.body.appendChild(app.view);
