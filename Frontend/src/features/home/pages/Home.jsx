import { useContext } from "react";
import FaceExpression from "../../Expression/components/FaceExpression";
import Player from "../components/player";
import { SongContext } from "../song.context";

function Home() {
  const { song } = useContext(SongContext);

  return (
    <>
      <FaceExpression />

      {song && (
        <Player
          src={song.url}
          title={song.title}
          artist={song.mood}
        />
      )}
    </>
  );
}

export default Home;