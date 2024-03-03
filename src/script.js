import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import gsap from 'gsap'
import { OutlineEffect } from 'three/examples/jsm/effects/OutlineEffect.js'

/**
 * Base
 */
// Debug
const gui = new GUI({
    width: 320,
    title: "Controls for the Galaxy!",
    closeFolders: true
})
gui.close()

window.addEventListener('keydown', (event) => {
    if(event.key == 'h'){
        gui.show(gui._hidden)
    }
})
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Parameters 
 */
const parameters = {}
parameters.count = 90000
parameters.size = 0.001
parameters.radius = 5
parameters.branches = 5
parameters.spin = -2 
parameters.randomness = 0.2 
parameters.randomnessPower = 3
parameters.insideColor = '#7765cb'
parameters.outsideColor = '#0a1e70'
parameters.panel = 'H - to hide the controls panel'
parameters.double = 'DoubleClick/Tap - on the screen to go fullscreen'
parameters.duration = 5

// Negative Rotation
parameters.NrotateX = () => {
    gsap.to(points.rotation, {  duration: parameters.duration, x: points.rotation.x - Math.PI * 2 })
}
parameters.NrotateY = () => {
    gsap.to(points.rotation, {  duration: parameters.duration, y: points.rotation.y - Math.PI * 2 })
}
parameters.NrotateZ = () => {
    gsap.to(points.rotation, {  duration: parameters.duration, z: points.rotation.z - Math.PI * 2 })
}
// Positive Rotation
parameters.ProtateX = () => {
    gsap.to(points.rotation, {  duration: parameters.duration, x: points.rotation.x + Math.PI * 2 })
}
parameters.ProtateY = () => {
    gsap.to(points.rotation, {  duration: parameters.duration, y: points.rotation.y + Math.PI * 2 })
}
parameters.ProtateZ = () => {
    gsap.to(points.rotation, {  duration: parameters.duration, z: points.rotation.z + Math.PI * 2 })
}

parameters.screenshotButton = () => {
    takeScreenshot();
};

parameters.radiusMultiplier = 1
parameters.branchMultiplier = 1
parameters.spinMultiplier = 1

parameters.angle = null;
parameters.angleX = 'sin';
parameters.angleZ = 'cos';


/**
 * Variables
 */
let geometry = null
let material = null
let points = null

const generateGalaxy = () => 
{
    /** 
     * Destroying Old Galaxy, to create a new one ("I used the stones to destroy the stones! -Thanos")O_O
     */
    if(points != null){

        geometry.dispose()
        material.dispose()
        scene.remove(points)
    }
    
    /**
     * Geometry
     */
    geometry = new THREE.BufferGeometry()

    const positions = new Float32Array(parameters.count * 3)
    const colors = new Float32Array(parameters.count * 3)
    
    const colorinside = new THREE.Color(parameters.insideColor)
    const coloroutside = new THREE.Color(parameters.outsideColor)
    
    const angle =   parameters.angle === null ? (val) => val :
                    parameters.angle === 'sin' ? Math.sin :
                    parameters.angle === 'cos' ? Math.cos :
                    parameters.angle === 'tan' ? Math.tan :
                    parameters.angle === 'sec' ? (angle) => 1 / Math.cos(angle) :
                    parameters.angle === 'csc' ? (angle) => 1 / Math.sin(angle) :
                    parameters.angle === 'cot' ? (angle) => 1 / Math.tan(angle) :
                    parameters.angle === 'sinh' ? Math.sinh :
                    parameters.angle === 'cosh' ? Math.cosh :
                    parameters.angle === 'tanh' ? Math.tanh :
                    parameters.angle === 'sech' ? (angle) => 1 / Math.cosh(angle) :
                    parameters.angle === 'csch' ? (angle) => 1 / Math.sinh(angle) :
                    parameters.angle === 'coth' ? (angle) => 1 / Math.tanh(angle) :
                    parameters.angle;
    
    
    const angleX =  parameters.angleX === 'sin' ? Math.sin : 
                    parameters.angleX === 'cos' ? Math.cos : 
                    parameters.angleX === 'tan' ? Math.tan :
                    parameters.angleX === 'sec' ? (angle) => 1 / Math.cos(angle) :
                    parameters.angleX === 'csc' ? (angle) => 1 / Math.sin(angle) :
                    parameters.angleX === 'cot' ? (angle) => 1 / Math.tan(angle) :
                    parameters.angleX === 'sinh' ? Math.sinh : 
                    parameters.angleX === 'cosh' ? Math.cosh : 
                    parameters.angleX === 'tanh' ? Math.tanh :
                    parameters.angleX === 'sech' ? (angle) => 1 / Math.cosh(angle) :
                    parameters.angleX === 'csch' ? (angle) => 1 / Math.sinh(angle) :
                    parameters.angleX === 'coth' ? (angle) => 1 / Math.tanh(angle) :
                    parameters.angleX;

    
    const angleZ =  parameters.angleZ === 'sin' ? Math.sin : 
                    parameters.angleZ === 'cos' ? Math.cos : 
                    parameters.angleZ === 'tan' ? Math.tan :
                    parameters.angleZ === 'sec' ? (angle) => 1 / Math.cos(angle) :
                    parameters.angleZ === 'csc' ? (angle) => 1 / Math.sin(angle) :
                    parameters.angleZ === 'cot' ? (angle) => 1 / Math.tan(angle) :
                    parameters.angleZ === 'sinh' ? Math.sinh : 
                    parameters.angleZ === 'cosh' ? Math.cosh : 
                    parameters.angleZ === 'tanh' ? Math.tanh :
                    parameters.angleZ === 'sech' ? (angle) => 1 / Math.cosh(angle) :
                    parameters.angleZ === 'csch' ? (angle) => 1 / Math.sinh(angle) :
                    parameters.angleZ === 'coth' ? (angle) => 1 / Math.tanh(angle) :
                    parameters.angleZ;



    for(let i = 0; i < parameters.count; i++)
    {
        // Position
        const i3 = i * 3

        // const radius = 0.5 / (Math.random() * parameters.radius) - 0.5

        const radius = angle(Math.random() * parameters.radius)
        const spinAngle = angle(radius * parameters.spin)
        const branchAngle = angle((i % parameters.branches) / parameters.branches * Math.PI * 2 ) 

        const radiusMultiplier =    parameters.radiusMultiplier === 'sin' ? Math.sin :
                                    parameters.radiusMultiplier === 'cos' ? Math.cos :
                                    parameters.radiusMultiplier === 'tan' ? Math.tan :
                                    parameters.radiusMultiplier === 'sec' ? (angle) => 1 / Math.cos(angle) :
                                    parameters.radiusMultiplier === 'csc' ? (angle) => 1 / Math.sin(angle) :
                                    parameters.radiusMultiplier === 'cot' ? (angle) => 1 / Math.tan(angle) :
                                    parameters.radiusMultiplier === 'sinh' ? Math.sinh : 
                                    parameters.radiusMultiplier === 'cosh' ? Math.cosh : 
                                    parameters.radiusMultiplier === 'tanh' ? Math.tanh :
                                    parameters.radiusMultiplier === 'sech' ? (angle) => 1 / Math.cosh(angle) :
                                    parameters.radiusMultiplier === 'csch' ? (angle) => 1 / Math.sinh(angle) :
                                    parameters.radiusMultiplier === 'coth' ? (angle) => 1 / Math.tanh(angle) :
                                    (val) => val;

        const spinMultiplier  =     parameters.spinMultiplier === 'sin' ? Math.sin :
                                    parameters.spinMultiplier === 'cos' ? Math.cos :
                                    parameters.spinMultiplier === 'tan' ? Math.tan :
                                    parameters.spinMultiplier === 'sec' ? (angle) => 1 / Math.cos(angle) :
                                    parameters.spinMultiplier === 'csc' ? (angle) => 1 / Math.sin(angle) :
                                    parameters.spinMultiplier === 'cot' ? (angle) => 1 / Math.tan(angle) :
                                    parameters.spinMultiplier === 'sinh' ? Math.sinh : 
                                    parameters.spinMultiplier === 'cosh' ? Math.cosh : 
                                    parameters.spinMultiplier === 'tanh' ? Math.tanh :
                                    parameters.spinMultiplier === 'sech' ? (angle) => 1 / Math.cosh(angle) :
                                    parameters.spinMultiplier === 'csch' ? (angle) => 1 / Math.sinh(angle) :
                                    parameters.spinMultiplier === 'coth' ? (angle) => 1 / Math.tanh(angle) :
                                    (val) => val;

        const branchMultiplier  =   parameters.branchMultiplier === 'sin' ? Math.sin :
                                    parameters.branchMultiplier === 'cos' ? Math.cos :
                                    parameters.branchMultiplier === 'tan' ? Math.tan :
                                    parameters.branchMultiplier === 'sec' ? (angle) => 1 / Math.cos(angle) :
                                    parameters.branchMultiplier === 'csc' ? (angle) => 1 / Math.sin(angle) :
                                    parameters.branchMultiplier === 'cot' ? (angle) => 1 / Math.tan(angle) :
                                    parameters.branchMultiplier === 'sinh' ? Math.sinh : 
                                    parameters.branchMultiplier === 'cosh' ? Math.cosh : 
                                    parameters.branchMultiplier === 'tanh' ? Math.tanh :
                                    parameters.branchMultiplier === 'sech' ? (angle) => 1 / Math.cosh(angle) :
                                    parameters.branchMultiplier === 'csch' ? (angle) => 1 / Math.sinh(angle) :
                                    parameters.branchMultiplier === 'coth' ? (angle) => 1 / Math.tanh(angle) :
                                    (val) => val;

        const finalRadius = radiusMultiplier(radius);
        const finalSpinAngle = spinMultiplier(spinAngle);
        const finalBranchAngle = branchMultiplier(branchAngle);

        const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * finalRadius
        const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * finalRadius
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * finalRadius

        const posX = angleX(finalBranchAngle + finalSpinAngle);
        const posZ = angleZ(finalBranchAngle + finalSpinAngle);

        positions[i3    ] = posX * finalRadius + randomX
        positions[i3 + 1] = randomY
        positions[i3 + 2] = posZ * finalRadius + randomZ

        // Colors
        const mixedColor = colorinside.clone()
        mixedColor.lerp(coloroutside, finalRadius / parameters.radius) 

        colors[i3 + 0] = mixedColor.r
        colors[i3 + 1] = mixedColor.g
        colors[i3 + 2] = mixedColor.b
    }


    geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3)
    )
    
    geometry.setAttribute(
        'color',
        new THREE.BufferAttribute(colors, 3)
    )
    
    /**
     * Material
     */
    material = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
    })

    /**
     * Points
     */
    points = new THREE.Points(geometry, material)
    scene.add(points)
}


/**
 * GUI
 */
// folders
const guide = gui.addFolder("Guide!")
guide.open()
const dimensions = gui.addFolder("Dimensions") 
const stars = dimensions.addFolder("Stars")
const Angles = gui.addFolder("Angles")
const arcAngle = Angles.addFolder("Arc Angles")
const multipliers = gui.addFolder("Multipliers")
const random = gui.addFolder("Randomness")
const colors = gui.addFolder("Colours")
const animation = gui.addFolder("Animations")
const positive =  animation.addFolder("Positive Rotations")
const negative =  animation.addFolder("Negative Rotations")
const capture = gui.addFolder("Capture")

// guide 
guide.add(parameters, 'panel')
guide.add(parameters, 'double')

// dimensions 
stars.add(parameters, 'size').min(0.001).max(0.1).step(0.001).name("size of stars").onFinishChange( generateGalaxy )
stars.add(parameters, 'count').min(1000).max(1000000).step(100).name("no. of stars").onFinishChange( generateGalaxy )
dimensions.add(parameters, 'radius').min(0.01).max(20).step(0.001).name("radius of the galaxy").onChange( generateGalaxy )
dimensions.add(parameters, 'branches').min(2).max(20).step(1).onFinishChange( generateGalaxy )

// Angles 
arcAngle.add(parameters, 'angleX', ['sin', 'cos', 'tan', 'sec', 'csc' , 'cot', 'sinh', 'cosh', 'tanh', 'sech', 'csch' , 'coth']).name("X-Axis Angle (aX)").onChange( generateGalaxy )
arcAngle.add(parameters, 'angleZ', ['sin', 'cos', 'tan', 'sec', 'csc' , 'cot', 'sinh', 'cosh', 'tanh', 'sech', 'csch' , 'coth']).name("Z-Axis Angle (aZ)").onChange( generateGalaxy )
Angles.add(parameters, 'spin').min(-5).max(5).step(0.0001).name("branch spin angle (BSP)").onChange( generateGalaxy )

// Multipliers
multipliers.add(parameters, 'radiusMultiplier', [1 , 'sin', 'cos', 'tan', 'sec', 'csc' , 'cot', 'sinh', 'cosh', 'tanh', 'sech', 'csch' , 'coth']).name("Radius Multiplier (RM)").onChange(generateGalaxy);
multipliers.add(parameters, 'branchMultiplier', [1 , 'sin', 'cos', 'tan', 'sec', 'csc' , 'cot', 'sinh', 'cosh', 'tanh', 'sech', 'csch' , 'coth']).name("Branch Multiplier (BrM)").onChange(generateGalaxy);
multipliers.add(parameters, 'spinMultiplier', [1 , 'sin', 'cos', 'tan', 'sec', 'csc' , 'cot', 'sinh', 'cosh', 'tanh', 'sech', 'csch' , 'coth']).name("Spin Multiplier (SpM)").onChange(generateGalaxy);

// random
random.add(parameters, 'randomness') .min(0) .max(2) .step(0.001).onFinishChange( generateGalaxy )
random.add(parameters, 'randomnessPower').min(1).max(10).step(0.001).onFinishChange( generateGalaxy )

// colors
colors.addColor(parameters, 'insideColor').onChange( generateGalaxy )
colors.addColor(parameters, 'outsideColor').onChange( generateGalaxy )

// animations
animation.add(parameters, 'duration').name("Animation Duration").min(1).max(15).step(1)

// Positive Rotations
positive.add(parameters, 'ProtateX').name("rotateX")
positive.add(parameters, 'ProtateY').name("rotateY")
positive.add(parameters, 'ProtateZ').name("rotateZ")

// Negative Rotations
negative.add(parameters, 'NrotateX').name("rotateX")
negative.add(parameters, 'NrotateY').name("rotateY")
negative.add(parameters, 'NrotateZ').name("rotateZ")

// screenshot 
capture.add(parameters, 'screenshotButton').name("Take a picture it lasts longer!")

generateGalaxy()


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

    // // Update renderer
    // renderer.setSize(sizes.width, sizes.height)
    // renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // Update renderer
    outlineEffect.setSize(sizes.width, sizes.height)
    outlineEffect.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})
window.addEventListener('dblclick', (event) => {
    if(!document.fullscreenElement){

        canvas.requestFullscreen()
        // console.log("go FullScreen")
    }
    else{

        document.exitFullscreen()
        // console.log("leave Fullscreen")
    }
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 3
camera.position.y = 3
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const outlineEffect = new OutlineEffect(renderer, {
    defaultThickness: 0.0035,
    defaultColor: [ 0, 0, 0 ],
    defaultAlpha: 0.8,
    defaultKeepAlive: true
  })


const saveBlob = (function() {
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style.display = 'none';
    return function saveData(blob, fileName) {
       const url = window.URL.createObjectURL(blob);
       a.href = url;
       a.download = fileName;
       a.click();
    };
})();

const takeScreenshot = () => {
    outlineEffect.render(scene, camera);
    canvas.toBlob((blob) => {
        saveBlob(blob, `aX~ ${parameters.angleX},  aZ~ ${parameters.angleZ},  BSP~ ${parameters.spin},  RM~ ${parameters.radiusMultiplier},  BrM~ ${parameters.branchMultiplier},  SpM~ ${parameters.spinMultiplier}.png`);
    });
};

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    // renderer.render(scene, camera)
    outlineEffect.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()