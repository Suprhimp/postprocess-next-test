import * as THREE from "three";

import {
  BlendFunction,
  EdgeDetectionMode,
  EffectComposer,
  EffectPass,
  PredicationMode,
  RenderPass,
  OutlineEffect,
  SMAAEffect,
  SMAAPreset,
  KernelSize,
  GodRaysEffect,
  DepthOfFieldEffect,
} from "postprocessing";
import { Camera, PerspectiveCamera } from "three";

let scope: Postprocess;

export class Postprocess {
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  camera: THREE.OrthographicCamera | THREE.PerspectiveCamera;
  composer: EffectComposer;
  renderPass: RenderPass;
  smaaPass?: EffectPass;
  godRayPass?: EffectPass;
  godRayEffect?: GodRaysEffect;
  depthOfFieldEffect?: DepthOfFieldEffect;
  depthOfFieldPass?: EffectPass;

  constructor(
    scene: THREE.Scene,
    renderer: THREE.WebGLRenderer,
    camera: THREE.OrthographicCamera | THREE.PerspectiveCamera
  ) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.composer = new EffectComposer(renderer);
    this.renderPass = new RenderPass(scene, camera);
    this.composer.addPass(this.renderPass);
  }
  changeCamera(newCamera: PerspectiveCamera) {
    this.camera = newCamera;
    this.composer.passes.forEach((pass) => {
      pass.mainCamera = newCamera;
    });
  }
  addGodRaypass(lightSourceMesh: any) {
    lightSourceMesh.material = new THREE.MeshBasicMaterial({
      color: lightSourceMesh.material.color.getHex(),
      transparent: true,
      fog: false,
    });
    lightSourceMesh.frustumCulled = false;

    this.godRayEffect = new GodRaysEffect(this.camera, lightSourceMesh, {
      kernelSize: KernelSize.SMALL,
      density: 0.96,
      decay: 0.92,
      weight: 0.3,
      exposure: 0.54,
      samples: 32,
      resolutionScale: 0.5,
    });
    this.godRayPass = new EffectPass(this.camera, this.godRayEffect);
    console.log(this.composer.passes);
    this.composer.addPass(this.godRayPass);
    this.godRayPass.renderToScreen = true;
    console.log(this.composer.passes);
  }
  addDepthOfField() {
    this.depthOfFieldEffect = new DepthOfFieldEffect(this.camera, {
      // kernelSize: KernelSize.SMALL,
      worldFocusDistance: 10,
      worldFocusRange: 10,
      bokehScale: 2.0,
      resolutionScale: 0.75,
    });
    this.depthOfFieldPass = new EffectPass(this.camera, this.depthOfFieldEffect);

    this.composer.addPass(this.depthOfFieldPass);
  }
  addSmaa() {
    const effect = new SMAAEffect({
      // blendFunction: BlendFunction.SET,
      preset: SMAAPreset.ULTRA,
      edgeDetectionMode: EdgeDetectionMode.COLOR,
      predicationMode: PredicationMode.DEPTH,
    });
    const edgeDetectionMaterial = effect.edgeDetectionMaterial;
    edgeDetectionMaterial.edgeDetectionThreshold = 0.02;
    edgeDetectionMaterial.predicationThreshold = 0.002;
    edgeDetectionMaterial.predicationScale = 1;
    this.smaaPass = new EffectPass(this.camera, effect);
    this.smaaPass.renderToScreen = true;
    this.composer.addPass(this.smaaPass);
  }
  render() {
    if (!this.composer || this.composer.passes.length <= 1) this.renderer.render(this.scene, this.camera);
    else this.composer.render();
  }
}
