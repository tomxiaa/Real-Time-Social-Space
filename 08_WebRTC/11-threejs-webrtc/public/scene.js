import * as THREE from "three";
import { FirstPersonControls } from "./libraries/firstPersonControls.js";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Water } from './Water2.js';

const clock = new THREE.Clock();
let mixers = [];


export class MyScene {
  constructor() {
    this.avatars = {};

    // create a scene in which all other objects will exist
    this.scene = new THREE.Scene();

    this.scene.fog = new THREE.FogExp2(0xffffff, 0.002);

    // create a camera and position it in space
    let aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    this.camera.position.z = 20; // place the camera in space
    this.camera.position.y = -6;
    this.camera.lookAt(0, 0, 10);

    // the renderer will actually show the camera view within our <canvas>
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    // add shadows
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

    // add orbit controls
    this.controls = new FirstPersonControls(
      this.scene,
      this.camera,
      this.renderer
    );
    this.controls.lookSpeed = 0.1;
    this.controls.movementSpeed = 10;

    this.setupEnvironment();

    this.addBackgroundSound();

    this.addWater();

    this.addFloorTile();

    this.frameCount = 0;

    this.loop();
  }

  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////
  // Lighting 💡

  setupEnvironment() {

    //skyBox
    let skyGeo = new THREE.SphereGeometry(500, 50, 50);

    let textureLoader = new THREE.TextureLoader();
    let skyTexture = textureLoader.load('./Asset/pool.jpeg ');
    var skyMaterial = new THREE.MeshPhongMaterial({
      map: skyTexture,
      side: THREE.DoubleSide,
    })

    var sky = new THREE.Mesh(skyGeo, skyMaterial);
    sky.position.y = 10;
    sky.material.side = THREE.DoubleSide;
    this.scene.add(sky);

    //add a light
    let ambientLight = new THREE.AmbientLight(0xcccccc, 0.2);
    this.scene.add(ambientLight);

    //directionalLighting2
    const dirLight = new THREE.DirectionalLight(0xfce895, 0.5);
    dirLight.color.setHSL(0.1, 1, 0.95);
    dirLight.position.set(-1, 1.75, 1);
    dirLight.position.multiplyScalar(30);
    this.scene.add(dirLight);

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
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.9);
    hemiLight.color.setHSL(0.6, 1, 0.6);
    hemiLight.groundColor.setHSL(0.095, 1, 0.75);
    hemiLight.position.set(0, 50, 0);
    this.scene.add(hemiLight);
  }

  addFloorTile() {
    let textureLoader = new THREE.TextureLoader();

    const tileGeo = new THREE.PlaneGeometry(800, 800);
    const tileTexture = textureLoader.load(' ./Asset/tile.jpeg');
    tileTexture.wrapS = THREE.RepeatWrapping;
    tileTexture.wrapT = THREE.RepeatWrapping;
    tileTexture.repeat.set(6, 12);

    var tileMat = new THREE.MeshPhongMaterial({
      map: tileTexture,
      side: THREE.DoubleSide
    });

    const tile = new THREE.Mesh(tileGeo, tileMat);
    tile.rotation.x = Math.PI * - 0.5;
    tile.position.y = -10;

    this.scene.add(tile);
  }

  addWater() {
    let params = {
      color: '#ffffff',
      scale: 4,
      flowX: 1,
      flowY: 1
    };

    let waterGeometry = new THREE.PlaneGeometry(800, 800);

    const water = new Water(waterGeometry, {
      color: params.color,
      scale: params.scale,
      flowDirection: new THREE.Vector2(params.flowX, params.flowY),
      textureWidth: 1024,
      textureHeight: 1024
    });

    water.position.y = 0;
    water.rotation.x = Math.PI * - 0.5;
    this.scene.add(water);

  }

  addBackgroundSound() {
    const listener = new THREE.AudioListener();
    this.camera.add(listener);

    const sound = new THREE.Audio(listener);

    const audioLoader = new THREE.AudioLoader();
    audioLoader.load(' ./Asset/water.wav', function (buffer) {
      sound.setBuffer(buffer);
      sound.setLoop(true);
      sound.setVolume(0.2);
      sound.play();
    });
  }
  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////
  // Peers 👫

  addPeerAvatar(id) {
    this.avatars[id] = {};

//////////////////////////////// This is Working well 
    // var modelPaths = [
    //   ' ./Asset/Cow.gltf ',
    //   ' ./Asset/Zebra.gltf ',
    //   ' ./Asset/Pig.gltf ',
    //   ' ./Asset/Llama.gltf ',
    //   ' ./Asset/Sheep.gltf ',
    //   ' ./Asset/Pug.gltf ',
    // ];

    // let loader = new GLTFLoader();
    // let head;

    // var randomIndex = Math.floor(Math.random() * modelPaths.length);

    // loader.load(modelPaths[randomIndex], (gltf) => {
    //   head = gltf.scene.children[0];

    //   let s = 1.25;
    //   head.scale.set(s, s, s);
    //   head.rotation.y = Math.PI;
    //   head.position.y = -5;

    //   group.add(head);
    //   console.log('adding head to the scene')
    // });
///////////////////////////////////////////////////////////////

    // var randomIndex = Math.floor(Math.random() * modelPaths.length);

    // loader.load(modelPaths[randomIndex], (gltf) => {
    //   head = gltf.scene.children[0];

    //   console.log(gltf);
    //   console.log(head);

    //       const bbox = new THREE.Box3().setFromObject(head);

    //       const center = new THREE.Vector3();
    //       bbox.getCenter(center);

    //       console.log(center);

    //       head.position.sub(center);

    //       let randomX = Math.random() * 400-200;
    //       console.log(randomX);

    //       // center.position.x = randomX;
    //       // head.position.x = 100;
    //       center.rotation.y = Math.PI;
    //       center.position.y = -5;



    //       this.camera.position.copy(center);

    //       this.controls.lookAt(center);


    //       group.add(head);
    //       console.log('adding a random animal to the scene')
    // });

    /////////////////////////// loader model with empty box for center correction

    // let randomX = Math.random() * 400-200;

    // loader.load(modelPaths[randomIndex], (gltf) => {
    //   head = gltf.scene;

    //   const bbox = new THREE.Box3().setFromObject(head);

    //   const center = new THREE.Vector3();
    //   bbox.getCenter(center);

    //   const parent = new THREE.Object3D();
    //   group.add(parent);

    //   parent.add(head);
    //   head.position.sub(center);

    //   parent.add(this.camera);

    //   this.camera.position.set(0,0,0);

    //   // this.controls.target.copy(center);
    //   this.controls.update();
    // });
    ///////////////////////////////////////////////////////////


    //load model and audio

    let loader = new GLTFLoader();
    let audioLoader = new THREE.AudioLoader();
    let listener = new THREE.AudioListener();

    const models = [
      {
        modelFile: ' ./Asset/Cow.gltf ',
        audioFile: ' ./Asset/cow.wav ',
        audio: null,
        model: null
      },
      {
        modelFile: ' ./Asset/Pig.gltf ',
        audioFile: ' ./Asset/pig.wav ',
        audio: null,
        model: null
      },
      {
        modelFile: ' ./Asset/Pug.gltf ',
        audioFile: ' ./Asset/pug.wav ',
        audio: null,
        model: null
      },
      {
        modelFile: ' ./Asset/Llama.gltf ',
        audioFile: ' ./Asset/llama.wav ',
        audio: null,
        model: null
      },
      {
        modelFile: ' ./Asset/Horse.gltf ',
        audioFile: ' ./Asset/horse.wav ',
        audio: null,
        model: null
      },
      {
        modelFile: ' ./Asset/Sheep.gltf ',
        audioFile: ' ./Asset/sheep.flac ',
        audio: null,
        model: null
      }
    ];

    var randomIndex = Math.floor(Math.random() * models.length);
    var randomModel = models[randomIndex];

    loader.load(randomModel.modelFile, (gltf) => {
        randomModel.model = gltf.scene;
        audioLoader.load(randomModel.audioFile, (buffer) => {

          let s = 1.25;
          randomModel.model.scale.set(s, s, s);
          randomModel.model.rotation.y = Math.PI;
          randomModel.model.position.y = -5;

          randomModel.audio = new THREE.PositionalAudio(listener);
          randomModel.audio.setBuffer(buffer);
          randomModel.model.add(randomModel.audio);
          randomModel.audio.setLoop(true);
          randomModel.audio.setVolume(1);
          randomModel.audio.play();

          const mixer = new THREE.AnimationMixer( randomModel.model );
          mixer.clipAction( gltf.animations[ 0 ]).setDuration( 3 ).play();
          mixers.push( mixer );
        });
        group.add(randomModel.model);

      });

    // set position of head before adding to parent object

    // https://threejs.org/docs/index.html#api/en/objects/Group
    var group = new THREE.Group();
    // this.camera.lookAt(new THREE.Vector3(group.position));

    // add group to scene
    this.scene.add(group);

    this.avatars[id].group = group;
  }




  removePeerAvatar(id) {
    console.log("Removing peer avatar from 3D scene.");
    this.scene.remove(this.avatars[id].group);
    delete this.avatars[id];
  }

  updatePeerAvatars(peerInfoFromServer) {
    for (let id in peerInfoFromServer) {
      if (this.avatars[id]) {
        let pos = peerInfoFromServer[id].position;
        let rot = peerInfoFromServer[id].rotation;

        this.avatars[id].group.position.set(pos[0], pos[1], pos[2]);
        this.avatars[id].group.quaternion.set(rot[0], rot[1], rot[2], rot[3]);
      }
    }
  }

  updateClientVolumes() {
    for (let id in this.avatars) {
      let audioEl = document.getElementById(id + "_audio");
      if (audioEl && this.avatars[id].group) {
        let distSquared = this.camera.position.distanceToSquared(
          this.avatars[id].group.position
        );

        if (distSquared > 500) {
          audioEl.volume = 1;
        } else {
          // https://discourse.threejs.org/t/positionalaudio-setmediastreamsource-with-webrtc-question-not-hearing-any-sound/14301/29
          let volume = Math.min(1, 10 / distSquared);
          audioEl.volume = volume;
        }
      }
    }
  }

  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////
  // Interaction 🤾‍♀️

  getPlayerPosition() {
    return [
      [this.camera.position.x, this.camera.position.y, this.camera.position.z],
      [
        this.camera.quaternion._x,
        this.camera.quaternion._y,
        this.camera.quaternion._z,
        this.camera.quaternion._w,
      ],
    ];
  }

  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////
  // Rendering 🎥

  loop() {
    this.frameCount++;

    this.controls.update();

    //make animal animation 
    const delta = clock.getDelta();
    for ( let i = 0; i < mixers.length; i++ ){
      mixers[i].update( delta );
  }

    //camera hovering movement
    let hoverSpeed = 0.01;
    let hoverDistance = 3;
    let hoverPhase = 0;

    if(hoverPhase > Math.PI *2) {
      hoverPhase -= Math.PI *2;
    }

    this.camera.position.y = Math.sin(hoverPhase) * hoverDistance;





    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame(() => this.loop());
  }
}
