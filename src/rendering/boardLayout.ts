export interface LayoutBox {
  readonly left: number;
  readonly top: number;
  readonly width: number;
  readonly height: number;
}

export function createLayoutBox(
  left: number,
  top: number,
  width: number,
  height: number
): LayoutBox {
  return { left, top, width, height };
}

export function boxRight(box: LayoutBox): number {
  return box.left + box.width;
}

export function boxBottom(box: LayoutBox): number {
  return box.top + box.height;
}

export function boxCenterX(box: LayoutBox): number {
  return box.left + box.width / 2;
}

export function boxCenterY(box: LayoutBox): number {
  return box.top + box.height / 2;
}

export function boxIsVertical(box: LayoutBox): boolean {
  return box.height > box.width;
}

export interface LaidTile {
  readonly box: LayoutBox;
  readonly firstValue: number;
  readonly secondValue: number;
  readonly isDouble: boolean;
  readonly isVertical: boolean;
}
