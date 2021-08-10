import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import * as dat from 'dat.gui'
import waterVertexShader from './shaders/water/vertex.glsl'
import waterFragmentShader from './shaders/water/fragment.glsl'
import gsap from 'gsap'
import CANNON from 'cannon'



/**
 * Base
 */
// Debug
const gui = new dat.GUI()
const parameter = {
    hullColor: 0x433c31,
    sailColor: 0xc3c3c3,
    flagColor: 0xffffff
}

const debugObject = {}




// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );



/**
 * physics
 */
const world = new CANNON.World()
world.broadphase = new CANNON.SAPBroadphase(world)
world.gravity.set(0, - 9.82, 0)


const defaultMaterial = new CANNON.Material('default')
const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
        friction: 1,
        restitution: 0.2
    }
)
world.addContactMaterial(defaultContactMaterial)


//ship CannonBody
const shipShape = new CANNON.Box(new CANNON.Vec3(1.5, 1, 2))
const shipBody = new CANNON.Body({
    mass: 100,
    position: new CANNON.Vec3(0, 10, 0),
    shape: shipShape,
    material: defaultMaterial
})
world.addBody(shipBody)


//floor CannonBody
const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body()
floorBody.position = new CANNON.Vec3(0,0,0)
floorBody.mass =0
floorBody.material = defaultMaterial
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(- 1, 0, 0), Math.PI * 0.5) 
floorBody.addShape(floorShape)
world.addBody(floorBody)






/**
 * Models
 */
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')





const shipGroup = new THREE.Group()


const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

let mixer = null




/**
 * Island
 */

/**
 * Ship
 */

let ship
let door_R_bt
let door_R_Up
let door_L_bt
    
let door_L_Up
let cannonR
let cannonL
let flag
let sail
let mast
let hull


gltfLoader.load(
    '/models/ship.glb',
    (gltf) =>
    {   ship = gltf.scene


        
        //door_R
        door_R_bt = gltf.scene.children[0].children[0]
        door_R_Up = gltf.scene.children[0].children[1]
        
        door_R_bt.traverse((child)=>{
            child.material = new THREE.MeshStandardMaterial({
                color: parameter.hullColor,
                metalness: 0,
                roughness: 0.5,
                side: THREE.DoubleSide,
               
                
            })
        })

        door_R_Up.traverse((child)=>{
            child.material = new THREE.MeshStandardMaterial({
                color:  parameter.hullColor,
                metalness: 0,
                roughness: 0.5,
                side: THREE.DoubleSide,
               
                
            })
        })



        
        //door_L
        door_L_bt = gltf.scene.children[0].children[2]
        door_L_Up = gltf.scene.children[0].children[3]
        
        door_L_Up.traverse((child)=>{
            if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial){
                child.material = new THREE.MeshStandardMaterial({
                    color: parameter.hullColor,
                    metalness: 0,
                    roughness: 0.5,
                    side: THREE.DoubleSide,
                   
                    
                })
            }
        })

        door_L_bt.traverse((child)=>{
            if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial){
                child.material = new THREE.MeshStandardMaterial({
                    color:  parameter.hullColor,
                    metalness: 0,
                    roughness: 0.5,
                    side: THREE.DoubleSide,
                   
                    
                })
            }
        })

        //cannon
      cannonR = gltf.scene.children[0].children[4]
       cannonL = gltf.scene.children[0].children[5]

       cannonR.traverse((child)=>{
        child.material = new THREE.MeshStandardMaterial({
            color: '#4a4a4a',
            metalness: 1,
            roughness: 0.5,
            side: THREE.DoubleSide,
           
            
        })
    })

    cannonL.traverse((child)=>{
        child.material = new THREE.MeshStandardMaterial({
            color: '#4a4a4a',
            metalness: 1,
            roughness: 0.5,
            side: THREE.DoubleSide,
           
            
        })
    })

        //flag
        flag = gltf.scene.children[0].children[6]
        flag.material = new THREE.MeshStandardMaterial({
            color: parameter.flagColor,
            metalness: 0,
            roughness: 0.5,
            side: THREE.DoubleSide,
           
            
        })

        
        //sail
        sail = gltf.scene.children[0].children[7]
        sail.material = new THREE.MeshStandardMaterial({
            color: parameter.sailColor,
            metalness: 0,
            roughness: 0.5,
            side: THREE.DoubleSide,
           
            
        })

         //Mast
         mast = gltf.scene.children[0].children[8]
         mast.material = new THREE.MeshStandardMaterial({
            color: '#524640',
            metalness: 0,
            roughness: 0.5,
            side: THREE.DoubleSide
        })

          //Hull
        hull = gltf.scene.children[0].children[9]
        hull.material = new THREE.MeshStandardMaterial({
            color: parameter.hullColor,
            metalness: 0,
            roughness: 0.5,
            side: THREE.DoubleSide
          
            
           
        })
     



        //Door_R_position_Fix
        door_R_Up.rotation.x = Math.PI
        door_R_bt.rotation.x = Math.PI
        door_R_Up.rotation.y = Math.PI
        door_R_bt.rotation.y = Math.PI

        //CannonR_rotation_Fix
        cannonR.rotation.y = Math.PI
        cannonR.rotation.x = Math.PI
         

        gltf.scene.scale.x = 0.1
        gltf.scene.scale.y = 0.1
        gltf.scene.scale.z = 0.1 


        shipGroup.add(ship)
        scene.add(shipGroup)
        shipGroup.add(axesHelper)
        // shipGroup.localToWorld(0,0,0)
        // scene.add(door_R_bt, door_R_Up, door_L_Up, door_L_bt, cannonL, cannonR, flag, sail, mast, hull)
        








        //gui.data

        gui.add(door_R_Up.rotation, 'z').min(0).max(Math.PI).step(0.01).name('doorRupOpen')
        gui.add(door_R_bt.rotation, 'z').min(0).max(Math.PI).step(0.01).name('doorRupOpen')
        gui.addColor(parameter, 'hullColor').onChange(()=>{
            hull.material.color.set(parameter.hullColor)
           

            door_R_bt.traverse((child)=>{
                child.material = new THREE.MeshStandardMaterial({
                    color: parameter.hullColor,
                    metalness: 0,
                    roughness: 0.5,
                    side: THREE.DoubleSide,
                   
                    
                })
            })
    
            door_R_Up.traverse((child)=>{
                child.material = new THREE.MeshStandardMaterial({
                    color:  parameter.hullColor,
                    metalness: 0,
                    roughness: 0.5,
                    side: THREE.DoubleSide,
                   
                    
                })
            })

            door_L_Up.traverse((child)=>{
                if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial){
                    child.material = new THREE.MeshStandardMaterial({
                        color: parameter.hullColor,
                        metalness: 0,
                        roughness: 0.5,
                        side: THREE.DoubleSide,
                       
                        
                    })
                }
            })
    
            door_L_bt.traverse((child)=>{
                if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial){
                    child.material = new THREE.MeshStandardMaterial({
                        color:  parameter.hullColor,
                        metalness: 0,
                        roughness: 0.5,
                        side: THREE.DoubleSide,
                       
                        
                    })
                }
            })
    
            // renderer.render(scene, camera)
        })
        gui.addColor(parameter, 'sailColor').onChange(()=>{
            sail.material.color.set(parameter.sailColor)
            // renderer.render(scene, camera)
        })

        gui.addColor(parameter, 'flagColor').onChange(()=>{
            flag.material.color.set(parameter.flagColor)
            // renderer.render(scene, camera)
        })

        



    }
)


/**
 * Animation
 */
 

/**
 * Water
 */



// Geometry
const waterGeometry = new THREE.PlaneGeometry(200, 200, 1024, 1024)

//Color
debugObject.depthColor = '#186692'
debugObject.surfaceColor = '#96cfe1'

// Material
const waterMaterial = new THREE.ShaderMaterial({
    vertexShader: waterVertexShader,
    fragmentShader: waterFragmentShader,
   depthTest: true,
    uniforms:
    {
        uTime:{ value:0},
        
        uBigWavesElevation: { value: 0.475 },
        uBigWavesFrequency: { value: new THREE.Vector2(0.195, 0.195)},
        uBigWavesSpeed: {value: 0.75},
        
        uSmallWavesElevation: {value: 0.15},
        uSmallWavesFrequency: {value: 0.586},
        uSmallWavesSpeed: {value: 0.425},
        uSmallWavesIterations: {value: 3},


        uDepthColor: {value: new THREE.Color(debugObject.depthColor) },
        uSurfaceColor: {value: new THREE.Color(debugObject.surfaceColor)},
        uColorOffset: {value: 0.08},
        uColorMultiplier: {value: 1.062},
    }
})

gui.add(waterMaterial.uniforms.uBigWavesElevation,'value').min(0).max(1).step(0.001).name('uBigWavesElevation')
gui.add(waterMaterial.uniforms.uBigWavesFrequency.value,'x').min(0).max(10).step(0.001).name('uBigWavesFrequencyX')
gui.add(waterMaterial.uniforms.uBigWavesFrequency.value,'y').min(0).max(10).step(0.001).name('uBigWavesFrequencyY')
gui.add(waterMaterial.uniforms.uBigWavesSpeed,'value').min(0).max(4).step(0.001).name('uBigWavesSpeed')

gui.add(waterMaterial.uniforms.uSmallWavesElevation,'value').min(0).max(1).step(0.001).name('uSmallWavesElevation')
gui.add(waterMaterial.uniforms. uSmallWavesFrequency,'value').min(0).max(30).step(0.001).name('uSmallWavesFrequency')
gui.add(waterMaterial.uniforms.uSmallWavesSpeed,'value').min(0).max(4).step(0.001).name('uSmallWavesSpeed')
gui.add(waterMaterial.uniforms.uSmallWavesIterations,'value').min(0).max(8).step(1).name('uSmallWavesIterations')

gui.addColor(debugObject,'depthColor').name('depthColor').onChange(()=>{
    waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor)
})
gui.addColor(debugObject,'surfaceColor').name('surfaceColor').onChange(()=>{
    waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor)
})

gui.add(waterMaterial.uniforms.uColorOffset,'value').min(0).max(1).step(0.001).name('uColorOffset')
gui.add(waterMaterial.uniforms.uColorMultiplier,'value').min(0).max(10).step(0.001).name('uColorMultiplier')



// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial)
water.rotation.x =  -Math.PI * 0.5
scene.add(water)



/**
 * Physics
 */

 

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 10, 5)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
   
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
//Base camera
const camera = new THREE.PerspectiveCamera(70, sizes.width / sizes.height, 0.1, 1000)
camera.rotation.y = -Math.PI * 0.5
      
camera.position.x = shipGroup.position.x +10
camera.position.z = shipGroup.position.z -10
camera.position.y = 15
camera.lookAt(shipGroup.position);
scene.add(camera)

// OrthographicCamera
// debugObject.cameraHeight =15

// const camera = new THREE.OrthographicCamera( sizes.width / 100,  sizes.width / -100, sizes.height / 100, sizes.height / -100, 1, 2000 );
// camera.lookAt(shipGroup.position)
// camera.position.set(10, debugObject.cameraHeight,10)
// gui.add(debugObject,'cameraHeight').min(0).max(100).step(0.001).name('cameraY')



const change_cam_orientation = () => {
    if(change_cam_angle){
        camera.position.x = 10;
        camera.position.y = 60;
        camera.position.z = -10;
        camera.lookAt(shipGroup.position);
    } else {
        camera.rotation.y = -Math.PI * 0.5
      
        camera.position.x = shipGroup.position.x +10
        camera.position.z = shipBody.position.z -10
        camera.position.y = 15
        camera.lookAt(shipGroup.position);
    }
}



// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(shipGroup.position.x, shipGroup.position.y, shipGroup.position.z)
controls.enableDamping = true

debugObject.speed =0.04

gui.add(debugObject,'speed').min(0).max(1).step(0.01).name('shipSpeed')

let currentShipPositionX = shipGroup.position.x
let currentShipPositionY = shipGroup.position.y
let currentShipPositionZ = shipGroup.position.z



let yAxis = new THREE.Vector3(0,1,0)
let rotation
let currentRotation
function moveShip(){
    if(left){
       
        rotation = new THREE.Quaternion().setFromAxisAngle(yAxis, Math.PI/120)
        currentRotation = shipBody.quaternion
        currentRotation.mult(rotation, currentRotation)  
        shipGroup.quaternion.copy(shipBody.quaternion)
       


    } else if (right){ 
       
        rotation = new THREE.Quaternion().setFromAxisAngle(yAxis, -Math.PI/120)
        currentRotation = shipBody.quaternion
        
        currentRotation.mult(rotation, currentRotation)
        shipGroup.quaternion.copy(shipBody.quaternion)
       
        


    } else if (forward){
        
       
        const direction = new THREE.Vector3()
        shipGroup.getWorldDirection(direction)
       
        let newShipPositionX = currentShipPositionX + direction.x*debugObject.speed
        let newShipPositionY = currentShipPositionY + direction.y*debugObject.speed
        let newShipPositionZ = currentShipPositionZ + direction.z*debugObject.speed
        // shipBody.position.x = newShipPositionX
        // shipBody.position.y = newShipPositionY
        // shipBody.position.z = newShipPositionZ
        gsap.to(shipBody.position,{x: newShipPositionX, y: newShipPositionY, z: newShipPositionZ, duration:2, delay:0.05})
    
        
        currentShipPositionX = newShipPositionX
        currentShipPositionY = newShipPositionY
        currentShipPositionZ = newShipPositionZ
     
        shipGroup.position.copy(shipBody.position)
        

    } else if (forward === 0){
       


    }

}




/**
 * Key Control
 * 
 */
let forward
let stop
let left
let right
let change_cam_angle


document.addEventListener('keydown',function(event){
    console.log(event.keyCode)
    let code = event.keyCode
    if (code==87) forward = 1 //w
    if (code==83) forward = 0 //s
    if (code==65) left = 1 //a
    if (code==68) right = 1 //d
    if (code==27) change_cam_angle =1 //esc
    
})


document.addEventListener('keyup',function(event){
    console.log(event.keyCode)
    let code = event.keyCode
    if (code==87) forward = 1 //w
    if (code==83) forward = 0 //s
    if (code==65) left = 0 //a
    if (code==68) right = 0 //d
    if (code==27) change_cam_angle = 0 //esc
    
})




/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))







/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0






const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime


     //Update water
     waterMaterial.uniforms.uTime.value = elapsedTime
   
   
     // Update physics
     world.step(1 / 60, deltaTime, 3)
     

    //Sail Control
    moveShip()
  
  


 
    // console.log(shipGroup.position)
   

   

    if(mixer)
    {
        mixer.update(deltaTime)
    }

    // Update controls
    controls.update()

    //update Camera
    change_cam_orientation()
    
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()