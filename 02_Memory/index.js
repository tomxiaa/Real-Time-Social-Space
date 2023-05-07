import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
// import {GLTFLoader} from "https://cdn.rawgit.com/mrdoob/three.js/master/examples/jsm/loaders/GLTFLoader.js";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as CANNON from "https://unpkg.com/cannon-es@0.19.0/dist/cannon-es.js";


let scene, camera, renderer, plane, gltf;
let frameCount = 0;

// const world = new CANNON.World({
//     gravity: new CANNON.Vec3(0, -9.81, 0)
// })
// const timeStep = 1/60; 

function init() {
    //scene
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

    addBackground();
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

    // GUI
    const gui = new GUI();
    gui.add(mesh.rotation, 'z').min(0).max(10);

    //texture loader -V2
    // const geometry = new THREE.PlaneGeometry(16, 16, 64, 64);
    // const material = new THREE.MeshPhongMaterial();
    // const texture = new THREE.TextureLoader().load('../Image/mountain.jpeg');
    // material.map = texture;
    // const displacementMap = new THREE.TextureLoader().load('../Image/height.png');
    // material.displacementMap = displacementMap;
    // plane = new THREE.Mesh(geometry, material);
    // scene.add(plane);
    // plane.rotation.x = 4.7;

    //ambienLight
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
    gui.add(pointLight.position, 'x')
    gui.add(pointLight.position, 'y')
    gui.add(pointLight.position, 'z')
    
    const col = { color: '#FCFBE3' }
    gui.addColor(col, 'color').onChange(() => {
        pointLight.color.set(col.color)
    })
    loadModel();
    loop();

    //Gravity
<<<<<<< HEAD
    // const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -9.81, 0) });

    // const planePhysMat = new CANNON.Material();
    // const planeBody = new CANNON.body({
    //     type: CANNON.body.Static,
    //     shape: new CANNON.Box(new CANNON.Vec3(5, 5, 0.001)),
    //     material: planePhysMat
    // })
    // planeBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    // world.addBody(planeBody);

    // const mouse = new THREE.Vector2();
    // const intersectionPoint = new THREE.Vector3();
    // const planeNormal = new THREE.Vector3();
    // const plane = new THREE.plane();
    // const raycaster = new THREE.Raycaster();

    // window.addEventListener("mousemove", function (e){
    // mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    // mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    // planeNormal.copy(camera.position).normalize();
    // plane.setFromNormalAndCoplanarPoint(planeNormal, scene.position);
    // raycaster.setFromCamera(mouse, camera);
    // raycaster.ray.intersectPlane(plane, intersectionPoint);
    // });

    // const meshes = [];
    // const bodies = [];

    // window.addEventListener("click", function (e) {
    //     const sphereGeo = new THREE.SphereGeometry(0.125, 30, 30);
    //     const sphereMat = new THREE.MeshStandardMaterial({
    //       color: Math.random() * 0xffffff,
    //       metalness: 0,
    //       roughness: 0
    //     });
    //     const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    //     scene.add(sphereMesh);
    //     //sphereMesh.position.copy(intersectionPoint);
    //     sphereMesh.castShadow = true;
      
    //     const spherePhysMat = new CANNON.Material();
    //     const sphereBody = new CANNON.Body({
    //       mass: 0.3,
    //       shape: new CANNON.Sphere(0.125),
    //       position: new CANNON.Vec3(
    //         intersectionPoint.x,
    //         intersectionPoint.y,
    //         intersectionPoint.z
    //       ),
    //       material: spherePhysMat
    //     });
    //     world.addBody(sphereBody);
      
    //     const planeSphereContactMat = new CANNON.ContactMaterial(
    //       planePhysMat,
    //       spherePhysMat,
    //       { restitution: 0.3 }
    //     );
      
    //     world.addContactMaterial(planeSphereContactMat);
      
    //     meshes.push(sphereMesh);
    //     bodies.push(sphereBody);
    //   });
=======
    const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -9.81, 0) });

    const planePhysMat = new CANNON.Material();
    const planeBody = new CANNON.body({
        type: CANNON.body.Static,
        shape: new CANNON.Box(new CANNON.Vec3(5, 5, 0.001)),
        material: planePhysMat
    })
    planeBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    world.addBody(planeBody);

    const mouse = new THREE.Vector2();
    const intersectionPoint = new THREE.Vector3();
    const planeNormal = new THREE.Vector3();
    const plane = new THREE.plane();
    const raycaster = new THREE.Raycaster();

    window.addEventListener("mousemove", function (e){
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    planeNormal.copy(camera.position).normalize();
    plane.setFromNormalAndCoplanarPoint(planeNormal, scene.position);
    raycaster.setFromCamera(mouse, camera);
    raycaster.ray.intersectPlane(plane, intersectionPoint);
    });

    const meshes = [];
    const bodies = [];

    window.addEventListener("click", function (e) {
        const sphereGeo = new THREE.SphereGeometry(0.125, 30, 30);
        const sphereMat = new THREE.MeshStandardMaterial({
          color: Math.random() * 0xffffff,
          metalness: 0,
          roughness: 0
        });
        const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
        scene.add(sphereMesh);
        //sphereMesh.position.copy(intersectionPoint);
        sphereMesh.castShadow = true;
      
        const spherePhysMat = new CANNON.Material();
        const sphereBody = new CANNON.Body({
          mass: 0.3,
          shape: new CANNON.Sphere(0.125),
          position: new CANNON.Vec3(
            intersectionPoint.x,
            intersectionPoint.y,
            intersectionPoint.z
          ),
          material: spherePhysMat
        });
        world.addBody(sphereBody);
      
        const planeSphereContactMat = new CANNON.ContactMaterial(
          planePhysMat,
          spherePhysMat,
          { restitution: 0.3 }
        );
      
        world.addContactMaterial(planeSphereContactMat);
      
        meshes.push(sphereMesh);
        bodies.push(sphereBody);
      });
>>>>>>> origin

}

//background color
function addBackground(){
    let backgroundColor = new THREE.Color(0xff91f9);
    renderer.setClearColor(backgroundColor);
}
<<<<<<< HEAD

function loadModel(){
    let loader = new GLTFLoader();
       loader.load('./Asset/milkcow.gltf', function (gltf) {
=======
// const cow = new THREE.Object3D();
// const cow2 = new THREE.Object3D();
// let loader = new GLTFLoader();
//        loader.load('./Asset/Cow.gltf', loadModel);
// function loadModel(gltf){
//     const box = new THREE.Box3().setFromObject(gltf.scene);
//     const c = box.getCenter( new THREE.Vector3());
//     const size = box.getSize( new THREE.Vector3());
//     gltf.scene.position.set(-c.x, size.y / 2 - c.y, -c.z);
//     cow.add(gltf.scene);
//     cow2.add(gltf.scene.clone());
// }

// cow.scale.set( 1, 1, 1 ); // because gltf.scene is very big
// cow.position.set( 1, 1.5, 0 );
// cow.rotation.y = Math.PI;
// scene.add( cow );

// cow2.scale.set( 2, 2, 2 ); // because gltf.scene is very big
// cow2.position.set( 0,1.25,0);
// cow2.rotation.x = 0.8; // radiant

// scene.add( cow2 );

function loadModel(){
    let mixer;
    let loader = new GLTFLoader();
       loader.load('./Asset/Cow.gltf', function (gltf) {
>>>>>>> origin
           let model = gltf.scene;
           var scale = 0.075;
           model.scale.set(scale,scale,scale);
           model.position.set(2,0.63,-2);
           model.castShaow = true;
           scene.add(model);
       });
}



const clock = new THREE.Clock();

function loop() {
    frameCount++;

    let elapsedTime = clock.getElapsedTime();
    // plane.rotateZ(0.005);
    world.step(timeStep);
    //render
    renderer.render(scene, camera);
    window.requestAnimationFrame(loop);
}

init();