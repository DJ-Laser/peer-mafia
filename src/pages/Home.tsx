import { RoomInput } from "../components/homepage/RoomInput";

export function Home() {
  return (
    <div className="mx-auto my-0 max-w-320 w-fit p-8 text-center">
      <RoomInput onJoinGame={() => {}} onInvalidCode={() => {}} />
    </div>
  );
}
