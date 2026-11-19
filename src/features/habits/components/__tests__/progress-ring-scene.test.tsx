import { render, screen } from "@testing-library/react-native";
import { ProgressRingScene } from "./progress-ring-scene";

describe("ProgressRingScene", () => {
  it("exposes the progress as a percentage", async () => {
    await render(<ProgressRingScene progress={0.4} size={140} />);

    expect(screen.getByRole("progressbar", { value: { now: 40 } })).toBeTruthy();
  });

  it("clamps progress outside 0..1", async () => {
    const { rerender } = await render(<ProgressRingScene progress={1.5} size={140} />);
    expect(screen.getByRole("progressbar", { value: { now: 100 } })).toBeTruthy();

    await rerender(<ProgressRingScene progress={-0.2} size={140} />);
    expect(screen.getByRole("progressbar", { value: { now: 0 } })).toBeTruthy();
  });
});
