import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Water } from './Water2.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';


THREE.ColorManagement.enabled = false; // TODO: Confirm correct color management.


let scene, camera, renderer, water;

let controls, clock;

let controller, controllerBox;
let controllerOldPosition = new THREE.Vector3();

let raycaster;

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const vertex = new THREE.Vector3();


const params = {
    color: '#ffffff',
    scale: 4,
    flowX: 1,
    flowY: 1
};

init();
loop();

function init() {

    scene = new THREE.Scene();
    // scene.fog = new THREE.FogExp2( 0xaaccff, 0.01 );
    scene.fog = new THREE.Fog( 0xcccccc, 1, 140);

    //clock
    clock = new THREE.Clock();

    let aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    camera.position.x = -5;
    camera.position.z = 8;
    camera.position.y = 0.5;
    camera.lookAt(0, 0, 0);

    // renderer.shadowMap.enabled = true;

    renderer = new THREE.WebGL1Renderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    let gridHelper = new THREE.GridHelper(25, 25);
    gridHelper.position.y = -1;
    // scene.add(gridHelper);

    //orbit control
        let controls = new OrbitControls(camera, renderer.domElement);
        controls.minDistance = 10;
        controls.maxDistance = 50;
        controls.enablePan = false;
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.maxPolarAngle = Math.PI / 2;

    //first-person-control
        // controls = new FirstPersonControls( camera, renderer.domElement );
        // controls.movementSpeed = 100;
        // controls.lookSpeed = 0.1;


    //WASD control
    controls = new PointerLockControls( camera, document.body); 

    const onKeyDown = function ( event ) {
        switch ( event.code ) {
            case 'KeyW':
                    moveForward = true;
                    break;
            case 'KeyA':
                    moveLeft = true;
                    break;
            case 'KeyS':
                    moveBackward = true;
                    break;
            case 'KeyD':
                    moveRight = true;
                    break;
        }
    };

    const onKeyUp = function ( event ) {
        switch (event.code) {
            case 'KeyW':
                    moveForward = false;
                    break;
            case 'KeyA':
                    moveLeft = false;
                    break;
            case 'KeyS':
                    moveBackward = false;
                    break;
            case 'KeyD':
                    moveRight = false;
                    break;
        }
    };

    document.addEventListener( 'keydown', onKeyDown );
    document.addEventListener( 'keyup', onKeyUp );

    raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, -1, 0), 0, 10 );


    //skybox
    var skyGeo = new THREE.SphereGeometry(100, 25, 25);
    //import skybox image mapping
    const loader = new THREE.TextureLoader();
    const skyTexture = loader.load('./Asset/pool.jpeg');
    var skyMaterial = new THREE.MeshPhongMaterial({
        map: skyTexture,
        side: THREE.DoubleSide,
    });

    var sky = new THREE.Mesh(skyGeo, skyMaterial);
    sky.material.side = THREE.DoubleSide;
    scene.add(sky);

    //ambient lighting
    const ambientLighting = new THREE.AmbientLight(0xcccccc, 0.4);
    scene.add(ambientLighting);

    //directionalLighting
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(-1, 1, 1);
    scene.add(directionalLight);

    //box
    // const boxGeo = new THREE.BoxGeometry(1,1,1,1,1,1);
    // const boxMat = new THREE.MeshBasicMaterial({color: 0xccaaff});
    // const box = new THREE.Mesh(boxGeo, boxMat);
    // scene.add(box);

    //water
    const waterGeometry = new THREE.PlaneGeometry(200, 200);

    water = new Water(waterGeometry, {
        color: params.color,
        scale: params.scale,
        flowDirection: new THREE.Vector2(params.flowX, params.flowY),
        textureWidth: 1024,
        textureHeight: 1024
    });

    water.position.y = -2;
    water.rotation.x = Math.PI * - 0.5;
    scene.add(water);

    // GUI
    const gui = new GUI();
    gui.add(params, 'scale', 1, 10).onChange(function (value) {
        water.material.uniforms['config'].value.w = value;
    });

    gui.add(params, 'flowX', - 1, 1).step(0.01).onChange(function (value) {
        water.material.uniforms['flowDirection'].value.x = value;
        water.material.uniforms['flowDirection'].value.normalize();
    });

    gui.add(params, 'flowY', - 1, 1).step(0.01).onChange(function (value) {
        water.material.uniforms['flowDirection'].value.y = value;
        water.material.uniforms['flowDirection'].value.normalize();
    });

    gui.open();

    window.addEventListener('resize', onWindowResize);

    loop();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function createController() {
    let controllerGeo = new THREE.SphereGeometry(0.2, 16, 16);
    controller = new THREE.Mesh( controllerGeo, new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: true }));
    scene.add(controller);

    controller.geometry.computeBoundingBox();
    controllerBox = new THREE.Box3();

    let helper = new THREE.Box3Helper(controllerBox);
    scene.add(helper);
}

function moveController(e) {

    switch (e.key) {
        case 'KeyA':
            controller.position.x -= 2;
            break;
        case 'KeyW':
            controller.position.z -= 2;
            break;
        case 'KeyD':
            controller.position.x += 2;
            break;
        case 'KeyS':
            controller.position.z += 2;
            break;
    }
}

function checkCollision(e) {
    controllerOldPosition.copy(controller.position);

    moveController(e);

    controller.updateProjectionMatrix();

    controllerBox.copy(controller.geometry.boundingBox).applyMatrix4(controller.matrixWorld);
}

function loop() {

    const cameraOffset = new THREE.Vector3(0, 3, 8);
    camera.position.copy(controller.position).add(cameraOffset);
    camera.lookAt(controller.position);
    camera.updateProjectionMatrix();


    renderer.render(scene, camera);

    window.requestAnimationFrame(loop);

    render();
}

function render() {

    const delta = clock.getDelta();

    controls.update( delta );
    renderer.render(scene, camera);
}

