import Svg, { Circle, Polygon, Rect } from "react-native-svg";
import { colors } from "@/theme/colors";

const DESIGN_SIZE = 120; // the scene is drawn on a 120-unit grid and scaled to `size`

type TreeProps = { x: number; y: number; s: number; fill: string };

function Tree({ x, y, s, fill }: TreeProps) {
  return (
    <>
      <Rect x={x - 2 * s} y={y} width={4 * s} height={6 * s} fill={colors.deep} />
      <Polygon
        points={`${x},${y - 36 * s} ${x - 14 * s},${y - 14 * s} ${x + 14 * s},${y - 14 * s}`}
        fill={fill}
      />
      <Polygon
        points={`${x},${y - 24 * s} ${x - 19 * s},${y + 2 * s} ${x + 19 * s},${y + 2 * s}`}
        fill={fill}
      />
    </>
  );
}

export function PineScene({ size }: { size: number }) {
  const s = size / DESIGN_SIZE;

  return (
    <Svg width={size} height={size}>
      <Rect width={size} height={size} fill={colors.track} />
      <Circle cx={88 * s} cy={28 * s} r={12 * s} fill={colors.lime} />
      <Tree x={34 * s} y={92 * s} s={s} fill={colors.treeA} />
      <Tree x={86 * s} y={94 * s} s={s} fill={colors.treeA} />
      <Tree x={60 * s} y={98 * s} s={1.25 * s} fill={colors.treeB} />
      <Rect y={98 * s} width={size} height={22 * s} fill={colors.treeA} />
    </Svg>
  );
}
