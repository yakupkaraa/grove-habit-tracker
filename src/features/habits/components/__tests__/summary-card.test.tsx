import { render, screen } from "@testing-library/react-native";
import { SummaryCard } from "./summary-card";

describe("SummaryCard", () => {
  it("shows done and total", async () => {
    await render(<SummaryCard done={2} total={5} streak={7} />);

    expect(screen.getByText("2/5")).toBeTruthy();
  });

  it("shows the completed label", async () => {
    await render(<SummaryCard done={2} total={5} streak={7} />);

    expect(screen.getByText("tamamlandı")).toBeTruthy();
  });

  it("shows how many habits are left", async () => {
    await render(<SummaryCard done={2} total={5} streak={7} />);

    expect(screen.getByText("3 alışkanlık kaldı")).toBeTruthy();
  });

  it("shows the all-done message and the streak when everything is done", async () => {
    await render(<SummaryCard done={5} total={5} streak={7} />);

    expect(screen.getByText("5/5")).toBeTruthy();
    expect(screen.getByText("Hepsi tamamlandı")).toBeTruthy();
    expect(screen.getByText("7 günlük seri")).toBeTruthy();
    expect(screen.queryByText("tamamlandı")).toBeNull();
    expect(screen.queryByText(/alışkanlık kaldı/)).toBeNull();
  });

  it("does not treat an empty list as all done", async () => {
    await render(<SummaryCard done={0} total={0} streak={0} />);

    expect(screen.getByText("0/0")).toBeTruthy();
    expect(screen.queryByText("Hepsi tamamlandı")).toBeNull();
  });

  it("passes the progress to the ring", async () => {
    await render(<SummaryCard done={2} total={5} streak={7} />);

    expect(screen.getByRole("progressbar", { value: { now: 40 } })).toBeTruthy();
  });
});
