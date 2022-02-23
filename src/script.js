import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import vertexShader from './shaders/vertexShader.glsl'
import fragmentShader from './shaders/fragmentShader.glsl'

// Debug
const gui = new dat.GUI({
    closed: false,
    autoPlace: true,
    name: 'Controls',
    width: 400
})

const config = {
    redFrequencyWithPosition: 5,
    greenFrequencyWithPosition: 3,
    blueFrequencyWithPosition: 2,
    redFactor: 1,
    greenFactor: 1,
    blueFactor: 1,
    coloursMixingSpeed: 1,
    mixUniformly: false
}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
const geometry = new THREE.SphereBufferGeometry(1, 64, 64)

// Materials

const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
        uTime: { value: 0.0 },
        uRFreq: { value: config.redFrequencyWithPosition },
        uGFreq: { value: config.greenFrequencyWithPosition },
        uBFreq: { value: config.blueFrequencyWithPosition },
        uSpeed: { value: config.coloursMixingSpeed },
        uRFactor: { value: config.redFactor },
        uGFactor: { value: config.greenFactor },
        uBFactor: { value: config.blueFactor },
        uMixUniformly: { value: config.mixUniformly },
    },
    side: THREE.DoubleSide,
    // wireframe: true
})
// material.color = new THREE.Color(0xff0000)

// Mesh
const sphere = new THREE.Mesh(geometry,material)
scene.add(sphere)

const fwrtp = gui.addFolder('frequencies wrt position')
const cmp = gui.addFolder('colours mixing parameters')

fwrtp.add(config, 'redFrequencyWithPosition', 0, 10).onChange(() => {
    material.uniforms.uRFreq.value = config.redFrequencyWithPosition
})
fwrtp.add(config, 'greenFrequencyWithPosition', 0, 10).onChange(() => {
    material.uniforms.uGFreq.value = config.greenFrequencyWithPosition
})
fwrtp.add(config, 'blueFrequencyWithPosition', 0, 10).onChange(() => {
    material.uniforms.uBFreq.value = config.blueFrequencyWithPosition
})
cmp.add(config, 'coloursMixingSpeed', 0, 20).onChange(() => {
    material.uniforms.uSpeed.value = config.coloursMixingSpeed
})
cmp.add(config, 'redFactor', 0, 1).onChange(() => {
    material.uniforms.uRFactor.value = config.redFactor
})
cmp.add(config, 'greenFactor', 0, 1).onChange(() => {
    material.uniforms.uGFactor.value = config.greenFactor
})
cmp.add(config, 'blueFactor', 0, 1).onChange(() => {
    material.uniforms.uBFactor.value = config.blueFactor
})
cmp.add(config, 'mixUniformly').onChange(() => {
    material.uniforms.uMixUniformly.value = config.mixUniformly
})

// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

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
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2.2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableZoom = false
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = .1 * elapsedTime
    sphere.rotation.x = .1 * elapsedTime

    material.uniforms.uTime.value = elapsedTime

    // Update Orbital Controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()