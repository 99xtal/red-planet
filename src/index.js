import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import colorMap from "../textures/marscolormap.jpg";
import bumpMap from "../textures/marsbumpmap.jpg";

const canvasWidth = window.innerWidth;
const canvasHeight = window.innerHeight;

//initialize renderer
const renderer = new THREE.WebGL1Renderer();
renderer.setSize(canvasWidth, canvasHeight);
document.body.appendChild(renderer.domElement);

//initialize scene
const scene = new THREE.Scene();

//initialize camera
const camera = new THREE.PerspectiveCamera(
  50,
  canvasWidth / canvasHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 30);

//initialize OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.75;
controls.enablePan = false;
controls.update();

//initialize textures
const textureLoader = new THREE.TextureLoader();
textureLoader.crossOrigin = "";
const marsColorMap = textureLoader.load(colorMap);
const marsBumpMap = textureLoader.load(bumpMap);

//lighting
const sunlight = new THREE.DirectionalLight(0xffffff, 1);
sunlight.position.set(1, 0, 2);
scene.add(sunlight);

//create mars
const marsGeometry = new THREE.SphereGeometry(4, 30, 30);
const marsMaterial = new THREE.MeshStandardMaterial({
  map: marsColorMap,
  bumpMap: marsBumpMap,
  bumpScale: 0.5,
});
const mars = new THREE.Mesh(marsGeometry, marsMaterial);
scene.add(mars);

//mars axial tilt
mars.rotateZ(-0.43964844);
const origin = new THREE.Vector3(0, 0, 0);
const axialTilt = new THREE.Vector3(4.26, 9.05, 0);
const points = [origin, axialTilt];

// //create axis
// const axisMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
// const axisGeometry = new THREE.BufferGeometry().setFromPoints(points);
// const axisLine = new THREE.Line(axisGeometry, axisMaterial);
// scene.add(axisLine);

// //axis helper
// const axesHelper = new THREE.AxesHelper(10);
// scene.add(axesHelper);

//create stars
const starVertices = [];
for (let i = 0; i < 10000; i++) {
  const x = (Math.random() - 0.5) * 2000 + 200;
  const y = (Math.random() - 0.5) * 2000 + 200;
  const z = (Math.random() - 0.5) * 2000 + 200;
  starVertices.push(x, y, z);
}
const starVertices32 = new Float32Array(starVertices);

const starGeometry = new THREE.BufferGeometry();
starGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(starVertices32, 3)
);

const starMaterial = new THREE.PointsMaterial({ color: 0xffffff });

const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

//render and animate
function animate() {
  requestAnimationFrame(animate);

  mars.rotateOnWorldAxis(axialTilt, 0.0001);
  controls.update();
  renderer.render(scene, camera);
}

animate();
