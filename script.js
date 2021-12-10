let P = PIXI;
let app = new P.Application({ width: 800, height: 600 });
let BG, sheet, ship, alien;
let R = 0;
let speed = 50;
let z = 1;
let times = 10;
let tfa = 100;
let sas = 0.7;
let bs = 10;
let rotateSpeed = 3;
let bullets = [];
let interval;

let timer = 3 * 100;
let numOfBullets = 3;
let score = 0;

P.Loader.shared
	.add('assets/sprite.json')
	.add('assets/space.png')
	// .add('assets/header.png')
	.add('assets/bullet.png')
	.add('assets/alien.png')
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
	let text = new PIXI.Text(`${timer}\n${numOfBullets}\n${score}`, {
		fontFamily: 'fredoka one',
		fontSize: 24,
		fill: 0x33bbff,
	});

	interval = setInterval(() => {
		timer -= 1;
		text.text = `${timer}\n${numOfBullets}\n${score}`;
	}, 1);

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

	createAlien();

	app.stage.addChild(BG, alien, ship);
	// app.stage.addChild(header);
	app.stage.addChild(text);

	P.Ticker.shared.add(function (delta) {
		R += rotateSpeed * z;
		ship.rotation = (R * Math.PI) / 180;
		if (timer <= 0) {
			gameOver();
		} else if (numOfBullets <= 0 && bullets.length <= 0) {
			gameOver();
		}
	});
	P.Ticker.shared.add(moveBullet);

	window.addEventListener('keyup', eventListener);
}
function eventListener(e) {
	if (e.keyCode === 38) {
		ship.play();
		moveShip();
		z *= -1;
	} else if (e.keyCode === 32) {
		createBullet();
	}
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
	if (numOfBullets <= 0) return;
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
	numOfBullets--;
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
function createAlien() {
	alien = new P.Sprite(P.Loader.shared.resources['assets/alien.png'].texture);
	alien.anchor.set(0.5);
	alien.scale.set(0.3);
	alien.x = Math.random() * 700 + 50;
	alien.y = Math.random() * 500 + 50;
	P.Ticker.shared.add(function () {
		for (let i = 0; i < bullets.length; i++) {
			let bullet = bullets[i];
			if (rectIntersect(alien, bullet)) {
				alien.x = Math.random() * 700 + 50;
				alien.y = Math.random() * 500 + 50;
				app.stage.removeChild(bullet);
				bullets.splice(i, 1);
				timer += 100;
				numOfBullets += 2;
				score += 100;
			}
		}
	});
}
function rectIntersect(a, b) {
	let abox = a.getBounds();
	let bbox = b.getBounds();

	return (
		abox.x + abox.width > bbox.x &&
		abox.x < bbox.x + bbox.width &&
		abox.y + abox.height > bbox.y &&
		abox.y < bbox.y + bbox.height
	);
}
function gameOver() {
	let rect = new P.Sprite(
		P.Loader.shared.resources['assets/space.png'].texture
	);
	rect.anchor.set(0.5);
	rect.x = app.screen.width / 2;
	rect.y = app.screen.height / 2;
	let text = new PIXI.Text(`Game Over\nScore: ${score}`, {
		fontFamily: 'fredoka one',
		fontSize: 100,
		fill: 0x33bbff,
	});
	text.anchor.set(0.5);
	text.x = app.screen.width / 2;
	text.y = app.screen.height / 2;
	app.stage.addChild(rect, text);
	P.Ticker.shared.stop();
	window.removeEventListener('keyup', eventListener);
	clearInterval(interval);
	window.addEventListener('keyup', function (e) {
		location.reload();
	});
}
