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

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

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

//spotlight
const spotLight = new THREE.SpotLight(0xffffff);
scene.add(spotLight);
spotLight.position.set(-100, 100, 0);
spotLight.castShadow = true;
spotLight.angle = 0.2;

const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);

//grid helper
const grid = new THREE.GridHelper(50, 50);
scene.add(grid);

//ground plane with gravity
const groundGeo = new THREE.PlaneGeometry(50, 50);
const groundMat = new THREE.MeshBasicMaterial({
    color: 0xcccccc,
    side: THREE.DoubleSide,
    wireframe: false
});
const groundMesh = new THREE.Mesh(groundGeo, groundMat);
scene.add(groundMesh);
groundMesh.receiveShadow = true;

const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -7, 0)
});

const groundPhyMat = new CANNON.Material();

const groundBody = new CANNON.Body({
    shape: new CANNON.Box(new CANNON.Vec3(50,50,0.01)),
    // mass: 10,
    type: CANNON.Body.STATIC,
    material: groundPhyMat
});
world.addBody(groundBody);
groundBody.quaternion.setFromEuler(- Math.PI / 2, 0, 0);

//load 3d model
const assetLoader = new GLTFLoader();

let cow;
assetLoader.load('./Asset/Cow.gltf', function(gltf) {
    const model = gltf.scene;
    model.scale.set(0.5, 0.5, 0.5);
    scene.add(model);
    cow = model;
    clips = gltf.animations;
}, undefined, function(error) {
    console.error(error);
});

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


//raycaster
const mouse = new THREE.Vector2();
const intersectionPoint = new THREE.Vector3();
const planeNormal = new THREE.Vector3();
const plane = new THREE.Plane();
const raycaster = new THREE.Raycaster();

const meshes = [];
const bodies = [];

window.addEventListener('click', function(e){
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (e.clientY / window.innerHeight) *2 + 1;
    planeNormal.copy(camera.position).normalize();
    plane.setFromNormalAndCoplanarPoint(planeNormal, scene.position);
    raycaster.setFromCamera(mouse, camera);
    raycaster.ray.intersectPlane(plane, intersectionPoint);

    // const ballGeo = new THREE.SphereGeometry(0.4, 30, 30);
    // const ballMat = new THREE.MeshStandardMaterial({
    //     color: 0xff00ff,
    //     metalness: 0.1,
    //     roughness: 0
    // });
    // const ballMesh = new THREE.Mesh(ballGeo, ballMat);
    // scene.add(ballMesh);
    // ballMesh.position.copy(intersectionPoint);
    scene.add(cow);

    const cowBody = new CANNON.Body({
        mass:0.3,
        shape: new CANNON.Box(new CANNON.Vec3(0.5,1,2)),
        position: new CANNON.Vec3(intersectionPoint.x, intersectionPoint.y, intersectionPoint.z)
    });
    world.addBody(cowBody);
    meshes.push(cow);
    bodies.push(cowBody);

    const cowClone = cowBody.clone();
    cowClone.position.copy(cowBody.position);
    scene.add(cowClone);


    // const ballBody = new CANNON.Body({
    //     mass: 0.3,
    //     shape: new CANNON.Sphere(0.4),
    //     position: new CANNON.Vec3(intersectionPoint.x, intersectionPoint.y, intersectionPoint.z)
    // });
    // world.addBody(ballBody);

    // meshes.push(ballMesh);
    // bodies.push(ballBody);
});

const timeStep = 1/60;

function animate(){

    spotLight.angle = options.angle;
    spotLight.penumbra = options.penumbra;
    spotLight.intensity = options.intensity;
    spotLightHelper.update();

    world.step(timeStep);

    for (let i = 0; i < meshes.length; i ++){
        meshes[i].position.copy(bodies[i].position);
        meshes[i].quaternion.copy(bodies[i].quaternion);
    }

    groundMesh.position.copy(groundBody.position);
    groundMesh.quaternion.copy(groundBody.quaternion);

    renderer.render(scene, camera);
}


renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})
