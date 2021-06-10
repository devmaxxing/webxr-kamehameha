import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { SphereBuilder } from "@babylonjs/core/Meshes/Builders/sphereBuilder";
import { GroundBuilder } from "@babylonjs/core/Meshes/Builders/groundBuilder";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
// import {BABYLON} from '@babylonjs/core'
import {CreateSceneClass} from "../createScene";

// If you don't need the standard material you will still need to import it since the scene requires it.
// import "@babylonjs/core/Materials/standardMaterial";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";

import grassTextureUrl from "../../assets/grass.jpg";

import Flare from '../../assets/Flare.png';
import { Color4, CustomParticleEmitter, GPUParticleSystem, Mesh, ParticleSystem } from "@babylonjs/core";

export class DefaultSceneWithTexture implements CreateSceneClass {

    createScene = async (
        engine: Engine,
        canvas: HTMLCanvasElement
    ): Promise<Scene> => {
        // This creates a basic Babylon Scene object (non-mesh)
        const scene = new Scene(engine);
    
        // This creates and positions a free camera (non-mesh)

        const camera = new ArcRotateCamera("ArcRotateCamera", -Math.PI / 2, Math.PI / 2.2, 10, new Vector3(0, 0, 0), scene);

        // const camera = new ArcRotateCamera("camera",0,  -Math.PI / 2, Math.PI / 2.5, 3, new Vector3(0, 0, 0));
    
        // This targets the camera to scene origin
        camera.setTarget(Vector3.Zero());
    
        // This attaches the camera to the canvas
        camera.attachControl(canvas, true);
    
        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    
        // Default intensity is 1. Let's dim the light a small amount
        light.intensity = 0.7;
    
        // Our built-in 'sphere' shape.
        const sphere = SphereBuilder.CreateSphere(
            "sphere",
            { diameter: 1, segments: 30 },
            scene
        );


        // sphere type 
    
        // Move the sphere upward 1/2 its height
        sphere.position.y = 1;
    


       // create particle system.
       var particleEffect = new ParticleSystem('particles', 1000, scene)

       const createRaySystem = () => {

        particleEffect.particleTexture = new Texture(Flare, scene);
        particleEffect.color1 = new Color4(Math.random(), Math.random(), Math.random(), 1);

        // Size of each particle (random between...
        particleEffect.minSize = 0;
        particleEffect.maxSize = 1;

        // Life time of each particle (random between...
        particleEffect.minLifeTime = 0.3;
        particleEffect.maxLifeTime = 1.5;

        // Emission rate
        particleEffect.emitRate = 1000;

            // Speed
            particleEffect.minEmitPower = 1;
            particleEffect.maxEmitPower = 3;
            particleEffect.updateSpeed = 0.005;

            
    /******* Emission Space ********/
    particleEffect.createPointEmitter(new Vector3(3, 5, -3), new Vector3(-3, 5, 3));


    particleEffect.start(); 
       }




        // create createInwardParticle
        var particleSystem: any
        var useGPUVersion = true;
        var fountain = Mesh.CreateBox("fountain", 0.1, scene);
        fountain.visibility = 0.1;
        
        var createInwardParticle = function() {
            if (particleSystem) {
                particleSystem.dispose();
            }
    
             if (useGPUVersion ) {
                particleSystem = new GPUParticleSystem("particles", { capacity:1000000}, scene);
                particleSystem.activeParticleCount = 200000;
             } else {
                particleSystem = new ParticleSystem("particles", 50000 , scene);
             }
    
            var customEmitter = new CustomParticleEmitter();
    
            let id = 0;
            // shape be line, not circle (nide to have)
            customEmitter.particlePositionGenerator = (index, particle, out) => {
                out.x = Math.cos(id) * 2;
                out.y = Math.sin(id) * 2
                // come from z 
                out.z = 0;
                id += 0.01;
            }
    
            customEmitter.particleDestinationGenerator = (index, particle, out) => {
                out.x = 0;
                out.y = 0;
                out.z = 0;
            }
        
            particleSystem.emitRate = 100;
            particleSystem.particleEmitterType = customEmitter;
            //replace
            particleSystem.particleTexture = new Texture(Flare, scene);
            particleSystem.maxLifeTime = 10;
            particleSystem.minSize = 0.01;
            particleSystem.maxSize = 0.1;
            particleSystem.emitter = fountain 

            // particleSystem.createPointEmitter(new Vector3(-3, 5, 3), new Vector3(3, 5, -3));
        
            particleSystem.start();
        }
    
        createInwardParticle();
        createRaySystem()

        setInterval(() => {
            // particleEffect.stop();
            // particleSystem.stop();
        }, 5000)

        // Our built-in 'ground' shape.
        const ground = GroundBuilder.CreateGround(
            "ground",
            { width: 6, height: 6 },
            scene
        );
    
        // Load a texture to be used as the ground material
        const groundMaterial = new StandardMaterial("ground material", scene);
        groundMaterial.diffuseTexture = new Texture(grassTextureUrl, scene);
    
        ground.material = groundMaterial;
    
        return scene;
    };
}

export default new DefaultSceneWithTexture();