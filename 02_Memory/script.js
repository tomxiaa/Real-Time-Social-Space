import './style.css';
import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

const gui = new GUI();
gui.add(plane.rotation, 'x', 0, 1 );
gui.add(material, 'metalness', 0, 1);
gui.add(renderer, 'toneMappingExposure', 0, 2).name('exposure');

// const canvas = document.querySelector('canvas.webgl')

const scene = new THREE.Scene();

//object
const geometry = new THREE.PlaneBufferGeometry(3, 3, 64, 64);


//Material
const material = new THREE.MeshStandardMaterial({
    color: 'grey'
})

//Mesh
const plane = new THREE.Mesh(geometry, material);
scene.add(plane);

//Lights

const pointLight = new THREE.PointLight(0xffffff, 0.1);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);



