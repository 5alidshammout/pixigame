let P = PIXI;
let app = new P.Application({ width: 800, height: 600 });
let BG, sheet, ship;
let R = 0;
let speed = 50;
let z = 1;
let times = 10;
let tfa = 100;
let sas = 0.7;
let bs = 10;
let bullets = [];
P.Loader.shared
	.add('assets/sprite.json')
	.add('assets/space.png')
	// .add('assets/header.png')
	.add('assets/bullet.png')
	.load(setup);

document.body.appendChild(app.view);

function setup() {
	sheet = P.Loader.shared.resources['assets/sprite.json'].data;
	BG = new P.Sprite(P.Loader.shared.resources['assets/space.png'].texture);
	ship = new P.AnimatedSprite.fromFrames(
		sheet.animations['spaceship'].map(x => 'assets/' + x)
	);
	// let header = new P.Sprite(
	// 	P.Loader.shared.resources['assets/header.png'].texture
	// );

	BG.anchor.set(0.5);
	BG.x = app.screen.width / 2;
	BG.y = app.screen.height / 2;

	// header.alpha = 0.8;
	// header.anchor.set(0.5);
	// header.x = app.screen.width / 2;
	// header.y = 0 + header.height / 2;

	ship.animationSpeed = sas;
	ship.onLoop = function () {
		ship.stop();
	};
	ship.scale.set(0.3);
	ship.anchor.set(0.5);
	ship.x = app.screen.width / 2;
	ship.y = app.screen.height / 2;

	app.stage.addChild(BG);
	app.stage.addChild(ship);
	// app.stage.addChild(header);

	P.Ticker.shared.add(function (delta) {
		R += 2 * z;
		ship.rotation = (R * Math.PI) / 180;
	});
	P.Ticker.shared.add(moveBullet);

	window.addEventListener('keyup', function (e) {
		if (e.keyCode === 38) {
			ship.play();
			moveShip();
			z *= -1;
		} else if (e.keyCode === 32) {
			createBullet();
		}
	});
}
function moveShip() {
	for (let i = 0; i < times; i++) {
		setTimeout(() => {
			let nx = ship.x + (speed * Math.cos(((R - 90) * Math.PI) / 180)) / times;
			let ny = ship.y + (speed * Math.sin(((R - 90) * Math.PI) / 180)) / times;

			if (nx < 50) {
				ship.x = 50;
			} else if (nx > 750) {
				ship.x = 750;
			} else {
				ship.x = nx;
			}

			if (ny < 50) {
				ship.y = 50;
			} else if (ny > 550) {
				ship.y = 550;
			} else {
				ship.y = ny;
			}
		}, (tfa / times) * i);
	}
}
function createBullet() {
	let bullet = new P.Sprite(
		P.Loader.shared.resources['assets/bullet.png'].texture
	);
	bullet.anchor.set(0.5);
	bullet.x = ship.x;
	bullet.y = ship.y;
	bullet.rotation = (R * Math.PI) / 180;
	bullet.scale.set(0.3);
	bullet.zOrder = -1;
	app.stage.addChild(bullet);
	bullets.push(bullet);
	z *= -1;
}
function moveBullet() {
	for (let i = 0; i < bullets.length; i++) {
		let bullet = bullets[i];
		bullet.x += bs * Math.cos(bullet.rotation - (90 * Math.PI) / 180);
		bullet.y += bs * Math.sin(bullet.rotation - (90 * Math.PI) / 180);
		if (bullet.y < 0 || bullet.y > 600 || bullet.x < 0 || bullet.x > 800) {
			app.stage.removeChild(bullet);
			bullets.splice(i, 1);
		}
	}
}
