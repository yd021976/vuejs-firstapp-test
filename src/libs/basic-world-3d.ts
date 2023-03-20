import * as THREE from 'three';
import type threeGlobe from 'three-globe';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Globe } from './threeGlobe';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';

export class basicTest3dWorld {
    camera: THREE.PerspectiveCamera
    scene: THREE.Scene
    renderer: THREE.WebGLRenderer
    orbitCtrl?: OrbitControls
    sceneObjects: THREE.Mesh[] = [] // Objects to add in the scene

    constructor() {
        this.renderer = new THREE.WebGLRenderer()
        this.camera = this.createCamera()
        this.scene = new THREE.Scene()
        this.initOrbitControls()
    }

    /**
     * Init objects
     * 
     * @returns 
     */
    public async init(htmlCanvas: HTMLElement) {
        this.setRendererCanvas(htmlCanvas)
        return this.buildObjects().then((objects3d) => {
            this.sceneObjects.push(...objects3d)
            this.scene.add(...this.sceneObjects)
        })
    }

    private async buildObjects(): Promise<THREE.Mesh[]> {
        var geos: THREE.Mesh[] = []
        /** fake promise to turn method to async */
        var initPromise: Promise<void> = new Promise<void>((resolve, reject) => {
            resolve()
        })

        return initPromise
            // .then(() => {
            //     return this.buildGlobe().then((globe) => {
            //         (globe as threeGlobe).setPointOfView(this.camera.position, globe.position)
            //         geos.push(globe)
            //         return geos
            //     })
            // })
            .then((geometries) => {
                return this.buildTextGeometry()
                    .then((textGeometry) => {
                        geos.push(textGeometry)
                        return geos
                    })
            })
            // .then((geometries) => {
            //     const boxHelper = this.buildBoxHelper(geometries[0])
            //     geos.push(boxHelper)
            //     return geos
            // })
            // .then((geometries) => {
            //     const cube = this.buildCube()
            //     geos.push(cube)
            //     return geos
            // })
            .catch((err) => {
                let a = 0
                return []
            })
    }


    /**
     * test function to cumpute something 
     */
    public compute(): { x: Number, y: Number, width: Number, height: Number } | undefined {
        var returnValue: { x: Number, y: Number } | undefined = undefined
        var bbox: THREE.Box3, result: THREE.Box3, topLeftX, topLeftY
        var result2: { x: Number, y: Number, width: Number, height: Number } | undefined


        /**
         * 
         * Compute with basic cube
         * 
         */
        // const cube = new THREE.Box3().setFromObject(this.sceneObjects[0])
        // var s = new THREE.Vector3()
        // cube.getSize(s)
        // let dist = this.camera.position.distanceTo(cube.min)
        // let distSquared = this.camera.position.distanceToSquared(cube.min)
        // cube.geometry.computeBoundingBox()
        // if (cube.geometry.boundingBox) {
        //     return result2 = this.getBoundingRect(cube)
        // }



        /**
         * 
         * Compute with globe text labels
         * 
         */
        // const globe = (this.sceneObjects[0] as threeGlobe)
        // const frLabel: any[] = globe.labelsData().filter((labelData: any) => labelData.country === "France")

        // if (frLabel.length !== 0) {
        //     result2 = this.getBoundingRect(frLabel[0].__threeObj.children[1])
        //     const bHelper = this.buildBoxHelper(frLabel[0].__threeObj.children[1])
        //     this.renderScene()
        // }


        /**
         * 
         * Compute with text geometry
         * 
         */
        const textGeo = this.sceneObjects[0]
        var bHelper: THREE.BoxHelper
        const bHelperName = 'textBoxHelper'
        bHelper = this.scene.getObjectByName(bHelperName) as THREE.BoxHelper
        if (!bHelper) {
            bHelper = new THREE.BoxHelper(textGeo)
            bHelper.name = bHelperName
            this.scene.add(bHelper)
        }
        this.renderScene()

        // now we have the box helper, we can compute top left/right position and hight/widht
        var boxHelperPos = bHelper.geometry.attributes['position'] as any
        if (boxHelperPos) {
            // topleft vector
            var topLeft = new THREE.Vector3(boxHelperPos.array[15], boxHelperPos.array[16], 0)
            var bottomRight = new THREE.Vector3(boxHelperPos.array[21], boxHelperPos.array[22], 0)
            // project from camera into device coordinate
            topLeft.project(this.camera)
            bottomRight.project(this.camera)

            // convert into screen coordinates
            var { x, y } = { x: this.renderer.domElement.clientWidth, y: this.renderer.domElement.clientHeight } // DOM canvas size
            topLeftX = Math.round((((1 + topLeft.x) / 2) * x));
            topLeftY = Math.round((((1 - topLeft.y) / 2) * y));
            var bottomRightX = Math.round((((1 + bottomRight.x) / 2) * x));
            var bottomRightY = Math.round((((1 - bottomRight.y) / 2) * y));
            var width = bottomRightX - topLeftX
            var height = bottomRightY - topLeftY

            result2 = {
                x: topLeftX,
                y: topLeftY,
                height: height,
                width: width
            }

        }

        return result2
    }

    /**
     * Compute 3D object display screen bounding rect
     */
    public getBoundingRect(object?: THREE.Mesh): { x: Number, y: Number, width: Number, height: Number } | undefined {
        var bbox: THREE.Box3, returnValue: { x: Number, y: Number, width: Number, height: Number } | undefined = undefined, height: Number, width: Number

        /**
         * if no onject provided : default to "first" object of the scene
         */
        if (!object) {
            return returnValue
        }

        object.geometry.computeBoundingBox() // update bounding box
        if (object.geometry.boundingBox) {
            bbox = new THREE.Box3().copy(object.geometry.boundingBox)
            // bbox top left vector
            const bbox_topLeft = this.v3ToScreenCoordinates(new THREE.Vector3(bbox.min.x, bbox.max.y, 0))
            // bottom right vector
            const bbox_bottomRight = this.v3ToScreenCoordinates(new THREE.Vector3(bbox.max.x, bbox.min.y, 0))
            if (bbox_topLeft && bbox_bottomRight) {
                // bbox width
                width = bbox_bottomRight.x.valueOf() - bbox_topLeft.x.valueOf()
                // bbox height
                height = bbox_bottomRight.y.valueOf() - bbox_topLeft.y.valueOf()
                // We have computed width & height => Now get mesh position in screen coordinates
                var meshPos = new THREE.Vector3().copy(object.position)
                // meshPos.y = meshPos.y + (bbox.max.y - bbox.min.y)
                const meshPosScreen = this.v3ToScreenCoordinates(meshPos)
                // returnValue = {
                //     x: meshPosScreen.x,
                //     y: meshPosScreen.y,
                //     width: width,
                //     height: height
                // }
                returnValue = {
                    x: meshPosScreen.x,
                    y: meshPosScreen.y,
                    width: bbox_bottomRight.x,
                    height: bbox_bottomRight.y
                }
            }

        }
        return returnValue

    }
    private v3ToScreenCoordinates(vector: THREE.Vector3) {
        var result: THREE.Box3, topLeftX, topLeftY
        var returnValue: { x: Number, y: Number } | undefined = undefined
        const projection = new THREE.Vector3().copy(vector).project(this.camera)
        var { x, y } = { x: this.renderer.domElement.clientWidth, y: this.renderer.domElement.clientHeight } // DOM canvas size
        /** is vector out of screen ? */
        topLeftX = Math.round((((1 + projection.x) / 2) * x));
        topLeftY = Math.round((((1 - projection.y) / 2) * y));
        returnValue = { x: topLeftX, y: topLeftY }
        return returnValue
    }
    /**
     * Append Renderer canvas to an HTML container
     * 
     * @param htmlRendererContainer 
     */
    private setRendererCanvas(htmlRendererContainer: HTMLElement): void {
        htmlRendererContainer.appendChild(this.renderer.domElement)
        this.renderer.setSize(htmlRendererContainer.clientWidth, htmlRendererContainer.clientHeight)
    }

    /**
     * 
     */
    public renderScene() {
        // since camera position has changed, compute wich country labels could be visible on the screen
        // this.showHideLabels()
        this.renderer.render(this.scene, this.camera)
    }
    private showHideLabels() {
        const globe = (this.sceneObjects[0] as unknown) as threeGlobe
        globe.labelsData().forEach((label: any) => {
            if (label.__threeObj) {
                if (label.country !== "France") {
                    // test of screen coordinates
                    const labelSC = this.getBoundingRect(label.__threeObj.children[1])
                    // console.log(labelSC)

                    const boxH = new THREE.BoxHelper(label.__threeObj)
                    const distSq = this.camera.position.distanceToSquared(boxH.position)
                    // console.log(`distance from cam:${distSq}`)
                    if (distSq <= 27000) {
                        label.__threeObj.visible = true
                    } else {
                        label.__threeObj.visible = false
                    }
                }
            }
        })


        // const globe = (this.sceneObjects[0] as threeGlobe)
        // globe.labelsData().forEach((label: any) => {
        //     if (label.__threeObj) {
        //         if (label.country != "France") {
        //             const labelMesh: THREE.Mesh = label.__threeObj.children[1]
        //             const result = this.getBoundingRect(labelMesh)
        //             // console.log(result)
        //             if (result) {

        //                 if (result.width <= 7 || result.height <= 2.2) {
        //                     labelMesh.visible = false
        //                 } else {
        //                     labelMesh.visible = true
        //                 }
        //             }
        //             // console.log(`Country ${label.country}`)
        //         }
        //     }
        // })


    }
    /**
     * Create a perspective camera with default values
     * 
     * @returns THREE.PerspectiveCamera
     */
    private createCamera(): THREE.PerspectiveCamera {
        const fieldOfView = 60;
        // Measured in degrees, not radians
        const aspect = 1200 / 800;
        // The canvas default (300px-wide: 150px tall --> 2:1 -->  2)
        const near = 0.1;
        const far = 10000;
        const camera = new THREE.PerspectiveCamera(fieldOfView, aspect, near, far)
        return camera
    }

    /**
     * Build a simple cube to display in 3d env
     */
    private buildCube(): THREE.Mesh {
        const width = 10;
        const height = 10;
        const depth = 10;
        const geometry = new THREE.BoxGeometry(width, height, depth);
        const material = new THREE.MeshBasicMaterial({ color: 0xc2c5cc });
        const cube = new THREE.Mesh(geometry, material);
        return cube
    }

    /**
     * 
     */
    private async buildTextGeometry(): Promise<THREE.Mesh> {
        const loader = new FontLoader();
        return new Promise((resolve, reject) => {
            loader.load('fonts/helvetiker_regular.typeface.json',
                function (font) {
                    const geometry = new TextGeometry('TOTO j', {
                        font: font,
                        size: 50,
                        height: 3,
                        curveSegments: 12,
                        bevelEnabled: false,
                        bevelThickness: 10,
                        bevelSize: 8,
                        bevelOffset: 0,
                        bevelSegments: 5,

                    });

                    geometry.computeBoundingBox()
                    var center
                    if (geometry.boundingBox) {
                        center = - 0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x)
                    }
                    var mesh = new THREE.Mesh(geometry)
                    mesh.position.x = center
                    mesh.position.y = 0
                    resolve(mesh)
                },
                () => { },
                (error) => {
                    reject(null)
                });
        })
    }
    /**
     * 
     */
    private buildBoxHelper(children: THREE.Object3D): THREE.Object3D {
        const box = new THREE.BoxHelper(children, 0xffff00)
        this.scene.add(box)
        return box
    }
    private async buildGlobe(): Promise<THREE.Object3D> {
        const globe = new Globe()
        return globe.init().then(() => {
            return globe.globeObject
        })
    }
    private initOrbitControls() {
        this.orbitCtrl = new OrbitControls(this.camera, this.renderer.domElement)
        this.orbitCtrl?.update();
        // Add camera controls
        this.orbitCtrl.minDistance = 101;
        this.orbitCtrl.rotateSpeed = 0.5;
        this.orbitCtrl.zoomSpeed = 0.2;
        this.orbitCtrl.addEventListener('change', () => {
            // const globe = this.sceneObjects[0] as threeGlobe
            // globe.setPointOfView(this.camera.position, globe.position)
            this.renderScene()
        });
    }
}