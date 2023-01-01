import { Assets, Container, Resource, Sprite, Texture } from "pixi.js";
import { ISceneInitializer, Scene } from "../scene/Scene";
import { SceneManager } from "../scene/SceneManager";

class Voltobal extends Scene<VoltobalInput, Container> {
  voltobal!: Sprite;
  protected override initialize(): void {
    this.voltobal = Sprite.from(this.assets.image);
    this.voltobal.scale = { x: 0.5, y: 0.5 };
    this.voltobal.anchor.set(0, 0.5);
    this.voltobal.y = SceneManager.height / 2;
    this.voltobal.x = -1 * this.voltobal.width;
    this.displayObject.addChild(this.voltobal);
  }
  update(framesPassed: number): void {
    //make the voltobal float across the screen
    let newX = (this.voltobal.x + framesPassed * 4) % SceneManager.width;
    if (SceneManager.width - newX < 1) {
      newX = -1 * this.voltobal.width;
    }
    this.voltobal.x = newX;
  }
}

type VoltobalInput = {
  image: Texture;
};

const VoltobalInitializer: ISceneInitializer<VoltobalInput> = {
  fetchData: async () => ({
    image: (await Assets.load(
      "assets/non-free-copyrighted/voltobal.png"
    )) as Texture<Resource>,
  }),
  displayObjectClass: Container,
  sceneClass: Voltobal,
};

export const makeVoltobalScene = async () =>
  await Voltobal.create(VoltobalInitializer);
