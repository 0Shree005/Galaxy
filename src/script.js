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
    
    for(let i = 0; i < parameters.count; i++)
    {
        // Position
        const i3 = i * 3

        // const radius = 0.5 / (Math.random() * parameters.radius) - 0.5

        const radius =  Math.random() * parameters.radius

        const spinAngle = (radius * parameters.spin)
        const branchAngle = ((i % parameters.branches) / parameters.branches * Math.PI * 2 ) 

        const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius
        const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius


        // parameters.sin = (Math.tan(branchAngle + spinAngle) * radius + randomX) // cool earth's magnetic field effect with tan()

        // parameters.sinX = Math.sin(branchAngle + spinAngle)
        // parameters.cosX = Math.cos(branchAngle + spinAngle)
        // parameters.tanX = Math.tan(branchAngle + spinAngle)

        // const sinXassignment = () => {
        //     parameters.angle = Math.sin(branchAngle + spinAngle)
        // }  

        // // parameters.sixButton = () => {
        // //     sinXassignment();
        // // }

        // parameters.angle = () => {
        //     sinXassignment();
        // }


        // // positions[i3 + 0] = (Math.sin(branchAngle + spinAngle) * radius + randomX) 
        // // positions[i3 + 0] =  parameters.sinX * radius + randomX 

        positions[i3 + 0] = (Math.sin(branchAngle + spinAngle) * radius + randomX) 
        positions[i3 + 1] = (randomY) 
        positions[i3 + 2] = (Math.cos(branchAngle + spinAngle) * radius + randomZ)
    
        // Colors
        const mixedColor = colorinside.clone()
        mixedColor.lerp(coloroutside, radius / parameters.radius) 

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
const features = gui.addFolder("Features")
// const Angles = gui.addFolder("Angles")
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
dimensions.add(parameters, 'size').min(0.001).max(0.1).step(0.001).name("size of stars").onFinishChange( generateGalaxy )
dimensions.add(parameters, 'radius').min(0.01).max(20).step(0.001).name("radius of the galaxy").onChange( generateGalaxy )

// features
features.add(parameters, 'count').min(1000).max(1000000).step(100).name("no. of stars").onFinishChange( generateGalaxy )
features.add(parameters, 'branches').min(2).max(20).step(1).onFinishChange( generateGalaxy )
features.add(parameters, 'spin').min(-5).max(5).step(0.0001).name("branch spin angle").onChange( generateGalaxy )


// Angles 
// Angles.add(parameters, 'sinX').onclick( generateGalaxy )

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
        saveBlob(blob, `screencapture-${canvas.width}x${canvas.height}.png`);
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