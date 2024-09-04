import Result "mo:base/Result";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Array "mo:base/Array";

actor {
  stable var nextId: Nat = 0;
  stable var markdownStore: [(Nat, Text)] = [];

  public func saveMarkdown(text: Text): async Result.Result<Nat, Text> {
    let id = nextId;
    markdownStore := Array.append(markdownStore, [(id, text)]);
    nextId += 1;
    #ok(id)
  };

  public query func getMarkdown(id: Nat): async Result.Result<Text, Text> {
    switch (Array.find<(Nat, Text)>(markdownStore, func((storedId, _)) { storedId == id })) {
      case (null) { #err("Markdown not found") };
      case (?(_, text)) { #ok(text) };
    }
  };
}
