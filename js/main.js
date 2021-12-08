const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

renderer.setClearColor(0xb7c3f3, 1); //Background color, opacity

const light = new THREE.AmbientLight(0xffffff); // soft white light is this (0x404040) we will change to white
scene.add(light); //This is the light so that we can SEE the 3D model.

// GLOBAL VARIABLES
const start_position = 3;
const end_position = -start_position; // This dictates where the cube will be on the left and the right of screen
const text = document.querySelector(".text")
const TIME_LIMIT = 10
let gameStat = "loading"
let isLookingBackward = true

function createCube(size, positionX, rotY = 0, color = 0xfbc851) {
  //positionX is start and end position, rotY is rotation of cube
  // Example -- this creates a cube that can be worked with
  const geometry = new THREE.BoxGeometry(size.w, size.h, size.d);
  const material = new THREE.MeshBasicMaterial({ color: color });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.x = positionX;
  cube.rotation.y = rotY;
  scene.add(cube);
  return cube;
}

camera.position.z = 5; // How close or far the camera is

const loader = new THREE.GLTFLoader(); //To load 3D model   three js github examples/js/loaders/GLTFLoader.js click on raw button click Cntrl +S

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
class Doll {
  constructor() {
    loader.load("../models/scene.gltf", (gltf) => {
      scene.add(gltf.scene);
      //now the doll is too big so we will scale it down.
      gltf.scene.scale.set(0.4, 0.4, 0.4); // correct size but not screen responsive...
      gltf.scene.position.set(0, -1.5, 0);
      this.doll = gltf.scene;
    }); //cannot see anything at this point because...we have NO LIGHT
  }

  lookBackward() {
    // this.doll.rotation.y = -3.15 // 1 turns the doll 1 to the right, -3.15 tuens the doll backward before we have animation
    gsap.to(this.doll.rotation, { y: -3.15, duration: 0.45 });
    setTimeout(() => isLookingBackward = true, 150)
  }

  lookForward() {
    // this.doll.rotation.y = 0
    gsap.to(this.doll.rotation, { y: 0, duration: 0.45 });
    setTimeout(() => isLookingBackward = false, 450)

  }

  async start() {
    // Async recursive function
    this.lookBackward();
    await delay(Math.random() * 1000 + 1000);
    this.lookForward();
    await delay(Math.random() * 750 + 750);
    this.start();
  }
}

function createTrack() {
  createCube(
    { w: start_position * 2 + 0.2, h: 1.5, d: 1 },
    0,
    0,
    0xe5a716
  ).position.z = -1; // middle cube on track
  createCube({ w: 0.2, h: 1.5, d: 1 }, start_position, -0.35); // the -3 dictates what side of the screen the cube will be on. Replaced with start position and end position
  createCube({ w: 0.2, h: 1.5, d: 1 }, end_position, 0.35);
}
createTrack();

class Player {
  constructor() {
    const geometry = new THREE.SphereGeometry(0.3, 32, 16);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.z = 1;
    sphere.position.x = start_position;
    scene.add(sphere);
    this.player = sphere;
    this.playerInfo = {
      positionX: start_position,
      velocity: 0,
    };
  }

  run() {
    this.playerInfo.velocity = 0.03;
  }

  stop() {
    // this.playerInfo.velocity = 0; This is an immediate stop
    gsap.to(this.playerInfo, { velocity: 0, duration: 0.1 }); // a more gradual stop the higher the number the slower the stop
  }
  
  check() {
     if(this.playerInfo.velocity > 0 && !isLookingBackward){ 
       text.innerText = "🤷‍♀️💥💥😵💥💥"
       gameStat = "over"
     }
    if(this.playerInfo.positionX < end_position + .4) {
        text.innerText = "🎵Hey look ma I made it🎵"
        gameStat = "over"
        }
    }
  update() {
    this.check()
    this.playerInfo.positionX -= this.playerInfo.velocity;
    this.player.position.x = this.playerInfo.positionX;
  }
}

const player = new Player();

let doll = new Doll();

async function init() {
  await delay(500);
  text.innerText = "Starting in 3"
  await delay(500);
  text.innerText = "Starting in 2"
  await delay(500);
  text.innerText = "Starting in 1"
  await delay(500);
  text.innerText = "GO!!!!"
  startGame()
}

function startGame() {
    gameStat = "started"
    let progressBar = createCube({w: 5, h: .1, d: 1}, 0)
    progressBar.position.y = 3.35
    gsap.to(progressBar.scale, {x: 0, duration: TIME_LIMIT, ease: "none"})
    doll.start()
    setTimeout(() => {
        if(gameStat != "over") {
            text.innerText = "Sucks to suck slow poke🐌🐢"
            gameStat = "over"
            }
    }, TIME_LIMIT *1000)
}

init()

// renderer.render(scene, camera ); *Manually rendering each time is a pain so here is an alternative... by passing animate it continually renders over and over again forever
function animate() {
    if(gameStat == "over") return
  renderer.render(scene, camera);

  // example animations
  // cube.rotation.x += 0.01; // x = up down rotation, y = left right rotation, z = in circles
  // .5 faster, .00001 slower

  requestAnimationFrame(animate);
  player.update();
}
animate();

window.addEventListener("resize", onWindowResize, false);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("keydown", (e) => {
    if(gameStat !== "started") return
    if (e.key == "ArrowUp") {
    player.run();
  }
});
window.addEventListener("keyup", (e) => {
  if (e.key == "ArrowDown") {
    player.stop();
  }
});
