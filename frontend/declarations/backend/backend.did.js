export const idlFactory = ({ IDL }) => {
  const DocSection = IDL.Record({
    'id' : IDL.Nat,
    'title' : IDL.Text,
    'content' : IDL.Text,
  });
  const Result_1 = IDL.Variant({ 'ok' : DocSection, 'err' : IDL.Text });
  const Result = IDL.Variant({ 'ok' : IDL.Nat, 'err' : IDL.Text });
  return IDL.Service({
    'getAllDocSections' : IDL.Func([], [IDL.Vec(DocSection)], ['query']),
    'getDocSection' : IDL.Func([IDL.Nat], [Result_1], ['query']),
    'saveDocSection' : IDL.Func([IDL.Text, IDL.Text], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
