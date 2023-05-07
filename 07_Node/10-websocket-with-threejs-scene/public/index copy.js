/*
This example sets up a simple three.js scene which connects to a websocket server.

*/
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import * as CANNON from "https://unpkg.com/cannon-es@0.19.0/dist/cannon-es.js";


let scene, camera, renderer;

let ground;
let mouse;
let socket; // create a global socket object

function init() {
  // create a scene in which all other objects will exist
  scene = new THREE.Scene();

  // create a camera and position it in space
  let aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
  camera.position.z = 5; // place the camera in space
  camera.position.y = 5;
  camera.lookAt(0, 0, 0);

  // the renderer will actually show the camera view within our <canvas>
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // add shadows
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

  let groundGeo = new THREE.BoxGeometry(10, 1, 10);
  let groundMat = new THREE.MeshPhongMaterial({ color: "yellow" });
  ground = new THREE.Mesh(groundGeo, groundMat);
  scene.add(ground);
  ground.receiveShadow = true;

  //set up gravity
  const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.82, 0)
  });

  const groundPhyMat = new CANNON.Material();

  const groundBody = new CANNON.Body({
    shape: new CANNON.Box(new CANNON.Vec3(10, 1, 10)),
    type: CANNON.Body.STATIC,
    material: groundPhyMat
  });
  world.addBody(groundBody);
  groundBody.quaternion.setFromEuler(- Math.PI / 2, Math.PI / 30, 0);
  groundBody.angularVelocity.set(0, 1, 0);

  const ballPhyMat = new CANNON.Material();

const ballBody = new CANNON.Body({
    mass:0.5,
    shape: new CANNON.Sphere(2),
    position: new CANNON.Vec3(0, 10, 0),
    material: ballPhyMat
});
world.addBody(ballBody);
ballBody.linearDamping = 0.31;

const groundBallContactMat = new CANNON.ContactMaterial(
    groundPhyMat,
    ballPhyMat,
    {restitution: 0.9}
);

world.addContactMaterial(groundBallContactMat);

  // add orbit controls
  let controls = new OrbitControls(camera, renderer.domElement);

  setupEnvironment();
  establishWebsocketConnection();
  setupRaycastInteraction();

  loop();
}

function establishWebsocketConnection() {
  socket = io();

  socket.on("msg", (msg) => {
    console.log(
      "Got a message from friend with ID ",
      msg.from,
      "and data:",
      msg.data
    );
    let geo = new THREE.IcosahedronGeometry(0.25, 0);
    let mat = new THREE.MeshPhongMaterial({ color: "blue" });
    let mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);
    mesh.position.set(msg.data.x, msg.data.y, msg.data.z);
    mesh.castShadow = true;
  });

  // document.addEventListener(
  //   "keyup",
  //   (ev) => {
  //     if (ev.key === "t") {
  //       socket.emit("msg", Date.now());
  //     }
  //   },
  //   false
  // );
}

function setupRaycastInteraction() {
  mouse = new THREE.Vector2(0, 0);
  document.addEventListener(
    "mousemove",
    (ev) => {
      // three.js expects 'normalized device coordinates' (i.e. between -1 and 1 on both axes)
      mouse.x = (ev.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(ev.clientY / window.innerHeight) * 2 + 1;
    },
    false
  );

  let raycaster = new THREE.Raycaster();
  document.addEventListener("click", (ev) => {
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObject(ground);

    if (intersects.length) {
      let point = intersects[0].point;
      console.log(point);
      socket.emit("msg", point);

      // add our own
      let geo = new THREE.IcosahedronGeometry(0.25, 0);
      let mat = new THREE.MeshPhongMaterial({ color: "red" });
      let mesh = new THREE.Mesh(geo, mat);
      scene.add(mesh);
      mesh.position.set(point.x, point.y, point.z);
      mesh.castShadow = true;
    }
  });
}

function setupEnvironment() {
  //add a light
  let myColor = new THREE.Color(0xffaabb);
  let ambientLight = new THREE.AmbientLight(myColor, 0.5);
  scene.add(ambientLight);

  // add a directional light
  let myDirectionalLight = new THREE.DirectionalLight(myColor, 0.85);
  myDirectionalLight.position.set(-5, 3, -5);
  myDirectionalLight.lookAt(0, 0, 0);
  scene.add(myDirectionalLight);
  myDirectionalLight.castShadow = true;
}

function loop() {
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
}

init();
