import * as THREE from 'three';
import threeGlobe from 'three-globe';
import { coords } from '../models/models';
import { TrackballControls } from 'three/examples/jsm/controls/trackballcontrols';

export interface world {
  lat: number
  lng: number
  size: number
  color: string
  country: string
}
export type worldData = world[]

export class globeScene {
  camera: THREE.PerspectiveCamera
  scene: THREE.Scene
  renderer: THREE.WebGLRenderer
  globe: threeGlobe
  tbControls: TrackballControls
  labelDataOriginal: worldData = []

  tbChangedCallback: (data: THREE.Vector3) => void = () => { }

  constructor(public container: HTMLElement) {
    this.renderer = new THREE.WebGLRenderer()
    this.camera = new THREE.PerspectiveCamera()
    this.globe = new threeGlobe()
    this.scene = new THREE.Scene()
    this.initRenderer()
    this.initCamera()
    this.tbControls = new TrackballControls(this.camera, this.renderer.domElement)
    this.initTbControls()
  }

  /**
   * method to do some experimentals 3d calculations
   */
  public compute() {
    // const geometry = new THREE.BoxGeometry(100, 100, 10);
    // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    // const cube = new THREE.Mesh(geometry, material);
    // this.scene.add(cube)
    // get the textGeometry data fro "France"
    // const labelData: any = this.globe.labelsData().find((obj: any) => {
    //   if (obj.country === "France") return obj as any
    // })
    // if (!labelData) return
    // const tObjMesh = labelData.__threeObj.children[1] // the label 3d mesh obj
    // const geo = tObjMesh.geometry // the label TextGeometry object
    // const width = Math.abs(geo.boundingBox.min.x) + Math.abs(geo.boundingBox.max.x)
    // const height = Math.abs(geo.boundingBox.min.y) + Math.abs(geo.boundingBox.max.y)

  }


  public setTbChangedHandler(handler: (data: THREE.Vector3) => void) {
    this.tbChangedCallback = handler
  }
  private initRenderer() {
    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.container.appendChild(this.renderer.domElement);
  }

  private initTbControls() {
    // Add camera controls
    this.tbControls.minDistance = 101;
    this.tbControls.rotateSpeed = 2;
    this.tbControls.zoomSpeed = 0.8;
    this.tbControls.addEventListener('change', () => {
      this.globe.setPointOfView(this.camera.position, this.globe.position)
      this.tbChangedCallback(this.camera.position)
    });
  }

  private initCamera() {
    // Setup camera
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.camera.position.z = 500;
    this.camera.far = 10000
    this.camera.near = 10
  }


  public async initScene() {
    await this.initGlobe()
    // Setup scene
    this.scene.add(this.globe);
    this.scene.add(new THREE.AmbientLight(0xbbbbbb));
    this.scene.add(new THREE.DirectionalLight(0xffffff, 0.6));
  }

  public staticData(): coords {

    const obj = this.labelDataOriginal.find((obj) => {
      if (obj.country === "France") return obj
    })
    if (obj) {
      const data = this.globe.getCoords(obj.lat, obj.lng)
      return new coords(data.x, data.y, data.z)
    } else {
      return new coords()
    }

  }

  private async initGlobe() {
    return fetch('./world-low-resolution.json').then(res => res.json()).then(countries => {

      this.labelDataOriginal = countries.features.map((country) => {
        return {
          lat: country.properties.label_y,
          lng: country.properties.label_x,
          size: 0.4,
          color: 'white',
          country: country.properties.name
        }
      })
      this.globe
        .globeImageUrl('./earth-day.jpg')
        .bumpImageUrl('./earth-topology.png')
        .polygonsData(countries.features)
        .polygonCapColor(() => 'rgba(200, 0, 0, 0.7)')
        .polygonSideColor(() => 'rgba(0, 200, 0, 0.0)')
        .polygonStrokeColor(() => '#111')
        .labelsData(this.labelDataOriginal)
        .labelText((obj: any) => {
          return obj.country
        })
        .labelSize((obj: any) => {
          return obj.size
        })
        .labelAltitude(0.03)
        // Update pov when camera moves
        .setPointOfView(this.camera.position, this.globe.position);
    })
  }

  public animate() {
    // Frame cycle
    this.tbControls.update();
    this.renderer.render(this.scene, this.camera)
    requestAnimationFrame(this.animate.bind(this));
  }

}
/**
 *
 */
// export function three_globe(container: HTMLElement) {


//   const markerSvg = `<svg viewBox="-4 0 36 36">
//     <path fill="currentColor" d="M14,0 C21.732,0 28,5.641 28,12.6 C28,23.963 14,36 14,36 C14,36 0,24.064 0,12.6 C0,5.641 6.268,0 14,0 Z"></path>
//     <circle fill="black" cx="14" cy="14" r="7"></circle>
//   </svg>`;


//   /**
//    * label x & y for test
//    */
//   // "label_x": 2.552275,
//   // "label_y": 46.696113,
//   const y = 2.552275
//   const x = 46.696113


//   fetch('./world-low-resolution.json').then(res => res.json()).then(countries => {

//     const labelDataOriginal = countries.features.map((country) => {
//       return {
//         lat: country.properties.label_y,
//         lng: country.properties.label_x,
//         size: 0.4,
//         color: 'white',
//         country: country.properties.name
//       }
//     })







//       // Kick-off renderers
//       (function animate() { // IIFE
//         Globe.labelsData().forEach((labelObj: any) => {
//           // let a = labelObj.computeBoundingBox()
//           let a = 0
//           if (labelObj.__threeObj && labelObj.country === "France") {
//             let threeObj = labelObj.__threeObj.children[1]
//             threeObj.geometry.computeBoundingBox()
//             // var bbox = labelObj.__threeObj.children[1].geometry.boundingBox
//             // var cameraZ = camera.position.z
//             // var vFOV = camera.fov * Math.PI / 180;
//             // var height = 2 * Math.tan(vFOV / 2) * cameraZ
//             // var width = camera.aspect * height
//             var v3 = new THREE.Vector3()
//             threeObj.updateMatrixWorld()
//             v3.setFromMatrixPosition(threeObj.matrixWorld);
//             v3.project(camera)
//             var x = Math.round((0.5 + v3.x / 2) * (container.clientWidth / window.devicePixelRatio));
//             var y = Math.round((0.5 - v3.y / 2) * (container.clientHeight / window.devicePixelRatio));
//           }
//         })
//         // Frame cycle
//         tbControls.update();
//         renderer.render(scene, camera)
//         requestAnimationFrame(animate);
//       })();
//   })
// }