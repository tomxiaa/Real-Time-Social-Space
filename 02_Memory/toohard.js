import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { createNoise2D } from "simplex-noise";



//terrain
let simplex = new SimplexNoise(4);
function map(val, smin, smax, emin, emax) {
    const t = (val - smin) / (smax - smin)
    return (emax - emin) * t + emin
}
function noise(nx, ny) {
    return map(simplex.noise2D(nx, ny), -1, 1, 0, 1)
}
function octave(nx, ny, octaves) {
    let val = 0;
    let freq = 1;
    let max = 0;
    let amp = 1;
    for (let i = 0; i < octaves; i++) {
        val += noise(nx * ffreq, ny * freq) * amp;
        max += amp;
        amp /= 2;
        freq *= 2;
    }
    return val / max;
}

function generateTexture() {
    const canvas = document.getElementById('debug-canvas')
    const c = canvas.getContext('2d')
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)

    for (let i0; i < canvas.width; i++) {
        for (let j = 0; j < canvas.height; j++) {
            let v = octave(i / canvas.width, j / canvas.height, 16)
            const per = (100 * v).toFixed(2) + '%'
            c.fillStyle = `rgb(${per},${per},${per})`
            c.fillRect(i, j, 1, 1)
        }
    }
    return c.getImageData(0, 0, canvas.Width, canvas.height)
}

const geo = new THREE.PlaneGeometry(data.width, data.height,
    data.width, data.height + 1)
//assign vert data from the canvas
for (let j = 0; j < data.height; j++) {
    for (let i = 0; i < data.width; i++) {
        const n = (j * (data.height) + i)
        const nn = (j * (data.height + 1) + i)
        const col = data.data[n * 4] // the red channel
        const v1 = geo.vertices[nn]
        v1.z = map(col, 0, 255, -10, 10) //map from 0:255 to -10:10
        if (v1.z > 2.5) v1.z *= 1.3 //exaggerate the peaks
        // v1.x += map(Math.random(),0,1,-0.5,0.5) //jitter x
        // v1.y += map(Math.random(),0,1,-0.5,0.5) //jitter y
    }
}
