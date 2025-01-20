import { ConnectionContext } from "../components/connection/ConnectionContext";
import { RoomInput } from "../components/homepage/RoomInput";
import { useRequiredContext } from "../util/RequiredContext";

export function Home() {
  const connection = useRequiredContext(ConnectionContext);

  return (
    <div className="mx-auto my-0 max-w-320 w-fit p-8 text-center">
      <RoomInput
        onJoinGame={(id) => {
          connection.joinRoom(id);
        }}
        onInvalidCode={() => {}}
      />
    </div>
  );
}
