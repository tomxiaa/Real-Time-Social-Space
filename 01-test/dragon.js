import * as THREE from "three";
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

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

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 5, 0);
controls.autoRotate = true;
controls.autoRotateSpeed = 3;


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

//make 10 balls in a row with different colors
const numSpheres = 10;
for (let i = 0; i < numSpheres; ++i) {
  const sphereMat = new THREE.MeshPhongMaterial({shininess: 150});
  sphereMat.color.setHSL(i * 0.9, 1, 0.6);
  const myBall = new THREE.Mesh(sphereGeo, sphereMat);
  myBall.position.set(-sphereRadius, sphereRadius + 5, i * sphereRadius * -2);
  myBall.receiveShadow = true;
  myBall.castShadow = true;
  balls.push(myBall);
  scene.add(myBall);
}

//ground plane
const planeMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(15,15,15,15),
  new THREE.MeshBasicMaterial({color: 0x393839, wireframe: true})
);
planeMesh.rotateX(-Math.PI/2);
planeMesh.receiveShadow = true;
scene.add(planeMesh);

var clock = new THREE.Clock();

function loop() {
 
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
  controls.update();

  let currentTime = clock.getElapsedTime();
  balls.forEach( (ball,index) => { ball.position.y = 6+ Math.sin(currentTime +index*0.5) *3})
  balls.forEach( (ball,index) => { ball.position.x = 1+ Math.sin(currentTime +index*0.9) *2})
  balls.forEach( (ball,index) => { ball.position.z = -10+ Math.sin(currentTime +index*0.1) *5})
}

loop();
