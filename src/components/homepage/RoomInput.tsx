import { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import { ID_NUM_CHARS } from "../connection/connection";

const ROOM_CODE_LENGTH = ID_NUM_CHARS;

export function RoomInput() {
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const handleSubmit = useCallback(() => {
    if (code.length < ROOM_CODE_LENGTH) {
      return;
    }

    navigate(`/play/${code}`);
  }, [code, navigate]);

  return (
    <div>
      <h1 className="text-4xl text-center mb-4">Enter a Room Code</h1>
      <span className="flex flex-row flex-nowrap gap-5 justify-center">
        <input
          className="px-3 py-2 w-31 h-full rounded-md bg-neutral-200 text-black text-xl border border-transparent hover:border-cyan-400 transition-colors duration-250"
          value={code}
          maxLength={ROOM_CODE_LENGTH}
          placeholder="Ex. W5X7D"
          onKeyDown={(e) => {
            if (e.key == "Enter") {
              handleSubmit();
            }
          }}
          onChange={(e) => {
            const newCode = e.target.value.toUpperCase();
            const filteredCode = newCode.replace(/[^A-Z]/g, "");

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
