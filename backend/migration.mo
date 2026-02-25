import Map "mo:core/Map";
import Nat "mo:core/Nat";

module {
  // Redeclare MusicEntry type
  type MusicEntry = {
    id : Nat;
    title : Text;
    artist : Text;
    album : Text;
    coverImageUrl : Text;
    releaseYear : Nat;
    genre : ?Text;
    streamingPlatforms : [StreamingPlatform];
  };

  type StreamingPlatform = {
    name : Text;
    url : Text;
  };

  // Explicitly type the migration to keep data legacy compatibility
  type OldActor = { musicEntries : Map.Map<Nat, MusicEntry> };
  type NewActor = { musicEntries : Map.Map<Nat, MusicEntry> };

  public func run(old : OldActor) : NewActor {
    old;
  };
};
