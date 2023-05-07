import * as THREE from 'three';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import * as CANNON from "https://unpkg.com/cannon-es@0.19.0/dist/cannon-es.js";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import Stats from 'three/addons/libs/stats.module.js';


const renderer = new THREE.WebGL1Renderer({antialias: true} );

renderer.shadowMap.enabled = true;

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const ratio = window.innerWidth / window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, ratio, 0.1, 1000);
const orbit = new OrbitControls(camera, renderer.domElement);
camera.position.set(-10, 30, 30);
orbit.update();



//ambient lighting
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);


//directional lighting
// const direcitonalLight = new THREE.DirectionalLight(0xffffff, 0.8);
// scene.add(direcitonalLight);
// direcitonalLight.position.set(10, 50, 10);

//groundplane
const planeGeo = new THREE.PlaneGeometry(30, 30);
const planeMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide
});
const plane = new THREE.Mesh(planeGeo, planeMat);
plane.rotation.x = -0.5 * Math.PI;
scene.add(plane);
plane.receiveShadow = true;


//spotlight
const spotLight = new THREE.SpotLight(0xffffff);
scene.add(spotLight);
spotLight.position.set(-20, 20, 0);
spotLight.castShadow = true;
spotLight.angle = 0.2;

const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);

//GUI set up
const gui = new dat.GUI();
const options = {
    angle: 0.2,
    penumbra: 0,
    intensity: 1
};

gui.add(options, 'angle', 0, 1);
gui.add(options, 'penumbra', 0, 1);
gui.add(options, 'intensity', 0, 1);

function animate(){

    spotLight.angle = options.angle;
    spotLight.penumbra = options.penumbra;
    spotLight.intensity = options.intensity;
    spotLightHelper.update();

    renderer.render(scene, camera);
};

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})
