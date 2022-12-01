import * as THREE from "three";

import { Postprocess } from "./postProcessing";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export function model(container: HTMLDivElement) {
  const renderer = new THREE.WebGLRenderer({
    powerPreference: "high-performance",
    antialias: true,
    stencil: false,
    depth: false,
    logarithmicDepthBuffer: true,
    // preserveDrawingBuffer: true,
    alpha: true,
  });
  render_init(container);
  container.appendChild(renderer.domElement);
  const scene = new THREE.Scene();

  scene.background = new THREE.Color(0x878732);
  const aspect = container.clientWidth / container.clientHeight;
  const camera = new THREE.PerspectiveCamera(39.6, aspect, 0.01, 30000);
  camera.position.set(5, 5, 5);

  const mesh = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshStandardMaterial());

  scene.add(mesh);

  const postProcess = new Postprocess(scene, renderer, camera);

  postProcess.addGodRaypass(mesh);

  const orbit = new OrbitControls(camera, renderer.domElement);

  orbit.update();

  function animation() {
    requestAnimationFrame(animation);
    postProcess.render();
  }

  animation();

  function render_init(container: HTMLElement) {
    const pixelRatio = window.devicePixelRatio;

    renderer.setPixelRatio(pixelRatio);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.physicallyCorrectLights = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(container.clientWidth, container.clientHeight);
  }
}
