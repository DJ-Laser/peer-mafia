import { useCallback, useState } from "react";

export interface RoomInputProps {
  onJoinGame: (code: string) => void;
  onInvalidCode: (code: string) => void;
}

const CODE_LENGTH = 5;

export function RoomInput({ onJoinGame, onInvalidCode }: RoomInputProps) {
  const [code, setCode] = useState("");
  const handleSubmit = useCallback(() => {
    if (code.length < CODE_LENGTH) {
      onInvalidCode(code);
      return;
    }

    onJoinGame(code);
  }, [code, onJoinGame, onInvalidCode]);

  return (
    <div>
      <h1 className="text-4xl text-center mb-4">Enter a Room Code</h1>
      <span className="flex flex-row flex-nowrap gap-5 justify-center">
        <input
          className="px-3 py-2 w-31 h-full rounded-md bg-neutral-200 text-black text-xl border border-transparent hover:border-cyan-400 transition-colors duration-250"
          value={code}
          maxLength={CODE_LENGTH}
          placeholder="Ex. W5X7D"
          onKeyDown={(e) => {
            if (e.key == "Enter") {
              handleSubmit();
            }
          }}
          onChange={(e) => {
            const newCode = e.target.value.toUpperCase();
            const filteredCode = newCode.replace(/[^A-Z0-9]/g, "");

            if (code !== filteredCode) setCode(filteredCode);
          }}
        />
        <button
          className="px-5 py-2 rounded-md bg-neutral-900 text-xl border border-transparent hover:border-cyan-400 cursor-pointer transition-colors duration-250"
          onClick={handleSubmit}
        >
          Join Game
        </button>
      </span>
    </div>
  );
}
