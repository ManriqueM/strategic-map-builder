import { useMap } from "../state/useMap";
import { PerspectiveRow } from "./PerspectiveRow";

export function PerspectivesSection() {
  const { map } = useMap();
  const visible = map.perspectives.filter((p) => p.visible);

  return (
    <div>
      {visible.map((perspective, index) => (
        <PerspectiveRow key={perspective.id} perspective={perspective} number={index + 1} />
      ))}
    </div>
  );
}
