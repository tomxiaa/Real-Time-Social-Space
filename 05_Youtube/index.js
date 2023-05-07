import * as THREE from 'three';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import Stats from 'three/addons/libs/stats.module.js';

// import star from './Img/star.png';

const renderer = new THREE.WebGL1Renderer();

renderer.shadowMap.enabled = true;

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const ratio = window.innerWidth / window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, ratio, 0.1, 1000);
const orbit = new OrbitControls(camera, renderer.domElement);
camera.position.set(-10, 30, 30);
orbit.update();

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);


// const boxGeo = new THREE.BoxGeometry();
// const boxMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// const box = new THREE.Mesh(boxGeo, boxMat);
// scene.add(box);

const planeGeo = new THREE.PlaneGeometry(30, 30);
const planeMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide
});
const plane = new THREE.Mesh(planeGeo, planeMat);
plane.rotation.x = -0.5 * Math.PI;
scene.add(plane);
plane.receiveShadow = true;

const gridHelper = new THREE.GridHelper(30);
scene.add(gridHelper);

const ballGeo = new THREE.SphereGeometry(4);
const ballMat = new THREE.MeshStandardMaterial({
    color: 0x0000ff,
    wireframe: false
});
const ball = new THREE.Mesh(ballGeo, ballMat);
scene.add(ball);

ball.position.set(-10, 10, 0);
ball.castShadow = true;

//torus
const torusGeo = new THREE.TorusGeometry(5, 3, 16, 50);
const torusMat = new THREE.MeshStandardMaterial({
    color: 0xffff00,
    wireframe: true
});
const torus = new THREE.Mesh(torusGeo, torusMat);
scene.add(torus);
torus.position.set(5, 10, 5);
torus.castShadow = true;

//2nd plane
const plane2Geo = new THREE.PlaneGeometry(10,10,10,10);
const plane2Mat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true
})
const plane2 = new THREE.Mesh(plane2Geo, plane2Mat);
scene.add(plane2);
plane2.position.set(10, 10, 15);

plane2.geometry.attributes.position.array[0] -= 10 * Math.random();
plane2.geometry.attributes.position.array[1] -= 10 * Math.random();
plane2.geometry.attributes.position.array[2] -= 10 * Math.random();
const lastPointZ = plane2.geometry.attributes.position.array.length - 1;
plane2.geometry.attributes.position.array[lastPointZ] -= 10 * Math.random();



//ambient lighting
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

// Directional Light
// const direcitonalLight = new THREE.DirectionalLight(0xffffff, 0.8);
// scene.add(direcitonalLight);
// direcitonalLight.position.set(-30, 50,0);
// direcitonalLight.castShadow = true;
// direcitonalLight.shadow.camera.bottom = -12;

// const dLightHelper = new THREE.DirectionalLightHelper(direcitonalLight,5);
// scene.add(dLightHelper);

// const dLightShadowHelper = new THREE.CameraHelper(direcitonalLight.shadow.camera);
// scene.add(dLightShadowHelper);

const spotLight = new THREE.SpotLight(0xffffff);
scene.add(spotLight);
spotLight.position.set(-100, 100, 0);
spotLight.castShadow = true;
spotLight.angle = 0.2;

const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);

// scene.fog = new THREE.Fog(0xffffff, 0, 200);
scene.fog = new THREE.FogExp2(0xffffff, 0.01);

// renderer.setClearColor(0xffea00);
const textureLoader = new THREE.TextureLoader();
scene.background = textureLoader.load('./Img/star.png');

//GUI set up
const gui = new dat.GUI();
const options = {
    ballColor: '#ffea00',
    wireframe: false,
    speed: 0.01,
    angle: 0.2,
    penumbra: 0,
    intensity: 1
};

gui.addColor(options, 'ballColor').onChange(function (e) {
    ball.material.color.set(e);
});
gui.add(options, 'wireframe').onChange(function (e) {
    ball.material.wireframe = e;
});
gui.add(options, 'speed', 0, 0.1);

gui.add(options, 'angle', 0, 1);
gui.add(options, 'penumbra', 0, 1);
gui.add(options, 'intensity', 0, 1);

let step = 0;

//rayCaster
const mousePosition = new THREE.Vector2();

window.addEventListener('mousemove', function (e) {
    mousePosition.x = (e.clientX / this.window.innerWidth) * 2 - 1;
    mousePosition.y = - (e.clientY / this.window.innerHeight) * 2 + 1;
});
const rayCaster = new THREE.Raycaster();

ball.name = 'theBall';
torus.name = 'theTorus';

function animate() {
    box.rotation.x += 0.01;
    box.rotation.y += 0.01;

    step += options.speed;
    ball.position.y = 10 * Math.abs(Math.sin(step));

    spotLight.angle = options.angle;
    spotLight.penumbra = options.penumbra;
    spotLight.intensity = options.intensity;
    spotLightHelper.update();

    rayCaster.setFromCamera(mousePosition, camera);
    const intersects = rayCaster.intersectObjects(scene.children);
    // console.log(intersects);

    for (let i = 0; i < intersects.length; i++) {
        if (intersects[i].object.name === 'theBall')
            intersects[i].object.material.color.set(0xff0000);
        if (intersects[i].object.name === 'theTorus') {
            intersects[i].object.rotation.x += 0.01;
            intersects[i].object.rotation.y += 0.01;
        }
    }

    plane2.geometry.attributes.position.array[0] = 0.5 * Math.random();
    plane2.geometry.attributes.position.array[1] = 0.5 * Math.random();
    plane2.geometry.attributes.position.array[2] = 0.5 * Math.random();
    plane2.geometry.attributes.position.array[lastPointZ] = 0.5 * Math.random();
    plane2.geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})