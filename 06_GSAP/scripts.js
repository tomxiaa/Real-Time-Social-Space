import * as THREE from 'three';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import * as CANNON from "https://unpkg.com/cannon-es@0.19.0/dist/cannon-es.js";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import Stats from 'three/addons/libs/stats.module.js';
import SkeletonUtils from './SkeletonUtils.js';

import { MyLighting } from './lighting.js';



//standard scene set up
const renderer = new THREE.WebGL1Renderer({ antialias: true });

renderer.shadowMap.enabled = true;

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const ratio = window.innerWidth / window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, ratio, 0.1, 1000);
// const orbit = new OrbitControls(camera, renderer.domElement);
// orbit.update();
camera.position.set(10, 0, 20);
camera.lookAt(0,0,0);


const cubetextureLoader = new THREE.CubeTextureLoader();
scene.background = cubetextureLoader.load([
    './Img/stars.png',
    './Img/stars.png',
    './Img/stars.png',
    './Img/stars.png',
    './Img/stars.png',
    './Img/stars.png'
]);

//ambient lighting
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

//directional lighting
const direcitonalLight = new THREE.DirectionalLight(0xffffff, 0.8);
scene.add(direcitonalLight);
direcitonalLight.position.set(10, 50, 10);
direcitonalLight.castShadow = true;
const directionLightHelper = new THREE.DirectionalLightHelper(direcitonalLight);
scene.add(directionLightHelper);

//grid helper
const grid = new THREE.GridHelper(50, 50);
scene.add(grid);

//ground plane
const groundGeo = new THREE.PlaneGeometry(50, 50);
const groundMat = new THREE.MeshStandardMaterial({
    color: 0xcccccc,
    side: THREE.DoubleSide
});
const groundMesh = new THREE.Mesh(groundGeo, groundMat);
groundMesh.rotation.set(Math.PI / 2,0,0);
scene.add(groundMesh);
groundMesh.receiveShadow = true;

//load 3d model
const assetLoader = new GLTFLoader();

let mixer;
let cow;
assetLoader.load('./Asset/Cow.gltf', function (gltf) {
    const model = gltf.scene;
    model.scale.set(0.5, 0.5, 0.5);
    scene.add(model);
    cow = model;
    model.receiveShadow = true;
    model.castShadow = true;
    // console.log(cow.material);

    mixer = new THREE.AnimationMixer(model);
    const clips = gltf.animations;
    clips.forEach(function(clip){
        const action = mixer.clipAction(clip);
        action.play();
    });

    window.addEventListener('keyup', cameraAnimation);

});

const tl = gsap.timeline();
const duration = 8;
const ease = 'none';
let animationIsFinished = false;

function cameraAnimation(){
    if(!animationIsFinished) {
        animationIsFinished = true;

        tl.to(camera.position, {
            x: 0,
            duration,
            ease
        })

        .to(camera.position, {
            y: 40,
            z: 30,
            duration,
            ease,
            onUpdate: function() {
                camera.lookAt(0,0,0);
            }
        }, 8)

        .to(camera.position, {
            x: -10,
            y: 15,
            z: 10,
            duration,
            ease,
            onUpdate: function() {
                camera.lookAt(0,0,0);
            }
        }, 16)
    }
}

//calling spotlight class
let light1;
function addLight(){
    light1 = new MyLighting(-20,20,0,scene);
}
addLight();

const clock = new THREE.Clock();
function animate() {


    if(mixer)
        mixer.update(clock.getDelta());

    renderer.render(scene, camera);
    
}


renderer.setAnimationLoop(animate);

window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})