export const idlFactory = ({ IDL }) => {
  const MarkdownFile = IDL.Record({
    'id' : IDL.Nat,
    'content' : IDL.Text,
    'name' : IDL.Text,
    'createdAt' : IDL.Int,
  });
  const Result_1 = IDL.Variant({ 'ok' : MarkdownFile, 'err' : IDL.Text });
  const Result = IDL.Variant({ 'ok' : IDL.Nat, 'err' : IDL.Text });
  return IDL.Service({
    'getAllMarkdownFiles' : IDL.Func([], [IDL.Vec(MarkdownFile)], ['query']),
    'getMarkdownFile' : IDL.Func([IDL.Nat], [Result_1], ['query']),
    'saveMarkdownFile' : IDL.Func([IDL.Text, IDL.Text], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
