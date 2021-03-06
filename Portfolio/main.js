import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Setup
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
//////////////////////////////////////////////////////////////

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);

renderer.render(scene, camera);



// Torus

const geometry = new THREE.TorusGeometry(10, 3, 14, 100);
const material = new THREE.MeshStandardMaterial({ color: 0xCEBD09});
const torus = new THREE.Mesh(geometry, material);

scene.add(torus);

// Testing other shapes
const geometry2 = new THREE.TorusKnotGeometry( 10, 3, 100, 16 );
const material2 = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
const torusKnot2 = new THREE.Mesh( geometry2, material2 );
scene.add( torusKnot );

// Lights

const pointLight = new THREE.PointLight(0xCEBD09);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xCEBD09);
scene.add(ambientLight);

// Helpers for debugging

// const lightHelper = new THREE.PointLightHelper(pointLight)
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper)

// const controls = new OrbitControls(camera, renderer.domElement);


function addStar() {
  const geometry = new THREE.SphereGeometry(0.10, 10, 10);
  const material = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}


Array(200).fill().forEach(addStar);

// Background

const spaceTexture = new THREE.TextureLoader().load('background.jpg');
scene.background = spaceTexture;

// Avatar

const aTexture = new THREE.TextureLoader().load('PFP.png');

const ahmed = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ map: aTexture }));

scene.add(ahmed);

// Moon

const moonTexture = new THREE.TextureLoader().load('space.jpg');
const normalTexture = new THREE.TextureLoader().load('earth.png');

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 31, 31),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture,
  })
);

const listener = new THREE.AudioListener();
camera.add( listener );

// create a global audio source
const sound = new THREE.Audio( listener );

// load a sound and set it as the Audio object's buffer
const audioLoader = new THREE.AudioLoader();
audioLoader.load( 'Hymn For The Weekend.mp3', function( buffer ) {
	sound.setBuffer( buffer );
	sound.setLoop( true );
	sound.setVolume( 0.5 );
	sound.play();
});

scene.add(moon);

moon.position.z = 25;
moon.position.setX(-10);

ahmed.position.z = -5;
ahmed.position.x = 2;

// Scroll Animation

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  ahmed.rotation.y += 0.01;
  ahmed.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera;
moveCamera();

// Animation Loop

function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  moon.rotation.x += 0.005;

  // controls.update();

  renderer.render(scene, camera);
}

animate();
