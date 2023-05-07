import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
// import {GLTFLoader} from "https://cdn.rawgit.com/mrdoob/three.js/master/examples/jsm/loaders/GLTFLoader.js";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let scene, camera, renderer, plane, gltf;
let cowMesh, dummy;

let meshTest


let instances = 30;

let frameCount = 0;
const timeStep = 1 / 60;

function init() {
    scene = new THREE.Scene();
    // scene.add(new THREE.AxesHelper(5))
    //camera
    let aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    camera.position.z = 10;
    camera.position.x = -20;
    camera.position.y = 1;
    camera.lookAt(0, 0, 0);
    //renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    //gridhelper
    // let gridHelper = new THREE.GridHelper(10, 10);
    // scene.add(gridHelper);
    //orbitcontrol
    let controls = new OrbitControls(camera, renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 1));
    //ambientLight
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    scene.add(directionalLight);
    directionalLight.position.set(0, 50, 0);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;

    //pointlight
    const pointLight = new THREE.PointLight(0x00b3ff, 2)
    pointLight.position.x = -2;
    pointLight.position.y = 13;
    pointLight.position.z = -4;
    scene.add(pointLight);

    //terrain geometry
    const geometry = new THREE.PlaneGeometry(16, 16, 64, 64);
    //texture loader -V1
    const loader = new THREE.TextureLoader();
    const height = loader.load('../Image/height.png');
    const texture = loader.load('../Image/mountain.jpeg');
    const alpha = loader.load('../Image/alpha.png');
    const material = new THREE.MeshStandardMaterial({
        color: 'grey',
        map: texture,
        displacementMap: height,
        displacementScale: 3,
        alphaMap: alpha,
        transparent: true,
        depthTest: true,
        side: THREE.DoubleSide,
    })
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    mesh.rotation.x = 4.7;
    mesh.receiveShadow = true;

    addBackground();
    loadModel();
    loop();
}


function addBackground() {
    let backgroundColor = new THREE.Color(0xff91f9);
    renderer.setClearColor(backgroundColor);
}


function loadModel() {
    let loader = new GLTFLoader();
    loader.load('./Asset/Cow.gltf', function (gltf) {
        const test = gltf.scene;
        // console.log(test);

        const mesh = gltf.scene.getObjectByName("AnimalArmature");
        console.log(mesh);
        console.log(mesh.geometry)
        

        // const geo = mesh.geometry.clone();
        const geo = mesh.geometry.clone();
        const mat = mesh.material;
        var scale = 0.075;
        cowMesh = new THREE.InstancedMesh(geo, mat, instances);

        cowMesh.scale.set(scale, scale, scale);
        cowMesh.position.set(2, 0.63, -2);

        scene.add(cowMesh);
        // cowMesh.castShadow = true;

        // dummy = new THREE.Object3D();
        // for (let i = 0; i < instances; i++) {
        //     dummy.position.x = Math.random() * 5 - 5;
        //     dummy.position.y = Math.random() * 5 - 5;
        //     dummy.position.z = Math.random() * 5 - 5;

        //     dummy.updateMatrix();
        //     cowMesh.setMatrixAt(i, dummy.matrix);
        // }
    },
    function (xhr) {
            //   console.log("Chair " + (xhr.loaded / xhr.total) * 100 + "% loaded");
        },
        function (error) {
            console.log("An error happened with chair");
        }
    );

}

function loop() {
    frameCount++;

    // let elapsedTime = clock.getElapsedTime();
    // plane.rotateZ(0.005);
    // world.step(timeStep);
    //render
    renderer.render(scene, camera);
    window.requestAnimationFrame(loop);
}

init();