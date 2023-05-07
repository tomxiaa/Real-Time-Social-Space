import * as THREE from 'three';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import * as CANNON from "https://unpkg.com/cannon-es@0.19.0/dist/cannon-es.js";
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import Stats from 'three/addons/libs/stats.module.js';

const renderer = new THREE.WebGLRenderer();

renderer.shadowMap.enabled = true;

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const ratio = window.innerWidth / window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, ratio, 0.1, 1000);
const orbit = new OrbitControls(camera, renderer.domElement);
camera.position.set(-20, 30, 50);
orbit.update();

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const boxGeo = new THREE.BoxGeometry(2,2,2);
const boxMat = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true
});
const boxMesh = new THREE.Mesh(boxGeo, boxMat);
scene.add(boxMesh);

const ballGeo = new THREE.SphereGeometry(2,10,10);
const ballMat = new THREE.MeshBasicMaterial({
    color: 0xffea00,
    wireframe: true
});
const ballMesh = new THREE.Mesh(ballGeo, ballMat);
scene.add(ballMesh);

const groundGeo = new THREE.PlaneGeometry(30, 30);
const groundMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
    wireframe: true
});
const groundMesh = new THREE.Mesh(groundGeo, groundMat);
scene.add(groundMesh);

const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -5, 0)
});

const groundPhyMat = new CANNON.Material();

const groundBody = new CANNON.Body({
    shape: new CANNON.Box(new CANNON.Vec3(15,15,0.01)),
    // mass: 10,
    type: CANNON.Body.STATIC,
    material: groundPhyMat
});
world.addBody(groundBody);
groundBody.quaternion.setFromEuler(- Math.PI / 2, Math.PI / 30, 0);
groundBody.angularVelocity.set(0,1,0);


const boxPhyMat = new CANNON.Material();

const boxBody = new CANNON.Body({
    mass: 1,
    shape: new CANNON.Box(new CANNON.Vec3(1,1,1)),
    position: new CANNON.Vec3(-10,20,0),
    material: boxPhyMat
})
world.addBody(boxBody);
boxBody.angularVelocity.set(0,1,0);
boxBody.angularDamping = 0.5;

const groundBoxContactMat = new CANNON.ContactMaterial(
    groundPhyMat,
    boxPhyMat,
    {friction: 0}
);

world.addContactMaterial(groundBoxContactMat);

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

const timeStep = 1 / 60;

//rayCaster
const mousePosition = new THREE.Vector2();

window.addEventListener('mousemove', function (e) {
    mousePosition.x = (e.clientX / this.window.innerWidth) * 2 - 1;
    mousePosition.y = - (e.clientY / this.window.innerHeight) * 2 + 1;
});
const rayCaster = new THREE.Raycaster();

ballBody.name = 'theBall';
boxBody.name = 'theBox';

function animate() {
    world.step(timeStep);

    groundMesh.position.copy(groundBody.position);
    groundMesh.quaternion.copy(groundBody.quaternion);

    boxMesh.position.copy(boxBody.position);
    boxMesh.quaternion.copy(boxBody.quaternion);

    ballMesh.position.copy(ballBody.position);
    ballMesh.quaternion.copy(ballBody.quaternion);

    rayCaster.setFromCamera(mousePosition, camera);
    const intersects = rayCaster.intersectObjects(scene.children);
    // console.log(intersects);

    for (let i = 0; i < intersects.length; i++) {
        if (intersects[i].object.id === '11')
            intersects[i].object.material.color.set(0xff0000);
        if (intersects[i].object.id === '13') {
            intersects[i].object.rotation.x += 0.01;
            intersects[i].object.rotation.y += 0.01;
        }
    }

    renderer.render(scene, camera);
}




renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})