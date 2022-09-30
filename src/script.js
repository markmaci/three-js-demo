import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'



// Debug
const gui = new dat.GUI()
const canvas = document.querySelector('canvas.webgl')

const scene = new THREE.Scene()

const axesHelper = new THREE.AxesHelper()
// scene.add(axesHelper)

const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/textures/matcaps/9.png')
console.log(matcapTexture);


const fontLoader = new FontLoader()

fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) =>
    {
        const textGeometry = new TextGeometry(
            'Mark Maci',
            {
                font: font,
                size: 0.5,
                height: 0.2,
                curveSegments: 100,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 30
            }
        )

        // textGeometry.computeBoundingBox()
        // textGeometry.translate(
        //    - (textGeometry.boundingBox.max.x - 0.02) * 0.5,
        //    - (textGeometry.boundingBox.max.y - 0.02) * 0.5,
        //     - (textGeometry.boundingBox.max.z - 0.02) * 0.5,
        // )

        textGeometry.center()
       

        
        const material = new THREE.MeshMatcapMaterial()
        material.matcap = matcapTexture
        const text = new THREE.Mesh(textGeometry, material)
        scene.add(text)

        const donutGeometry = new THREE.TorusGeometry(0.3, 0.1, 20, 45)
        // const donutMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })

        console.time('donuts')
        for(let i = 0; i < 200; i++)
            {
                
                const donut = new THREE.Mesh(donutGeometry, material)
                donut.position.x = (Math.random() - 0.5) * 10
                donut.position.y = (Math.random() - 0.5) * 10
                donut.position.z = (Math.random() - 0.5) * 10

                donut.rotation.x = Math.random() * Math.PI
                donut.rotation.y = Math.random() * Math.PI
                donut.rotation.z = Math.random() * Math.PI
                
                const scale = Math.random()
                donut.scale.set(scale, scale, scale)
                

        

                scene.add(donut)
            }
            console.timeEnd('donuts')
        
        
    }
)

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{ 
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)


const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
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
    controls.update()
    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()