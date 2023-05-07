import * as THREE from "three";

export class MyLighting {
    constructor(x, y, z, scene) {
        this.spotLight = new THREE.SpotLight(0xffffff);
        this.spotLight.position.set(x, y, z);
        this.spotLight.castShadow = true;
        this.spotLight.angle = 0.2;

        scene.add(this.spotLight);

        const spotLightHelper = new THREE.SpotLightHelper(this.spotLight);
        scene.add( spotLightHelper);

    }
}