import Result "mo:base/Result";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Array "mo:base/Array";

actor {
  type DocSection = {
    id: Nat;
    title: Text;
    content: Text;
  };

  stable var nextId: Nat = 0;
  stable var docSections: [DocSection] = [];

  public func saveDocSection(title: Text, content: Text): async Result.Result<Nat, Text> {
    let id = nextId;
    let newSection: DocSection = {
      id = id;
      title = title;
      content = content;
    };
    docSections := Array.append(docSections, [newSection]);
    nextId += 1;
    #ok(id)
  };

  public query func getDocSection(id: Nat): async Result.Result<DocSection, Text> {
    switch (Array.find<DocSection>(docSections, func(section) { section.id == id })) {
      case (null) { #err("Section not found") };
      case (?section) { #ok(section) };
    }
  };

  public query func getAllDocSections(): async [DocSection] {
    docSections
  };
}
