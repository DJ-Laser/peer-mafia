import { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import { Card } from "../../components/generic/Card";
import { ID_NUM_CHARS } from "../../game/connection";

const ROOM_CODE_LENGTH = ID_NUM_CHARS;

export function RoomInput() {
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const canSubmit = code.length === ROOM_CODE_LENGTH;

  const handleSubmit = useCallback(() => {
    if (!canSubmit) {
      return;
    }

    navigate(`/play/${code}`);
  }, [canSubmit, code, navigate]);

  return (
    <Card>
      <h1 className="text-4xl font-semibold text-center mb-6">Join a Game</h1>
      <label className="block text-sm font-medium text-slate-300 mb-1">
        Enter your {ROOM_CODE_LENGTH} letter room code
      </label>
      <span className="flex flex-row flex-nowrap gap-5 justify-center">
        <input
          className="px-3 py-2 min-w-32 rounded-md bg-slate-700 text-slate-100 text-xl border border-slate-600 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-sky-400 transition-colors duration-250"
          value={code}
          maxLength={ROOM_CODE_LENGTH}
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
          className="px-5 py-2 rounded-md hover:scale-105 disabled:scale-none bg-sky-600 disabled:bg-slate-600 text-l font-semibold border border-transparent  cursor-pointer disabled:cursor-not-allowed transition-all duration-200"
          disabled={!canSubmit}
          onClick={handleSubmit}
        >
          Join Game
        </button>
      </span>
    </Card>
  );
}

export default function Component() {
  return (
    <div className="mx-auto my-0 max-w-320 w-fit p-8">
      <RoomInput />
    </div>
  );
}
