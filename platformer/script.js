let app = new PIXI.Application({ width: 1000, height: 600 });
let folder = 'Sunnyland/PNG/';
PIXI.Loader.shared
	.add(folder + 'environment/layers/back.png')
	.add(folder + 'environment/layers/middle.png')
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

	app.stage.addChild(back, middle);
}

document.body.appendChild(app.view);
