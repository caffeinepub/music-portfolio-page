import List "mo:core/List";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Migration "migration";

(with migration = Migration.run)
actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

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

  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let musicEntries = Map.empty<Nat, MusicEntry>();
  var nextId = 0;

  // User profile functions required by the frontend

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Music entry management — admin only

  public shared ({ caller }) func addMusicEntry(title : Text, artist : Text, album : Text, coverImageUrl : Text, releaseYear : Nat, genre : ?Text, platforms : [StreamingPlatform]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add music entries");
    };

    let newEntry : MusicEntry = {
      id = nextId;
      title;
      artist;
      album;
      coverImageUrl;
      releaseYear;
      genre;
      streamingPlatforms = platforms;
    };

    musicEntries.add(nextId, newEntry);
    nextId += 1;
  };

  public shared ({ caller }) func deleteMusicEntry(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete music entries");
    };

    if (musicEntries.containsKey(id)) {
      musicEntries.remove(id);
    } else {
      Runtime.trap("Music entry not found");
    };
  };

  public shared ({ caller }) func updateMusicEntry(id : Nat, title : Text, artist : Text, album : Text, coverImageUrl : Text, releaseYear : Nat, genre : ?Text, platforms : [StreamingPlatform]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update music entries");
    };

    switch (musicEntries.get(id)) {
      case (null) {
        Runtime.trap("Music entry not found");
      };
      case (?_) {
        let updatedEntry : MusicEntry = {
          id;
          title;
          artist;
          album;
          coverImageUrl;
          releaseYear;
          genre;
          streamingPlatforms = platforms;
        };
        musicEntries.add(id, updatedEntry);
      };
    };
  };

  // Public read functions — no auth required (public catalog)

  public query func getIdEntry(id : Nat) : async MusicEntry {
    switch (musicEntries.get(id)) {
      case (null) {
        Runtime.trap("Music entry not found");
      };
      case (?entry) {
        entry;
      };
    };
  };

  public query func searchEntries(searchTerm : Text) : async [MusicEntry] {
    let results = List.empty<MusicEntry>();

    for ((_, entry) in musicEntries.entries()) {
      let entryText = entry.title # " " # entry.artist # " " # entry.album # " " # entry.coverImageUrl # " " # entry.releaseYear.toText();
      switch (entry.genre) {
        case (?genre) {
          let genreText = entryText # " " # genre;
          if (genreText.contains(#text searchTerm)) {
            results.add(entry);
          };
        };
        case (null) {
          if (entryText.contains(#text searchTerm)) {
            results.add(entry);
          };
        };
      };
    };

    results.toArray();
  };

  public query func getAllEntries() : async [MusicEntry] {
    musicEntries.values().toArray();
  };
};
