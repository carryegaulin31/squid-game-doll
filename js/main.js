const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Example -- this creates a cube that can be worked with
// const geometry = new THREE.BoxGeometry();
// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

camera.position.z = 5; // How close or far the camera is

const loader = new GLTFLoader(); //To load 3D model   three js github examples/js/loaders/GLTFLoader.js click on raw button click Cntrl +S

// renderer.render(scene, camera ); *Manually rendering each time is a pain so here is an alternative... by passing animate it continually renders over and over again forever
function animate() {
    renderer.render( scene, camera );
    
    // example animations
    // cube.rotation.x += 0.01; // x = up down rotation, y = left right rotation, z = in circles
    // .5 faster, .00001 slower
    
	requestAnimationFrame( animate );
}
animate();