import { SceneManager } from "./scene/SceneManager";
import { makeVoltobalScene } from "./scenes/Voltobal";

SceneManager.initialize(640, 480, 0x4a123f);
(async () => {
  const scene = await makeVoltobalScene();
  SceneManager.changeScene(scene);
})();
