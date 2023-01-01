import { Container, DisplayObject } from "pixi.js";

export interface ISceneInitializer<T = unknown, U = Container> {
  fetchData?: () => Promise<T>;
  displayObjectClass: { new (): DisplayObject & U }; //class for the top-level display object.
  sceneClass: { new (...args: any[]): Scene<T> };
  // sceneClass: Scene<T>;
}

export abstract class Scene<T = undefined, U = Container> implements IScene {
  assets: T;
  displayObject: U & DisplayObject;
  public constructor(assets: T, displayObject: U & DisplayObject) {
    this.assets = assets;
    this.displayObject = displayObject;
    this.initialize();
  }
  /**
   * Call and await this method instead of directly using the constructor,
   * in order to preload assets and do arbitrary (async) preparations.
   *
   * For example, when using a Resource<Texture> containing an image, created
   * using Sprite.from(url), this image does not provide correct dimensions at the
   * beginning of the "scene lifetime" until the resource is loaded..
   * If you preload the asset, the resulting Texture<Resource>
   * will already be loaded and its dimensions will be reported correctly
   * right at  the beginning of the lifetime of the scene.
   *
   * @param sceneInitializer
   * @returns
   */
  public static async create<T>(
    sceneInitializer: ISceneInitializer<T>
  ): Promise<Scene<T>> {
    const displayObject = new sceneInitializer.displayObjectClass();
    const assets = sceneInitializer.fetchData
      ? await sceneInitializer.fetchData()
      : undefined;
    return new sceneInitializer.sceneClass(assets, displayObject);
  }
  public abstract update(framesPassed: number): void;
  protected initialize() {}
}

export interface IScene {
  update?(framesPassed: number): void;
  displayObject: DisplayObject;
}
