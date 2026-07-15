import { type ChangeEvent, useState } from "react";
import css from "./SearchBox.module.css";

interface SearchBoxProps {
  onChange: (value: string) => void;
}

export default function SearchBox({ onChange }: SearchBoxProps) {
  const [query, setQuery] = useState("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const nextQuery = event.target.value;
    setQuery(nextQuery);
    onChange(nextQuery);
  };

  return (
    <input
      className={css.input}
      type="text"
      placeholder="Search notes"
      value={query}
      onChange={handleChange}
    />
  );
}
