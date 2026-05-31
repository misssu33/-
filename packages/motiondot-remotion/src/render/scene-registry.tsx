import type { AdSceneComponent } from "@motiondot/shared";
import { MediaBackdropScene } from "../scenes/MediaBackdropScene";
import { TextStackScene } from "../scenes/TextStackScene";
import { ProductCardScene } from "../scenes/ProductCardScene";
import { CtaBarScene } from "../scenes/CtaBarScene";
import { BrandLockupScene } from "../scenes/BrandLockupScene";

type SceneComponent = React.FC<Record<string, unknown>>;

const REGISTRY: Record<AdSceneComponent, SceneComponent> = {
  media_backdrop: MediaBackdropScene as unknown as SceneComponent,
  text_stack: TextStackScene as unknown as SceneComponent,
  product_card: ProductCardScene as unknown as SceneComponent,
  cta_bar: CtaBarScene as unknown as SceneComponent,
  brand_lockup: BrandLockupScene as unknown as SceneComponent,
};

export function getSceneComponent(
  id: AdSceneComponent,
): SceneComponent {
  return REGISTRY[id];
}
