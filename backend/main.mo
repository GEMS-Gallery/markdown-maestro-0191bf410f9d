import Result "mo:base/Result";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Array "mo:base/Array";

actor {
  type MarkdownFile = {
    id: Nat;
    name: Text;
    content: Text;
  };

  stable var nextId: Nat = 0;
  stable var markdownFiles: [MarkdownFile] = [];

  public func saveMarkdownFile(name: Text, content: Text): async Result.Result<Nat, Text> {
    let id = nextId;
    let newFile: MarkdownFile = {
      id = id;
      name = name;
      content = content;
    };
    markdownFiles := Array.append(markdownFiles, [newFile]);
    nextId += 1;
    #ok(id)
  };

  public query func getMarkdownFile(id: Nat): async Result.Result<MarkdownFile, Text> {
    switch (Array.find<MarkdownFile>(markdownFiles, func(file) { file.id == id })) {
      case (null) { #err("File not found") };
      case (?file) { #ok(file) };
    }
  };

  public query func getAllMarkdownFiles(): async [MarkdownFile] {
    markdownFiles
  };
}
