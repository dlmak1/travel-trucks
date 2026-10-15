import type {
  CamperEngine,
  CamperFilters,
  CamperForm,
  CamperTransmission,
} from "@/types/camper";
import styles from "./Filters.module.css";

const formOptions = [
  { value: "alcove", label: "Alcove" },
  { value: "panel_van", label: "Panel Van" },
  { value: "integrated", label: "Integrated" },
  { value: "semi_integrated", label: "Semi Integrated" },
] satisfies { value: CamperForm; label: string }[];

const engineOptions = [
  { value: "diesel", label: "Diesel" },
  { value: "petrol", label: "Petrol" },
  { value: "hybrid", label: "Hybrid" },
  { value: "electric", label: "Electric" },
] satisfies { value: CamperEngine; label: string }[];

const transmissionOptions = [
  { value: "automatic", label: "Automatic" },
  { value: "manual", label: "Manual" },
] satisfies { value: CamperTransmission; label: string }[];

const groups = [
  { name: "form", label: "Camper form", options: formOptions },
  { name: "engine", label: "Engine", options: engineOptions },
  { name: "transmission", label: "Transmission", options: transmissionOptions },
] as const;

interface FiltersProps {
  filters: CamperFilters;
  onChange: (filters: CamperFilters) => void;
  onSearch: () => void;
  onClear: () => void;
  isLoading: boolean;
}

export default function Filters({
  filters,
  onChange,
  onSearch,
  onClear,
  isLoading,
}: FiltersProps) {
  return (
    <aside className={styles.panel} aria-label="Camper filters">
      <form
        id="catalog-filters"
        onSubmit={(event) => {
          event.preventDefault();
          if (!isLoading) onSearch();
        }}
        onReset={(event) => {
          event.preventDefault();
          onClear();
        }}
      >
        <label className={styles.locationLabel} htmlFor="camper-location">
          Location
        </label>
        <div className={styles.locationField}>
          <svg width="20" height="20" aria-hidden="true" focusable="false">
            <use href="/icons/sprite.svg#icon-map" />
          </svg>
          <input
            className={styles.locationInput}
            id="camper-location"
            name="location"
            type="text"
            placeholder="City"
            autoComplete="address-level2"
            value={filters.location ?? ""}
            onChange={(event) =>
              onChange({ ...filters, location: event.target.value })
            }
          />
        </div>

        <h2 className={styles.heading}>Filters</h2>
        <div className={styles.groups}>
          {groups.map(({ name, label, options }) => (
            <fieldset className={styles.group} key={name}>
              <legend className={styles.legend}>{label}</legend>
              <div className={styles.options}>
                {options.map(({ value, label: optionLabel }) => (
                  <label className={styles.option} key={value}>
                    <input
                      className={styles.radioInput}
                      type="radio"
                      name={name}
                      value={value}
                      checked={filters[name] === value}
                      onChange={() => onChange({ ...filters, [name]: value })}
                    />
                    <span className={styles.radioIcon} aria-hidden="true">
                      <svg width="24" height="24" focusable="false">
                        <use href="/icons/sprite.svg#icon-radio-outline" />
                      </svg>
                      <svg
                        className={styles.radioDot}
                        width="14"
                        height="14"
                        focusable="false"
                      >
                        <use href="/icons/sprite.svg#icon-radio-dot" />
                      </svg>
                    </span>
                    {optionLabel}
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
        </div>

        <div className={styles.actions}>
          <button
            className={styles.search}
            type="submit"
            disabled={isLoading}
            aria-busy={isLoading}
          >
            Search
          </button>
          <button className={styles.clear} type="reset">
            <svg width="20" height="20" aria-hidden="true" focusable="false">
              <use href="/icons/sprite.svg#icon-close" />
            </svg>
            Clear filters
          </button>
        </div>
      </form>
    </aside>
  );
}
