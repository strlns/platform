import { Application } from "pixi.js";
import { IScene } from "./Scene";

/**
 * Recipe from
 * pixijsfundamentals.com, only slightly adapted so far.
 */
export class SceneManager {
  private constructor() {
    if (new.target) {
      throw new Error(
        "This static singleton is not meant to be instantiated with new. Use the static method initialize() instead."
      );
    }
  }

  // Safely store variables for our game
  private static app: Application;
  private static currentScene: IScene;

  // Width and Height are read-only after creation (for now)
  private static _width: number;
  private static _height: number;

  // With getters but not setters, these variables become read-only
  public static get width(): number {
    return SceneManager._width;
  }
  public static get height(): number {
    return SceneManager._height;
  }

  // Use this function ONCE to start the entire machinery
  public static initialize(
    width: number,
    height: number,
    backgroundColor?: number
  ): void {
    if (SceneManager.app) {
      throw new Error("Already initialized.");
    }
    // store our width and height
    SceneManager._width = width;
    SceneManager._height = height;

    // Create our pixi app
    SceneManager.app = new Application({
      view: document.getElementById("game") as HTMLCanvasElement,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
      backgroundColor,
      width,
      height,
    });

    // Add the ticker
    SceneManager.app.ticker.add(SceneManager.update);
  }

  // Call this function when you want to go to a new scene
  public static async changeScene(newScene: IScene): Promise<void> {
    // Remove and destroy old scene... if we had one..
    if (SceneManager.currentScene) {
      SceneManager.app.stage.removeChild(
        SceneManager.currentScene.displayObject
      );
      SceneManager.currentScene.displayObject.destroy();
    }

    SceneManager.currentScene = newScene;
    SceneManager.app.stage.addChild(SceneManager.currentScene.displayObject);
  }

  // This update will be called by a pixi ticker and tell the scene that a tick happened
  public static update(framesPassed: number): void {
    if (SceneManager.currentScene?.update) {
      SceneManager.currentScene.update(framesPassed);
    }
    // TO DO: Use real time instead of frames for timing.
  }
}
