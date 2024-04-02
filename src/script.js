import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import galaxyVertexShader from './shaders/vertex.glsl'
import galaxyFragmentShader from './shaders/fragment.glsl'
import { OutlineEffect } from 'three/examples/jsm/effects/OutlineEffect.js'
import { inject } from "@vercel/analytics"

inject();

let totalElapsedTime = 0;

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Galaxy
 */
const parameters = {}
parameters.count = 200000
parameters.size = 0.005
parameters.radius = 5
parameters.branches = 3
parameters.spin = 1
parameters.randomness = 0.2
parameters.randomnessPower = 3
parameters.insideColor = '#ff6030'
parameters.outsideColor = '#1b3984'
parameters.isAnimating = true;
parameters.speed = 0.5;
parameters.trigFunctionX = 1;
parameters.trigFunctionZ = 0;
parameters.screenshotButton = function () {
    takeScreenshot();
};

let geometry = null
let material = null
let points = null

const generateGalaxy = () =>
{
    if(points !== null)
    {
        geometry.dispose()
        material.dispose()
        scene.remove(points)
    }

    /**
     * Geometry
     */
    geometry = new THREE.BufferGeometry()

    const positions = new Float32Array(parameters.count * 3)
    const randomness = new Float32Array(parameters.count * 3)
    const colors = new Float32Array(parameters.count * 3)
    const scales = new Float32Array(parameters.count * 1)

    const insideColor = new THREE.Color(parameters.insideColor)
    const outsideColor = new THREE.Color(parameters.outsideColor)

    for(let i = 0; i < parameters.count; i++)
    {
        const i3 = i * 3

        // Position
        const radius = Math.random() * parameters.radius

        const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2

        const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius
        const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius

        positions[i3    ] = Math.cos(branchAngle) * radius
        positions[i3 + 1] = 0
        positions[i3 + 2] = Math.sin(branchAngle) * radius
    
        randomness[i3    ] = randomX
        randomness[i3 + 1] = randomY
        randomness[i3 + 2] = randomZ

        // Color
        const mixedColor = insideColor.clone()
        mixedColor.lerp(outsideColor, radius / parameters.radius)

        colors[i3    ] = mixedColor.r
        colors[i3 + 1] = mixedColor.g
        colors[i3 + 2] = mixedColor.b

        // Scale
        scales[i] = Math.random()
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('aRandomness', new THREE.BufferAttribute(randomness, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))

    /**
     * Material
     */
    material = new THREE.ShaderMaterial({
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
        uniforms:
        {
            uTime: { value: 0 },
            uSize: { value: 10 * renderer.getPixelRatio() },
            uSpeed: { value: parameters.speed },
            uTrigFunctionX: { value: parameters.trigFunctionX },
            uTrigFunctionZ: { value: parameters.trigFunctionZ }
        },   
        vertexShader: galaxyVertexShader,
        fragmentShader: galaxyFragmentShader
    })

    /**
     * Points
     */
    points = new THREE.Points(geometry, material)
    scene.add(points)
}

// Create folders
let structureFolder = gui.addFolder('Structure');
let randomnessFolder = gui.addFolder('Randomness');
let trigFunctionFolder = gui.addFolder('Trig Functions');


// Add parameters to folders

structureFolder.add(parameters, 'count').min(100).max(1000000).step(100).onFinishChange(generateGalaxy);
structureFolder.add(parameters, 'radius').min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy); 
structureFolder.add(parameters, 'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy); 

randomnessFolder.add(parameters, 'randomness').min(0).max(2).step(0.001).onFinishChange(generateGalaxy);
randomnessFolder.add(parameters, 'randomnessPower').min(1).max(10).step(0.001).onFinishChange(generateGalaxy);

trigFunctionFolder.add(parameters, 'trigFunctionX', {Cos: 0, Sin: 1, Tan: 2, Sec: 3, Cosec: 4, Cot: 5, Cosh: 6, Sinh: 7, Tanh: 8, Sech: 9, Cosech: 10, Coth: 11}).name('trigFuncX');
trigFunctionFolder.add(parameters, 'trigFunctionZ', {Cos: 0, Sin: 1, Tan: 2, Sec: 3, Cosec: 4, Cot: 5, Cosh: 6, Sinh: 7, Tanh: 8, Sech: 9, Cosech: 10, Coth: 11}).name('trigFuncZ');


gui.add(parameters, 'isAnimating').name('Animate').onFinishChange(() => {
    if(parameters.isAnimating) {
        tick();
        clock.start();
    } else {
        clock.stop();
        clock.elapsedTime = 0;
    }
});

gui.add(parameters, 'speed').min(0).max(100).step(0.001).name('Speed');

gui.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy);
gui.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy);



gui.add(parameters, 'screenshotButton').name("Take a picture it lasts longer!");



randomnessFolder.close();
trigFunctionFolder.close();
structureFolder.close();
gui.close();
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

const trigFunctionMapping = {
    0: 'Cos',
    1: 'Sin',
    2: 'Tan',
    3: 'Sec',
    4: 'Cosec',
    5: 'Cot',
    6: 'Cosh',
    7: 'Sinh',
    8: 'Tanh',
    9: 'Sech',
    10: 'Cosech',
    11: 'Coth'
};

const takeScreenshot = () => {
    outlineEffect.render(scene, camera);
    canvas.toBlob((blob) => {
        saveBlob(blob, `trigFuncX~ ${trigFunctionMapping[parameters.trigFunctionX]}, trigFuncZ~ ${trigFunctionMapping[parameters.trigFunctionZ]}, radius~ ${parameters.radius}, insideColor~ ${parameters.insideColor}, outsideColor~ ${parameters.outsideColor}, .png`);
    });
};
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Generate the first galaxy
 */
generateGalaxy()

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    totalElapsedTime += elapsedTime;

    // Update controls
    controls.update()

    if(parameters.isAnimating)
    {
        clock.start();

        // Update material
        material.uniforms.uTime.value = totalElapsedTime;
        material.uniforms.uSpeed.value = parameters.speed;
        material.uniforms.uTrigFunctionX.value = parameters.trigFunctionX;
        material.uniforms.uTrigFunctionZ.value = parameters.trigFunctionZ;
    }

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
}

tick();