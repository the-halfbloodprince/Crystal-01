# Basic Setup Instructions for a three js project

1. Create a basic vertex shader

   ```glsl
   void main() {
       vec4 modelPosition = modelMatrix * vec4(position, 1.0);
       vec4 viewPosition = viewMatrix * modelPosition;
       vec4 projectionPosition = projectionMatrix * viewPosition;

       gl_Position = projectedPosition;
   }

   ```

1. Create a basic fragment shader

   ```glsl
   void main {
       gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
   }
   ```

1. Import dependencies and shaders

   ```js
   import * as THREE from 'three';

   import vertexShader from './shaders/vertexShader.glsl';
   import fragmentShader from './shaders/fragmentShader.glsl';
   ```

1. create the config object

   ```js
   const config = {
   	width: window.innerWidth,
   	height: window.innerHeight,
   };
   ```

1. get the canvas element

   ```js
   const canvas = document.querySelector('canvas.webgl');
   ```

1. create the scene

   ```js
   const scene = new THREE.Scene();
   ```

1. create an object

   ```js
   const geometry = new THREE.BoxBufferGeometry(1, 1);

   // using a shader material
   const material = new THREE.ShaderMaterial({
   	vertexShader: vertexShader,
   	fragmentShader: fragmentShader,
   });
   material.color = new THREE.Color(0xff0000);
   const box = new THREE.Mesh(geometry, material);
   ```

1. Add the object to the scene

   ```js
   scene.add(box);
   ```

1. Add lights

   ```js
   // constructor PointLight(color?: THREE.ColorRepresentation, intensity?: number, distance?: number, decay?: number): THREE.PointLight
   const pointLight = new THREE.PointLight(0xffffff, 0.1);
   pointLight.position.x = 2;
   pointLight.position.y = 3;
   pointLight.position.z = 4;

   scene.add(pointLight);
   ```

1. Set camera up

   ```js
   const camera = new THREE.PerspectiveCamera(
   	75,
   	config.width / config.height,
   	0.1,
   	100
   );
   camera.position.x = 0;
   camera.position.y = 0;
   camera.position.z = 2;

   scene.add(camera);
   ```

1. _Optional:_ Set up orbit controls

   ```js
   import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

   const controls = new OrbitControls(camera, canvas);
   controls.enableDamping = true;
   ```

1. Initialize renderer

   ```js
   const renderer = new THREE.WebGLRenderer({
   	canvas: canvas,
   });
   renderer.setSize(config.width, config.height);
   renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
   ```

1. Add animation

   ```js
   const clock = new THREE.Clock();

   const tick = () => {
   	const elapsedTime = Clock.getElapsedTime();

   	// Update objects
   	box.rotation.y = 0.5 * elapsedTime;

   	// Update controls
   	controls.update();

   	// render
   	renderer.render(scene, camera);

   	// call tick again on next frame
   	window.requestAnimationFrame(tick);
   };

   tick();
   ```

1. Add resizing fix

   ```js
   window.addEventListener('resize', () => {
   	(config.height = window.innerHeight),
   		(config.width = window.innerWidth),
   		// update camera
   		(camera.aspect = config.width / config.height);
   	camera.updateProjectionMatrix();

   	//update renderer
   	renderer.setSize(config.width, config.height);
   	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // the pixel ration must be at max 2 for best performance and quality
   });
   ```

1. Add dat.gui

   ```js
   import * as dat from 'dat.gui';

   const gui = new dat.GUI();
   ```

Based on Bruno Simon's starter template in his course **ThreeJS Journey**
