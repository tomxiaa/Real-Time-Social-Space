import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Water } from './Water2.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


THREE.ColorManagement.enabled = false; // TODO: Confirm correct color management.


let scene, camera, renderer, water, controls, clock;

const objects = [];
const mixers = [];

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
animate();

function init() {

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2( 0xffffff, 0.0035 );
    // scene.fog = new THREE.Fog( 0xcccccc, 1, 400);

    //clock
    clock = new THREE.Clock();

    let aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    camera.position.x = -15;
    camera.position.z = 20;
    camera.position.y = 0.5;
    camera.lookAt(0, 0, 10);

    renderer = new THREE.WebGL1Renderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    renderer.shadowMap.enabled = true;

    let gridHelper = new THREE.GridHelper(25, 25);
    gridHelper.position.y = -2;
    // scene.add(gridHelper);

    //orbit control
        // let controls = new OrbitControls(camera, renderer.domElement);
        // controls.minDistance = 10;
        // controls.maxDistance = 50;
        // controls.enablePan = false;
        // controls.enableDamping = true;
        // controls.dampingFactor = 0.05;
        // controls.maxPolarAngle = Math.PI / 2;

    //WASD PointerLockControls
    controls = new PointerLockControls( camera, document.body ); 

    const blocker = document.getElementById( 'blocker');
    const instructions = document.getElementById( 'instructions');

    instructions.addEventListener( 'click', function () {
        controls.lock();
    });

    controls.addEventListener( 'lock', function(){
        instructions.style.display = 'none';
        blocker.style.display = 'none';
    });

    controls.addEventListener( 'unlock', function(){
        blocker.style.display = 'block';
        instructions.style.display = '';
    });

    scene.add( controls.getObject() );

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

    raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, -1, 0), -10, 10 );


    //skybox
    var skyGeo = new THREE.SphereGeometry(500, 50, 50);
    //import skybox image mapping
    const loader = new THREE.TextureLoader();
    const skyTexture = loader.load('./Asset/pool.jpeg');
    var skyMaterial = new THREE.MeshPhongMaterial({
        map: skyTexture,
        side: THREE.DoubleSide,
    });

    var sky = new THREE.Mesh(skyGeo, skyMaterial);
    sky.position.y = 10;
    sky.material.side = THREE.DoubleSide;
    scene.add(sky);

    //ambient lighting
    const ambientLighting = new THREE.AmbientLight(0xcccccc, 0.2);
    scene.add(ambientLighting);

    //directionalLighting1
    // const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    // directionalLight.position.set(-1, 1, 1);
    // scene.add(directionalLight);

    //directionalLighting2
    const dirLight = new THREE.DirectionalLight( 0xfce895, 0.5 );
    dirLight.color.setHSL( 0.1, 1, 0.95 );
    dirLight.position.set( -1, 1.75, 1 );
    dirLight.position.multiplyScalar( 30 );
    scene.add( dirLight );

    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;

    const d = 50;

    dirLight.shadow.camera.left = - d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = - d;

    dirLight.shadow.camera.far = 3500;
    dirLight.shadow.bias = - 0.0001;

    //hemiLight
    const hemiLight = new THREE.HemisphereLight ( 0xffffff, 0xffffff, 0.5 );
    hemiLight.color.setHSL( 0.6, 1, 0.6 );
    hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
    hemiLight.position.set( 0, 50, 0 );
    scene.add( hemiLight );

    //water
    const waterGeometry = new THREE.PlaneGeometry(800, 800);

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

    //Tile
    const tileGeo = new THREE.PlaneGeometry( 800, 800 );
    const tileTexture = loader.load('./Asset/tile.jpeg');
    tileTexture.wrapS = THREE.RepeatWrapping;
    tileTexture.wrapT = THREE.RepeatWrapping;
    tileTexture.repeat.set( 6, 12 );

    var tileMat = new THREE.MeshPhongMaterial({
        map: tileTexture,
        side: THREE.DoubleSide,
    });
    const tile = new THREE.Mesh( tileGeo, tileMat);
    tile.rotation.x = Math.PI * - 0.5;
    tile.position.y = -10;
    scene.add( tile );

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

    //Import ANIMALS

    const gltfLoader = new GLTFLoader();

    gltfLoader.load( './Asset/Zebra.gltf', function (gltf) {
        const mesh = gltf.scene.children[ 0 ];

        const s = 2;
        mesh.scale.set( s, s, s );
        mesh.position.y = -8;
        mesh.rotation.y = - 1;

        mesh.castShadow = true;
        mesh.receiveShadow = true;

        scene.add(mesh);

        const mixer = new THREE.AnimationMixer( mesh );
        mixer.clipAction( gltf.animations[ 0 ]).setDuration( 4 ).play();
        mixers.push( mixer );
    })

    window.addEventListener('resize', onWindowResize);
}



function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}


function animate() {

    requestAnimationFrame( animate );

    const time = performance.now();


    //controls
    if ( controls.isLocked === true ) {

        raycaster.ray.origin.copy( controls.getObject().position );
        raycaster.ray.origin.y -= 10;

        const intersections = raycaster.intersectObjects( objects, false );

        const onObject = intersections.length > 0;

        const delta = ( time - prevTime ) / 1000;

        velocity.x -= velocity.x * 3.0 * delta; //2.0 is speed factor
        velocity.z -= velocity.z * 3.0 * delta;

        velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

        direction.z = Number( moveForward ) - Number( moveBackward );
        direction.x = Number( moveRight ) - Number( moveLeft );
        direction.normalize(); // this ensures consistent movements in all directions

        if ( moveForward || moveBackward ) velocity.z -= direction.z * 400.0 * delta;
        if ( moveLeft || moveRight ) velocity.x -= direction.x * 400.0 * delta;

        if ( onObject === true ) {

            velocity.y = Math.max( 0, velocity.y );
            canJump = true;

        }

        controls.moveRight( - velocity.x * delta );
        controls.moveForward( - velocity.z * delta );

        controls.getObject().position.y += ( velocity.y * delta ); // new behavior

        if ( controls.getObject().position.y < 1 ) {

            velocity.y = 0;
            controls.getObject().position.y = 1;

            canJump = true;

        }
    }
    prevTime = time;
    render();
}

function render() {

    const delta = clock.getDelta();

    for ( let i = 0; i < mixers.length; i++ ){
        mixers[i].update( delta );
    }

    // controls.update( delta );
    renderer.render(scene, camera);
}

