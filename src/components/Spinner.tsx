import { Waveform } from "ldrs/react";
import "ldrs/react/Waveform.css";

export function Spinner() {
  return <Waveform size={60} stroke={5} color="var(--color-slate-400)" />;
}
