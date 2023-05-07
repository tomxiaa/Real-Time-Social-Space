import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';




// create a list of balls
let balls = [];

//scene setup
let scene = new THREE.Scene();
let aspect = window.innerWidth / window.innerHeight;
let camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
camera.position.y = 5;
camera.position.z = 10;
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

addBackground();

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 5, 0);
// controls.autoRotate = true;
// controls.autoRotateSpeed = 3;

function addBackground() {
  let loader = new RGBELoader();
  loader.load("../Image/venetian_crossroads_4k.hdr", (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = texture;
  })
}

//lighting setup
let directionalLight = new THREE.DirectionalLight(new THREE.Color(0xffffff), 1);
directionalLight.position.set(10, 10, 3);
directionalLight.lookAt(0, 0, 0);
scene.add(directionalLight);

let ambientLight = new THREE.AmbientLight(new THREE.Color(0xffffff), 0.5);
scene.add(ambientLight);

//define ball spec 
const sphereRadius = 1;
const sphereWidthDivisions = 8;
const sphereHeightDivisions = 8;
const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);

//dragon skin texture for balls
let textureLoader = new THREE.TextureLoader();
let skin = textureLoader.load("../Image/dragonskin.jpg");

skin.wrapS = THREE.RepeatWrapping;
skin.wrapT = THREE.RepeatWrapping;
skin.repeat.set(1, 1);

//make 10 balls in a row with different colors
const numSpheres = 10;
for (let i = 0; i < numSpheres; ++i) {
  const sphereMat = new THREE.MeshPhongMaterial({
    map: skin,
    shininess: 200,
    // roughness: 0,
    // metalness: 1,
  });
  // sphereMat.color.setHSL(i * 0.9, 1, 0.6);
  const myBall = new THREE.Mesh(sphereGeo, sphereMat);
  myBall.position.set(-sphereRadius, sphereRadius + 5, i * sphereRadius * -2);
  myBall.receiveShadow = true;
  myBall.castShadow = true;
  balls.push(myBall);
  scene.add(myBall);
}


var terrainSize = 20;
var terrainSeg = 100;
var geometry = new THREE.PlaneGeometry(terrainSize, terrainSize, terrainSeg, terrainSeg);

// Create a custom terrain height map
var heightMap = [];
for (var i = 0; i < terrainSeg + 1; i++) {
  heightMap[i] = [];
  for (var j = 0; j < terrainSeg + 1; j++) {
    heightMap[i][j] = Math.random() * 2;
  }
}

// Use the custom height map to modify the Z coordinates of the plane's vertices
var vertices = geometry.attributes.position.array;
console.log(vertices);
// for (var i = 0; i < vertices.length; i++) {
//   var vertex = vertices[i];
//   vertex.z = heightMap[vertex.x / terrainSize * terrainSeg][vertex.y / terrainSize * terrainSeg];
// }

//ground plane
const planeMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(15, 15, 15, 15),
  new THREE.MeshBasicMaterial({ color: 0x393839, wireframe: true })
);
planeMesh.rotateX(-Math.PI / 2);
planeMesh.receiveShadow = true;
scene.add(planeMesh);

var clock = new THREE.Clock();

function loop() {

  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
  controls.update();

  let currentTime = clock.getElapsedTime();
  balls.forEach((ball, index) => { ball.position.y = 6 + Math.sin(currentTime + index * 0.5) * 3 })
  balls.forEach((ball, index) => { ball.position.x = 1 + Math.sin(currentTime + index * 0.9) * 2 })
  balls.forEach((ball, index) => { ball.position.z = -10 + Math.sin(currentTime + index * 0.1) * 5 })
}

loop();

//gridHelper
let gridHelper = new THREE.GridHelper(25, 25);
scene.add(gridHelper);

