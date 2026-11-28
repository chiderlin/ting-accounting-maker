import type { EditionChoice } from "./editions";
import styles from "./EditionSelector.module.css";

export default function EditionSelector<Id extends string>({ choices, value, onChange }: {
  choices: readonly EditionChoice<Id>[];
  value: Id;
  onChange: (id: Id) => void;
}) {
  if (choices.length < 2) return null;
  const index = choices.findIndex(choice => choice.id === value);
  return <div className={styles.selector} role="group" aria-label="Design edition">
    <span className={styles.caption}>DESIGN EDITION · {String(index + 1).padStart(2, "0")} / {String(choices.length).padStart(2, "0")}</span>
    <div className={styles.choices}>{choices.map(choice =>
      <button type="button" key={choice.id} aria-label={choice.name} aria-pressed={value === choice.id} onClick={() => onChange(choice.id)}>
        <span className={styles.swatch} style={{ backgroundColor: choice.swatch }} aria-hidden="true" />{choice.label}
      </button>,
    )}</div>
    <span className={styles.name} aria-live="polite">{choices[index]?.name}</span>
  </div>;
}
