let app = new PIXI.Application({ width: 960, height: 600 });
let folder = 'Sunnyland/PNG/';
PIXI.Loader.shared
	.add(folder + 'environment/layers/back.png')
	.add(folder + 'environment/layers/middle.png')
	.load(setup);

function setup() {
	let back = new PIXI.Sprite(
		PIXI.Loader.shared.resources[folder + 'environment/layers/back.png'].texture
	);
	back.height = app.screen.height;
	back.width = app.screen.height * 1.6;

	let middle = new PIXI.Sprite(
		PIXI.Loader.shared.resources[
			folder + 'environment/layers/middle.png'
		].texture
	);
	middle.position.y = app.screen.height - middle.height;

	app.stage.addChild(back, middle);
}

document.body.appendChild(app.view);
