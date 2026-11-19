import { render, screen } from "@testing-library/react-native";
import { FieldLabel } from "../field-label";

describe("FieldLabel", () => {
  it("shows the error message when an error is provided", async () => {
    await render(<FieldLabel error="Bir ad girin">Ad</FieldLabel>);

    expect(screen.getByText("Bir ad girin")).toBeTruthy();
  });

  it("exposes the error as an alert", async () => {
    await render(<FieldLabel error="Bir ad girin">Ad</FieldLabel>);

    expect(screen.getByRole("alert")).toHaveTextContent("Bir ad girin");
  });

  it("announces the error politely to Android screen readers", async () => {
    await render(<FieldLabel error="Bir ad girin">Ad</FieldLabel>);

    expect(screen.getByRole("alert").props.accessibilityLiveRegion).toBe("polite");
  });
});
