import * as THREE from "three";


// export class MyBoxWithColor {
//     constructor(r, g, b, x, y, z, scene) {
//         let geo = new THREE.BoxGeometry(2, 2, 2);
//         let mat = new THREE.MeshBasicMaterial({ color: new THREE.Color(r, g, b) });

//         this.mesh = new THREE.Mesh(geo, mat);
//         this.mesh.position.set(x, y, z);
//         scene.add(this.mesh);
//     };

//     update(){
//         this.mesh.position.y += 0.04;
//     }
// }

export class MyCoolBox {
    constructor(x,y,z,scene) {
        let geo = new THREE.BoxGeometry(2,2,2);
        let mat = new THREE.MeshBasicMaterial({
            color: new THREE.Color(Math.random(), Math.random(), Math.random()),
        });

        this.mesh = new THREE.Mesh(geo, mat);
        this.mesh.position.set(x,y,z);

        scene.add(this.mesh);

        this.frameCount = 0;
    }

    update() {
        this.frameCount++;

        this.mesh.rotateX(0.01);
        this.mesh.rotateZ(0.01);
    }
}