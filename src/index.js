import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import colorMap from "../textures/marscolormap.jpg";
import bumpMap from "../textures/marsbumpmap.jpg";

//initialize scene, camera, renderer
const canvasWidth = window.innerWidth;
const canvasHeight = window.innerHeight;

const renderer = new THREE.WebGL1Renderer();
renderer.setSize(canvasWidth, canvasHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  50,
  canvasWidth / canvasHeight,
  0.1,
  1000
);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.75;
controls.enablePan = false;

camera.position.set(0, 0, 30);
controls.update();

//initialize textures
const textureLoader = new THREE.TextureLoader();
textureLoader.crossOrigin = "";
const marsColorMap = textureLoader.load(colorMap);
const marsBumpMap = textureLoader.load(bumpMap);
// const spaceTexture = textureLoader.load("textures/space.jpg");

//lighting;
const dLight = new THREE.DirectionalLight(0xffffff, 1);
dLight.position.set(1, 0, 2);
scene.add(dLight);

//create planet
const geometry = new THREE.SphereGeometry(4, 30, 30);
const material = new THREE.MeshStandardMaterial({
  map: marsColorMap,
  bumpMap: marsBumpMap,
  bumpScale: 0.5,
});
const mars = new THREE.Mesh(geometry, material);
scene.add(mars);

//create stars
const starGeometry = new THREE.BufferGeometry();
const starVertices = [];
for (let i = 0; i < 10000; i++) {
  const x = (Math.random() - 0.5) * 2000 + 200;
  const y = (Math.random() - 0.5) * 2000 + 200;
  const z = (Math.random() - 0.5) * 2000 + 200;
  starVertices.push(x, y, z);
}
const starVertices32 = new Float32Array(starVertices);
starGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(starVertices32, 3)
);
const starMaterial = new THREE.PointsMaterial({ color: 0xffffff });
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

//background
// scene.background = spaceTexture;

//render and animate
function animate() {
  requestAnimationFrame(animate);

  mars.rotation.y += 0.001;
  controls.update();
  renderer.render(scene, camera);
}

animate();
