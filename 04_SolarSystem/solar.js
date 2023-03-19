import * as THREE from 'three';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// import texture mapping
const textureLoader = new THREE.TextureLoader();
const starTexture = textureLoader.load('./Img/star.png');
const sunTexture = textureLoader.load('./Img/sun.jpeg');
const mercuryTexture = textureLoader.load('./Img/mercury.jpeg');
const venusTexture = textureLoader.load('./Img/venus.jpeg');
const earthTexture = textureLoader.load('./Img/earth.jpeg');
const marsTexture = textureLoader.load('./Img/mars.jpeg');
const jupiterTexture = textureLoader.load('./Img/jupiter.jpeg');
const saturnTexture = textureLoader.load('./Img/saturn.jpeg');
const saturnRingTexture = textureLoader.load('./Img/saturn_ring.png');
const uranusTexture = textureLoader.load('./Img/uranus.jpeg');
const moonTexture = textureLoader.load('./Img/moon.jpeg');


//standard set up
const renderer = new THREE.WebGL1Renderer();

renderer.shadowMap.enabled = true;

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const ratio = window.innerWidth / window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, ratio, 0.1, 1000);
const orbit = new OrbitControls(camera, renderer.domElement);
camera.position.set(-90, 140, 140);
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

//ambient Lighting
const ambientLight = new THREE.AmbientLight(0xcccccc);
scene.add(ambientLight);

function createPlanet(size, texture, position, ring, satellite) {
    const Geo = new THREE.SphereGeometry(size, 30, 30);
    const Mat = new THREE.MeshStandardMaterial({
        map: texture
    });
    const mesh = new THREE.Mesh(Geo, Mat);
    const obj = new THREE.Object3D();
    obj.add(mesh);
    if (ring) {
        const ringGeo = new THREE.RingGeometry(
            ring.innerRadius,
            ring.outerRadius, 
            32);
        const ringMat = new THREE.MeshBasicMaterial({
            map: ring.texture,
            side: THREE.DoubleSide
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        obj.add(ringMesh);
        ringMesh.position.x = position;
        ringMesh.rotateX(-0.5 * Math.PI);
    }
    if (satellite) {
        const satGeo = new THREE.SphereGeometry(size/4, 30, 30);
        const satMat = new THREE.MeshBasicMaterial({
            map: satellite.texture
        });
        const satMesh = new THREE.Mesh(satGeo, satMat);
        mesh.add(satMesh);
        satMesh.position.x = 10;
    }
    scene.add(obj);
    mesh.position.x = position;
    return { mesh, obj }
}

const sun = createPlanet(16, sunTexture,1);
const mercury = createPlanet(3.2, mercuryTexture, 28);
const venus = createPlanet(5.8, venusTexture, 44);
const mars = createPlanet(4, marsTexture, 78);
const jupiter = createPlanet(12, jupiterTexture, 100);
const uranus = createPlanet(7, uranusTexture, 176);


const earth = createPlanet(6, earthTexture, 62,null,{
    texture: moonTexture
});


const saturn = createPlanet(10, saturnTexture, 138,{
    innerRadius: 10,
    outerRadius: 20,
    texture: saturnRingTexture
});

//point light
const pointLight = new THREE.PointLight(0xffffff, 2, 300);
scene.add(pointLight);


function animate() {
    //self rotation
    sun.mesh.rotateY(0.0004);
    venus.mesh.rotateY(0.0002);
    earth.mesh.rotateY(0.002);
    mars.mesh.rotateY(0.0018);
    jupiter.mesh.rotateY(0.004);
    uranus.mesh.rotateY(0.003);
    mercury.mesh.rotateY(0.0004);
    saturn.mesh.rotateY(0.0038);


    //around-sun rotation
    venus.obj.rotateY(0.015/2);
    earth.obj.rotateY(0.01/2);
    mars.obj.rotateY(0.008/2);
    jupiter.obj.rotateY(0.002/2);
    uranus.obj.rotateY(0.0004/2);
    mercury.obj.rotateY(0.04/2);
    saturn.obj.rotateY(0.0009/2);

    renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})
