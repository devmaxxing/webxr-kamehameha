import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { CreateSceneClass } from "../createScene";
import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { WebXRFeatureName } from "@babylonjs/core/XR/webXRFeaturesManager";
import { WebXRDefaultExperience } from "@babylonjs/core/XR/webXRDefaultExperience";
import { WebXRHandTracking } from "@babylonjs/core";

class HandTrackingScene implements CreateSceneClass {

    createScene = async(
        engine: Engine,
        canvas: HTMLCanvasElement
    ): Promise<Scene> => {
            // This creates a basic Babylon Scene object (non-mesh)
        var scene = new Scene(engine);

        // This creates and positions a free camera (non-mesh)
        var camera = new FreeCamera("camera1", new Vector3(0, 2, -0.6), scene);

        // This targets the camera to scene origin
        camera.setTarget(Vector3.Zero());

        // This attaches the camera to the canvas
        camera.attachControl(canvas, true);

        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        var light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);

        // Default intensity is 1. Let's dim the light a small amount
        light.intensity = 0.7;

        
        const xr = await WebXRDefaultExperience.CreateAsync(scene);
        const handsFeature = <WebXRHandTracking>xr.baseExperience.featuresManager.enableFeature(WebXRFeatureName.HAND_TRACKING, "latest", {
            xrInput: xr.input
        });

        handsFeature.onHandAddedObservable.add((hand) => {
            const obs = xr.baseExperience.sessionManager.onXRFrameObservable.add(() => {
                if (hand.handMesh) {
                    
                    // xr.baseExperience.sessionManager.onXRFrameObservable.remove(obs);
                }
            });
        })

        return scene;
    }
}

export default new HandTrackingScene();