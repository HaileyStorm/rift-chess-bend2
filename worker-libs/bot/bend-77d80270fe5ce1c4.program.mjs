import {web_call, web_tail, web_fork, freezeProgramData} from "./bend-77d80270fe5ce1c4.runtime.mjs";
function word_to_u32(w) {
  let x = 0;
  for (let i = 0; w.$ === "WCon"; i++) {
    x |= Number(w.head) << i;
    w = w.tail;
  }
  return x >>> 0;
}

function u32_to_word(x) {
  let w = {$: "WNil"};
  for (let i = 31; i >= 0; i--) {
    w = {$: "WCon", head: ((x >>> i) & 1) === 1, tail: w};
  }
  return w;
}

function cmp_new(a, b) {
  return {$: a < b ? "LT"
    : a === b ? "EQ" : "GT"};
}

function nat_divmod(a, b) {
  return b === 0n ? {$: "Tuple", fst: 0n, snd: a}
    : {$: "Tuple", fst: a / b, snd: a % b};
}

function nat_chk(n) {
  if (n > 281474976710655n) {
    throw "bend: a Nat past the largest immediate 2^48-1";
  }
  return n;
}

function f32_show(x) {
  if (x !== x) {
    return "nan";
  }
  if (!Number.isFinite(x) || Object.is(x, -0)) {
    return x < 0 ? "-inf"
      : x === 0 ? "-0" : "inf";
  }
  let s = "x";
  for (let p = 1; p <= 9 && Math.fround(Number(s)) !== x; p += 1) {
    s = String(Number(x.toExponential(p - 1)));
  }
  return s;
}

function f32_bits(x) {
  return new Uint32Array(new Float32Array([x]).buffer)[0];
}

function f32_from_bits(u) {
  return new Float32Array(new Uint32Array([u]).buffer)[0];
}

function f32_read(s) {
  const re = /^\s*[+-]?((\d+\.?\d*|\.\d+)(e[+-]?\d+)?|inf(inity)?|nan)$/i;
  const v = Number(s.replace(/inf\w*/i, "Infinity"));
  return re.test(s) ? {$: "Some", value: Math.fround(v)} : {$: "None"};
}

function char_new(code) {
  if (code > 0x10FFFF || (code >= 0xD800 && code <= 0xDFFF)) {
    throw "bend: " + code + " is not a Unicode scalar value";
  }
  return String.fromCodePoint(code);
}

// Array
// =====

function array_new(d, v) {
  if (d > 31n) {
    throw "bend: an array past the deepest block class 31";
  }
  return Array(2 ** Number(d)).fill(v);
}

// An unbalanced tree fails, as in C.
function array_node(a, b) {
  if (a.length !== b.length) {
    throw "bend: runtime fail-stop";
  }
  return a.concat(b);
}

function array_rmw(a, i, f) {
  const at = i % a.length;
  const old = a[at];
  a[at] = f(old);
  return {$: "Tuple", fst: a, snd: old};
}

// Run
// ===

function run_jump(f, x) {
  return {$: "$JMP", f: f, x: x};
}

function run_tail(f, x) {
  return {$: "$JMP", f: f.j?.f === f ? f.j : f, x: [x]};
}

function run_clo(j) {
  const f = (x) => run_loop(j(x));
  f.j = j;
  j.f = f;
  return f;
}

function run_loop(r) {
  while (r !== null && typeof r === "object" && r.$ === "$JMP") {
    r = r.f(...r.x);
  }
  return r;
}

function run_lib(f, n) {
  return (...a) => a.length < n ? run_lib((...b) => f(...a, ...b), n - a.length)
    : run_loop(f(...a));
}
// Program
// =======

function $choose$(_p_0, _ids_0) {
  return run_jump($$$$$$$core$AI$choose$, [_p_0, _ids_0]);
}

function $$$$$$$core$AI$choose$(_p_0, _ids_0) {
  return run_jump($$$$$$$core$AI$choice_id$, [run_loop($$$$$$$core$AI$parallel$(2n, _ids_0, _p_0))]);
}

function $$$$$$$core$AI$choice_id$(_choice_0) {
  const _score_0 = _choice_0["score"];
  const _id_0 = _choice_0["id"];
  return _id_0;
}

function $$$$$$$core$AI$parallel$(_depth_0, _ids_0, _p_0) {
  if (_depth_0 === 0n) {
    return run_jump($$$$$$$core$AI$sequential$, [_ids_0, _p_0, {$: "Choice", ["score"]: 0, ["id"]: 21760}]);
  } else {
    const _rest_0 = (_depth_0 - 1n);
    const _parts_0 = run_loop($$$$$$$core$AI$split$(_ids_0));
    const _a_0 = run_loop($$$$$$$core$AI$parallel$(_rest_0, run_loop($$$$$$$core$AI$left$(_parts_0)), _p_0));
    const _b_0 = run_loop($$$$$$$core$AI$parallel$(_rest_0, run_loop($$$$$$$core$AI$right$(_parts_0)), _p_0));
    return run_jump($$$$$$$core$AI$better$, [_a_0, _b_0]);
  }
}

function $$$$$$$core$AI$sequential$(_ids_0, _p_0, _best_0) {
  if (_ids_0.$ === "Nil") {
    return _best_0;
  } else {
    const _id_0 = _ids_0["head"];
    const _rest_0 = _ids_0["tail"];
    return run_jump($$$$$$$core$AI$sequential$, [_rest_0, _p_0, run_loop($$$$$$$core$AI$better$(_best_0, {$: "Choice", ["score"]: run_loop($$$$$$$core$AI$score$(_p_0, _id_0)), ["id"]: _id_0}))]);
  }
}

function $$$$$$$core$AI$split$(_ids_0) {
  if (_ids_0.$ === "Nil") {
    return {$: "Split", ["left"]: {$: "Nil"}, ["right"]: {$: "Nil"}};
  } else {
    const _id_0 = _ids_0["head"];
    const _rest_0 = _ids_0["tail"];
    return run_jump($$$$$$$core$AI$split_join$, [_id_0, run_loop($$$$$$$core$AI$split$(_rest_0))]);
  }
}

function $$$$$$$core$AI$left$(_pair_0) {
  const _a_0 = _pair_0["left"];
  const _b_0 = _pair_0["right"];
  return _a_0;
}

function $$$$$$$core$AI$right$(_pair_0) {
  const _a_0 = _pair_0["left"];
  const _b_0 = _pair_0["right"];
  return _b_0;
}

function $$$$$$$core$AI$better$(_a_0, _b_0) {
  const _sa_0 = _a_0["score"];
  const _ia_0 = _a_0["id"];
  const _sb_0 = _b_0["score"];
  const _ib_0 = _b_0["id"];
  const _x_0 = (_sa_0 > _sb_0);
  const _x_1 = run_loop($Bool$and$((_sa_0 === _sb_0), (_ia_0 < _ib_0)));
  return run_jump($Bool$pick$, [(_x_0 || _x_1), {$: "Choice", ["score"]: _sa_0, ["id"]: _ia_0}, {$: "Choice", ["score"]: _sb_0, ["id"]: _ib_0}]);
}

function $$$$$$$core$AI$score$(_p_0, _id_0) {
  const _next_0 = run_loop($$$$$$$core$v2$RuleContracts$expected$(_p_0, _id_0));
  const _base_0 = run_loop($$$$$$$core$AI$board_score$(run_loop($$$$$$$core$Model$pos_board$(_next_0)), run_loop($$$$$$$core$Model$pos_side$(_p_0)), 0, 100000));
  const _check_0 = run_loop($Bool$pick$(run_loop($$$$$$$core$Geometry$in_check$(_next_0, run_loop($$$$$$$core$Model$pos_side$(_next_0)))), 35, 0));
  const _x_0 = ((_base_0 + _check_0) >>> 0);
  const _x_1 = run_loop($$$$$$$core$AI$hanging_decoded$(_next_0, run_loop($$$$$$$core$Model$decode$(_id_0))));
  return ((_x_0 - _x_1) >>> 0);
}

function $$$$$$$core$AI$split_join$(_id_0, _pair_0) {
  const _a_0 = _pair_0["left"];
  const _b_0 = _pair_0["right"];
  return {$: "Split", ["left"]: {$: "Con", ["head"]: _id_0, ["tail"]: _b_0}, ["right"]: _a_0};
}

function $Bool$pick$(_c_0, _a_0, _b_0) {
  if (!_c_0) {
    return _b_0;
  } else {
    return _a_0;
  }
}

function $Bool$and$(_a_0, _b_0) {
  if (!_a_0) {
    return false;
  } else {
    return _b_0;
  }
}

function $$$$$$$core$v2$RuleContracts$expected$(_p_0, _id_0) {
  return run_jump($$$$$$$core$v2$RuleContracts$expected_decoded$, [_p_0, run_loop($$$$$$$core$Model$decode$(_id_0))]);
}

function $$$$$$$core$AI$board_score$(_xs_0, _side_0, _index_0, _score_0) {
  if (_xs_0.$ === "Nil") {
    return _score_0;
  } else {
    const _code_0 = _xs_0["head"];
    const _rest_0 = _xs_0["tail"];
    const _points_0 = run_loop($Bool$pick$(run_loop($$$$$$$core$Model$occupied$(_code_0)), run_loop($$$$$$$core$AI$piece_score$(_code_0, _index_0)), 0));
    const _next_0 = run_loop($Bool$pick$(run_loop($$$$$$$core$Model$same_side$(_code_0, _side_0)), ((_score_0 + _points_0) >>> 0), ((_score_0 - _points_0) >>> 0)));
    return run_jump($$$$$$$core$AI$board_score$, [_rest_0, _side_0, ((_index_0 + 1) >>> 0), _next_0]);
  }
}

function $$$$$$$core$Model$pos_board$(_p_0) {
  const _board_0 = _p_0["board"];
  const _holes_0 = _p_0["holes"];
  const _side_0 = _p_0["side"];
  const _rights_0 = _p_0["rights"];
  const _ep_0 = _p_0["ep"];
  const _epPawn_0 = _p_0["epPawn"];
  const _quiet_0 = _p_0["quiet"];
  const _full_0 = _p_0["full"];
  return _board_0;
}

function $$$$$$$core$Model$pos_side$(_p_0) {
  const _board_0 = _p_0["board"];
  const _holes_0 = _p_0["holes"];
  const _side_0 = _p_0["side"];
  const _rights_0 = _p_0["rights"];
  const _ep_0 = _p_0["ep"];
  const _epPawn_0 = _p_0["epPawn"];
  const _quiet_0 = _p_0["quiet"];
  const _full_0 = _p_0["full"];
  return _side_0;
}

function $$$$$$$core$Geometry$in_check$(_p_0, _side_0) {
  return run_jump($$$$$$$core$Geometry$in_check$got$, [_p_0, _side_0, run_loop($$$$$$$core$Geometry$find_king$(_p_0, _side_0))]);
}

function $$$$$$$core$AI$hanging_decoded$(_next_0, _action_0) {
  if (_action_0.$ === "None") {
    return 0;
  } else {
    const _value_0 = _action_0["value"];
    return run_jump($$$$$$$core$AI$hanging_action$, [_next_0, _value_0]);
  }
}

function $$$$$$$core$Model$decode$(_id_0) {
  return run_jump($$$$$$$core$Model$decode$in_range$, [_id_0, (_id_0 < 21760)]);
}

function $$$$$$$core$v2$RuleContracts$expected_decoded$(_p_0, _decoded_0) {
  if (_decoded_0.$ === "None") {
    return _p_0;
  } else {
    const _a_0 = _decoded_0["value"];
    return run_jump($$$$$$$core$v2$RuleContracts$expected_action$, [_p_0, _a_0]);
  }
}

function $$$$$$$core$Model$occupied$(_code_0) {
  return (_code_0 !== 0);
}

function $$$$$$$core$AI$piece_score$(_code_0, _square_0) {
  const _kind_0 = run_loop($$$$$$$core$Model$piece_type$(_code_0));
  const _x_0 = run_loop($$$$$$$core$AI$center$(run_loop($$$$$$$core$Model$file_of$(_square_0))));
  const _x_1 = run_loop($$$$$$$core$AI$center$(run_loop($$$$$$$core$Model$rank_of$(_square_0))));
  const _central_0 = ((_x_0 + _x_1) >>> 0);
  const _x_2 = run_loop($$$$$$$core$Model$rank_of$(_square_0));
  const _advance_0 = run_loop($Bool$pick$(run_loop($$$$$$$core$Model$is_white$(_code_0)), run_loop($$$$$$$core$Model$rank_of$(_square_0)), ((7 - _x_2) >>> 0)));
  const _x_3 = (Math.imul(_advance_0, 5) >>> 0);
  const _x_4 = run_loop($$$$$$$core$AI$weight$(_kind_0));
  const _x_5 = run_loop($Bool$pick$(run_loop($$$$$$$core$Model$is_pawn$(_code_0)), ((_x_3 + _central_0) >>> 0), run_loop($Bool$pick$((_kind_0 === 6), 0, (Math.imul(_central_0, 5) >>> 0)))));
  return ((_x_4 + _x_5) >>> 0);
}

function $$$$$$$core$Model$same_side$(_code_0, _side_0) {
  if (_side_0) {
    return run_jump($$$$$$$core$Model$is_white$, [_code_0]);
  } else {
    return run_jump($$$$$$$core$Model$is_black$, [_code_0]);
  }
}

function $$$$$$$core$Geometry$in_check$got$(_p_0, _side_0, _found_0) {
  if (_found_0.$ === "None") {
    return true;
  } else {
    const _value_0 = _found_0["value"];
    return run_jump($$$$$$$core$Geometry$attacked$, [_p_0, _value_0, run_loop($$$$$$$core$Geometry$opposite$(_side_0))]);
  }
}

function $$$$$$$core$Geometry$find_king$(_p_0, _side_0) {
  return run_jump($$$$$$$core$Geometry$find_king$scan$, [run_loop($$$$$$$core$Model$pos_board$(_p_0)), 0, _side_0]);
}

function $$$$$$$core$AI$hanging_action$(_next_0, _action_0) {
  if (_action_0.$ === "MoveAction") {
    const _from_0 = _action_0["from"];
    const _to_0 = _action_0["to"];
    const _promotion_0 = _action_0["promotion"];
    return run_jump($$$$$$$core$AI$hanging_at$, [_next_0, _to_0, run_loop($$$$$$$core$Geometry$attacked$(_next_0, _to_0, run_loop($$$$$$$core$Model$pos_side$(_next_0))))]);
  } else {
    const _from_1 = _action_0["from"];
    const _to_1 = _action_0["to"];
    const _promotion_1 = _action_0["promotion"];
    return 0;
  }
}

function $$$$$$$core$Model$decode$in_range$(_id_0, _in_range_0) {
  if (!_in_range_0) {
    return {$: "None"};
  } else {
    return {$: "Some", ["value"]: run_loop($Bool$pick$((_id_0 < 20480), run_loop($$$$$$$core$Model$decode_move$(_id_0)), run_loop($$$$$$$core$Model$decode_shift$(_id_0))))};
  }
}

function $$$$$$$core$v2$RuleContracts$expected_action$(_p_0, _a_0) {
  return {$: "Pos", ["board"]: run_loop($$$$$$$core$v2$RuleContracts$expected_board$(64n, _p_0, _a_0, 0)), ["holes"]: run_loop($$$$$$$core$v2$RuleContracts$holes$(_p_0, _a_0)), ["side"]: run_loop($Bool$not$(run_loop($$$$$$$core$Model$pos_side$(_p_0)))), ["rights"]: run_loop($$$$$$$core$v2$RuleContracts$rights$(_p_0, _a_0)), ["ep"]: run_loop($$$$$$$core$v2$RuleContracts$ep_target$(_p_0, _a_0)), ["epPawn"]: run_loop($$$$$$$core$v2$RuleContracts$ep_victim$(_p_0, _a_0)), ["quiet"]: run_loop($$$$$$$core$v2$RuleContracts$quiet$(_p_0, _a_0)), ["full"]: run_loop($$$$$$$core$v2$RuleContracts$full$(_p_0))};
}

function $$$$$$$core$Model$piece_type$(_code_0) {
  return run_jump($Bool$pick$, [(_code_0 === 0), 0, run_loop($Bool$pick$((_code_0 < 8), _code_0, ((_code_0 - 8) >>> 0)))]);
}

function $$$$$$$core$AI$center$(_coordinate_0) {
  return run_jump($Bool$pick$, [(_coordinate_0 < 4), _coordinate_0, ((7 - _coordinate_0) >>> 0)]);
}

function $$$$$$$core$Model$file_of$(_square_0) {
  return (8 === 0 ? _square_0 : _square_0 % 8);
}

function $$$$$$$core$Model$rank_of$(_square_0) {
  return (8 === 0 ? 0 : (_square_0 / 8) >>> 0);
}

function $$$$$$$core$Model$is_white$(_code_0) {
  return run_jump($Bool$and$, [(_code_0 >= 1), (_code_0 < 8)]);
}

function $$$$$$$core$AI$weight$(_kind_0) {
  return TAB_0[Math.min(Number(_kind_0), 8)];
}

function $$$$$$$core$Model$is_pawn$(_code_0) {
  const _x_0 = run_loop($$$$$$$core$Model$piece_type$(_code_0));
  const _x_1 = run_loop($$$$$$$core$Model$piece_type$(_code_0));
  const _x_2 = (_x_0 === 1);
  const _x_3 = (_x_1 === 7);
  return (_x_2 || _x_3);
}

function $$$$$$$core$Model$is_black$(_code_0) {
  return (_code_0 >= 9);
}

function $$$$$$$core$Geometry$attacked$(_p_0, _target_0, _by_side_0) {
  const _x_0 = run_loop($$$$$$$core$Geometry$rays$(_p_0, _target_0, _by_side_0, true));
  const _x_1 = run_loop($$$$$$$core$Geometry$rays$(_p_0, _target_0, _by_side_0, false));
  const _x_2 = run_loop($$$$$$$core$Geometry$scan_king$(_p_0, _target_0, _by_side_0));
  const _x_3 = (_x_0 || _x_1);
  const _x_4 = run_loop($$$$$$$core$Geometry$scan_knight$(_p_0, _target_0, _by_side_0));
  const _x_5 = (_x_2 || _x_3);
  const _x_6 = run_loop($$$$$$$core$Geometry$attacked_pawn$(_p_0, _target_0, _by_side_0));
  const _x_7 = (_x_4 || _x_5);
  return run_jump($Bool$and$, [run_loop($$$$$$$core$Model$present$(run_loop($$$$$$$core$Model$pos_holes$(_p_0)), _target_0)), (_x_6 || _x_7)]);
}

function $$$$$$$core$Geometry$opposite$(_side_0) {
  return run_jump($Bool$not$, [_side_0]);
}

function $$$$$$$core$Geometry$find_king$scan$(_xs_0, _index_0, _side_0) {
  if (_xs_0.$ === "Nil") {
    return {$: "None"};
  } else {
    const _h_0 = _xs_0["head"];
    const _t_0 = _xs_0["tail"];
    const _x_0 = run_loop($$$$$$$core$Model$piece_type$(_h_0));
    return run_jump($Bool$pick$, [run_loop($Bool$and$(run_loop($$$$$$$core$Model$same_side$(_h_0, _side_0)), (_x_0 === 6))), {$: "Some", ["value"]: _index_0}, run_loop($$$$$$$core$Geometry$find_king$scan$(_t_0, ((_index_0 + 1) >>> 0), _side_0))]);
  }
}

function $$$$$$$core$AI$hanging_at$(_next_0, _to_0, _threatened_0) {
  if (!_threatened_0) {
    return 0;
  } else {
    const _x_0 = run_loop($$$$$$$core$AI$weight$(run_loop($$$$$$$core$Model$piece_type$(run_loop($$$$$$$core$Model$board_get$(run_loop($$$$$$$core$Model$pos_board$(_next_0)), _to_0))))));
    return (3 === 0 ? 0 : (_x_0 / 3) >>> 0);
  }
}

function $$$$$$$core$Model$decode_move$(_id_0) {
  const _q_0 = (5 === 0 ? 0 : (_id_0 / 5) >>> 0);
  return {$: "MoveAction", ["from"]: (64 === 0 ? 0 : (_q_0 / 64) >>> 0), ["to"]: (64 === 0 ? _q_0 : _q_0 % 64), ["promotion"]: run_loop($$$$$$$core$Model$decode_promotion$(_id_0))};
}

function $$$$$$$core$Model$decode_shift$(_id_0) {
  const _x_0 = ((_id_0 - 20480) >>> 0);
  const _q_0 = (5 === 0 ? 0 : (_x_0 / 5) >>> 0);
  return {$: "ShiftAction", ["from"]: (16 === 0 ? 0 : (_q_0 / 16) >>> 0), ["to"]: (16 === 0 ? _q_0 : _q_0 % 16), ["promotion"]: run_loop($$$$$$$core$Model$decode_promotion$(_id_0))};
}

function $$$$$$$core$v2$RuleContracts$expected_board$(_n_0, _p_0, _a_0, _s_0) {
  if (_n_0 === 0n) {
    return {$: "Nil"};
  } else {
    const _rest_0 = (_n_0 - 1n);
    return {$: "Con", ["head"]: run_loop($$$$$$$core$v2$RuleContracts$cell$(_p_0, _a_0, _s_0)), ["tail"]: run_loop($$$$$$$core$v2$RuleContracts$expected_board$(_rest_0, _p_0, _a_0, ((_s_0 + 1) >>> 0)))};
  }
}

function $$$$$$$core$v2$RuleContracts$holes$(_p_0, _action_0) {
  if (_action_0.$ === "MoveAction") {
    const _a_0 = _action_0["from"];
    const _b_0 = _action_0["to"];
    const _tag_0 = _action_0["promotion"];
    return run_jump($$$$$$$core$Model$pos_holes$, [_p_0]);
  } else {
    const _a_1 = _action_0["from"];
    const _b_1 = _action_0["to"];
    const _tag_1 = _action_0["promotion"];
    const _x_0 = run_loop($$$$$$$core$Model$macro_mask$(_a_1));
    const _x_1 = run_loop($$$$$$$core$Model$macro_mask$(_b_1));
    const _x_2 = run_loop($$$$$$$core$Model$pos_holes$(_p_0));
    const _x_3 = ((_x_0 | _x_1) >>> 0);
    return ((_x_2 ^ _x_3) >>> 0);
  }
}

function $Bool$not$(_b_0) {
  if (!_b_0) {
    return true;
  } else {
    return false;
  }
}

function $$$$$$$core$v2$RuleContracts$rights$(_p_0, _action_0) {
  const _x_0 = run_loop($Bool$to_u32$(run_loop($$$$$$$core$v2$RuleContracts$right_survives$(_p_0, _action_0, 0, true))));
  const _x_1 = run_loop($Bool$to_u32$(run_loop($$$$$$$core$v2$RuleContracts$right_survives$(_p_0, _action_0, 63, false))));
  const _x_2 = run_loop($Bool$to_u32$(run_loop($$$$$$$core$v2$RuleContracts$right_survives$(_p_0, _action_0, 56, false))));
  const _x_3 = (Math.imul(4, _x_1) >>> 0);
  const _x_4 = (Math.imul(8, _x_2) >>> 0);
  const _x_5 = (Math.imul(2, _x_0) >>> 0);
  const _x_6 = ((_x_3 + _x_4) >>> 0);
  const _x_7 = run_loop($Bool$to_u32$(run_loop($$$$$$$core$v2$RuleContracts$right_survives$(_p_0, _action_0, 7, true))));
  const _x_8 = ((_x_5 + _x_6) >>> 0);
  const _x_9 = run_loop($$$$$$$core$Model$pos_rights$(_p_0));
  const _x_10 = ((_x_7 + _x_8) >>> 0);
  return ((_x_9 & _x_10) >>> 0);
}

function $$$$$$$core$v2$RuleContracts$ep_target$(_p_0, _action_0) {
  if (_action_0.$ === "MoveAction") {
    const _a_0 = _action_0["from"];
    const _b_0 = _action_0["to"];
    const _tag_0 = _action_0["promotion"];
    const _x_0 = run_loop($$$$$$$core$Geometry$abs_diff$(run_loop($$$$$$$core$Model$rank_of$(_a_0)), run_loop($$$$$$$core$Model$rank_of$(_b_0))));
    const _x_1 = run_loop($$$$$$$core$Model$rank_of$(_a_0));
    const _x_2 = run_loop($$$$$$$core$Model$rank_of$(_b_0));
    const _x_3 = ((_x_1 + _x_2) >>> 0);
    return run_jump($Bool$pick$, [run_loop($Bool$and$(run_loop($$$$$$$core$Model$is_pawn$(run_loop($$$$$$$core$v2$RuleContracts$at$(_p_0, _a_0)))), (_x_0 === 2))), run_loop($$$$$$$core$Model$sq$(run_loop($$$$$$$core$Model$file_of$(_a_0)), (2 === 0 ? 0 : (_x_3 / 2) >>> 0))), 64]);
  } else {
    const _a_1 = _action_0["from"];
    const _b_1 = _action_0["to"];
    const _tag_1 = _action_0["promotion"];
    return 64;
  }
}

function $$$$$$$core$v2$RuleContracts$ep_victim$(_p_0, _action_0) {
  if (_action_0.$ === "MoveAction") {
    const _a_0 = _action_0["from"];
    const _b_0 = _action_0["to"];
    const _tag_0 = _action_0["promotion"];
    const _x_0 = run_loop($$$$$$$core$Geometry$abs_diff$(run_loop($$$$$$$core$Model$rank_of$(_a_0)), run_loop($$$$$$$core$Model$rank_of$(_b_0))));
    return run_jump($Bool$pick$, [run_loop($Bool$and$(run_loop($$$$$$$core$Model$is_pawn$(run_loop($$$$$$$core$v2$RuleContracts$at$(_p_0, _a_0)))), (_x_0 === 2))), _b_0, 64]);
  } else {
    const _a_1 = _action_0["from"];
    const _b_1 = _action_0["to"];
    const _tag_1 = _action_0["promotion"];
    return 64;
  }
}

function $$$$$$$core$v2$RuleContracts$quiet$(_p_0, _action_0) {
  if (_action_0.$ === "MoveAction") {
    const _a_0 = _action_0["from"];
    const _b_0 = _action_0["to"];
    const _tag_0 = _action_0["promotion"];
    const _x_0 = run_loop($$$$$$$core$Model$occupied$(run_loop($$$$$$$core$v2$RuleContracts$at$(_p_0, _b_0))));
    const _x_1 = run_loop($$$$$$$core$v2$RuleContracts$ep$(_p_0, _a_0, _b_0));
    const _x_2 = run_loop($$$$$$$core$Model$is_pawn$(run_loop($$$$$$$core$v2$RuleContracts$at$(_p_0, _a_0))));
    const _x_3 = (_x_0 || _x_1);
    const _x_4 = run_loop($$$$$$$core$Model$pos_quiet$(_p_0));
    return run_jump($Bool$pick$, [(_x_2 || _x_3), 0n, nat_chk(_x_4 + 1n)]);
  } else {
    const _a_1 = _action_0["from"];
    const _b_1 = _action_0["to"];
    const _tag_1 = _action_0["promotion"];
    const _x_5 = run_loop($$$$$$$core$Model$pos_quiet$(_p_0));
    return run_jump($Bool$pick$, [(_tag_1 === 0), nat_chk(_x_5 + 1n), 0n]);
  }
}

function $$$$$$$core$v2$RuleContracts$full$(_p_0) {
  const _x_0 = run_loop($$$$$$$core$Model$pos_full$(_p_0));
  const _x_1 = run_loop($Bool$pick$(run_loop($$$$$$$core$Model$pos_side$(_p_0)), 0n, 1n));
  return nat_chk(_x_0 + _x_1);
}

function $$$$$$$core$Model$present$(_holes_0, _square_0) {
  return run_jump($$$$$$$core$Model$present$in_range$, [_holes_0, _square_0, (_square_0 < 64)]);
}

function $$$$$$$core$Model$pos_holes$(_p_0) {
  const _board_0 = _p_0["board"];
  const _holes_0 = _p_0["holes"];
  const _side_0 = _p_0["side"];
  const _rights_0 = _p_0["rights"];
  const _ep_0 = _p_0["ep"];
  const _epPawn_0 = _p_0["epPawn"];
  const _quiet_0 = _p_0["quiet"];
  const _full_0 = _p_0["full"];
  return _holes_0;
}

function $$$$$$$core$Geometry$attacked_pawn$(_p_0, _target_0, _by_side_0) {
  const _file_0 = run_loop($$$$$$$core$Model$file_of$(_target_0));
  const _rank_0 = run_loop($$$$$$$core$Model$rank_of$(_target_0));
  const _source_rank_0 = run_loop($Bool$pick$(_by_side_0, ((_rank_0 - 1) >>> 0), ((_rank_0 + 1) >>> 0)));
  const _left_0 = run_loop($Bool$pick$((_file_0 > 0), run_loop($$$$$$$core$Model$sq$(((_file_0 - 1) >>> 0), _source_rank_0)), 64));
  const _right_0 = run_loop($Bool$pick$((_file_0 < 7), run_loop($$$$$$$core$Model$sq$(((_file_0 + 1) >>> 0), _source_rank_0)), 64));
  const _x_0 = run_loop($$$$$$$core$Geometry$pawn_square_ok$(_p_0, _left_0, _by_side_0));
  const _x_1 = run_loop($$$$$$$core$Geometry$pawn_square_ok$(_p_0, _right_0, _by_side_0));
  return (_x_0 || _x_1);
}

function $$$$$$$core$Geometry$scan_knight$(_p_0, _target_0, _by_side_0) {
  return run_jump($$$$$$$core$Geometry$scan_knight$go$, [8n, _p_0, _target_0, _by_side_0, 0, false]);
}

function $$$$$$$core$Geometry$scan_king$(_p_0, _target_0, _by_side_0) {
  return run_jump($$$$$$$core$Geometry$scan_king$go$, [8n, _p_0, _target_0, _by_side_0, 0, false]);
}

function $$$$$$$core$Geometry$rays$(_p_0, _target_0, _by_side_0, _diagonal_0) {
  return run_jump($Bool$pick$, [_diagonal_0, run_loop($$$$$$$core$Geometry$rays$go$(4n, _p_0, _target_0, _by_side_0, true, 0, false)), run_loop($$$$$$$core$Geometry$rays$go$(4n, _p_0, _target_0, _by_side_0, false, 4, false))]);
}

function $$$$$$$core$Model$board_get$(_board_0, _index_0) {
  return run_jump($$$$$$$core$Model$board_get$go$, [_board_0, _index_0, (_index_0 === 0)]);
}

function $$$$$$$core$Model$decode_promotion$(_id_0) {
  return (5 === 0 ? _id_0 : _id_0 % 5);
}

function $$$$$$$core$v2$RuleContracts$cell$(_p_0, _action_0, _s_0) {
  if (_action_0.$ === "MoveAction") {
    const _a_0 = _action_0["from"];
    const _b_0 = _action_0["to"];
    const _tag_0 = _action_0["promotion"];
    const _x_0 = run_loop($$$$$$$core$v2$RuleContracts$rook_destination$(_p_0, _b_0));
    const _x_1 = run_loop($$$$$$$core$Model$pos_ep_pawn$(_p_0));
    const _x_2 = run_loop($$$$$$$core$v2$RuleContracts$rook_source$(_p_0, _b_0));
    const _x_3 = run_loop($Bool$and$(run_loop($$$$$$$core$v2$RuleContracts$ep$(_p_0, _a_0, _b_0)), (_s_0 === _x_1)));
    const _x_4 = run_loop($Bool$and$(run_loop($$$$$$$core$v2$RuleContracts$castle_shape$(_p_0, _a_0, _b_0)), (_s_0 === _x_2)));
    const _x_5 = (_s_0 === _a_0);
    const _x_6 = (_x_3 || _x_4);
    return run_jump($Bool$pick$, [(_s_0 === _b_0), run_loop($$$$$$$core$v2$RuleContracts$transported$(_p_0, run_loop($$$$$$$core$v2$RuleContracts$at$(_p_0, _a_0)), _b_0, _tag_0)), run_loop($Bool$pick$(run_loop($Bool$and$(run_loop($$$$$$$core$v2$RuleContracts$castle_shape$(_p_0, _a_0, _b_0)), (_s_0 === _x_0))), run_loop($$$$$$$core$v2$RuleContracts$at$(_p_0, run_loop($$$$$$$core$v2$RuleContracts$rook_source$(_p_0, _b_0)))), run_loop($Bool$pick$((_x_5 || _x_6), 0, run_loop($$$$$$$core$v2$RuleContracts$at$(_p_0, _s_0))))))]);
  } else {
    const _a_1 = _action_0["from"];
    const _b_1 = _action_0["to"];
    const _tag_1 = _action_0["promotion"];
    const _x_7 = run_loop($$$$$$$core$Model$file_of$(_s_0));
    const _x_8 = run_loop($$$$$$$core$Model$rank_of$(_s_0));
    const _x_9 = (2 === 0 ? _x_8 : _x_8 % 2);
    const _x_10 = (2 === 0 ? _x_7 : _x_7 % 2);
    const _x_11 = (Math.imul(2, _x_9) >>> 0);
    const _offset_0 = ((_x_10 + _x_11) >>> 0);
    const _x_12 = run_loop($$$$$$$core$Model$macro_of$(_s_0));
    const _x_13 = run_loop($$$$$$$core$Model$macro_of$(_s_0));
    return run_jump($Bool$pick$, [(_x_12 === _a_1), 0, run_loop($Bool$pick$((_x_13 === _b_1), run_loop($$$$$$$core$v2$RuleContracts$transported$(_p_0, run_loop($$$$$$$core$v2$RuleContracts$at$(_p_0, run_loop($$$$$$$core$Model$square_in_macro$(_a_1, _offset_0)))), _s_0, _tag_1)), run_loop($$$$$$$core$v2$RuleContracts$at$(_p_0, _s_0))))]);
  }
}

function $$$$$$$core$Model$macro_mask$(_macro_0) {
  const _x_0 = BigInt(_macro_0);
  return (_x_0 >= 32n ? 0 : (1 << Number(_x_0)) >>> 0);
}

function $$$$$$$core$Model$pos_rights$(_p_0) {
  const _board_0 = _p_0["board"];
  const _holes_0 = _p_0["holes"];
  const _side_0 = _p_0["side"];
  const _rights_0 = _p_0["rights"];
  const _ep_0 = _p_0["ep"];
  const _epPawn_0 = _p_0["epPawn"];
  const _quiet_0 = _p_0["quiet"];
  const _full_0 = _p_0["full"];
  return _rights_0;
}

function $Bool$to_u32$(_b_0) {
  if (!_b_0) {
    return 0;
  } else {
    return 1;
  }
}

function $$$$$$$core$v2$RuleContracts$right_survives$(_p_0, _action_0, _home_0, _side_0) {
  if (_action_0.$ === "MoveAction") {
    const _a_0 = _action_0["from"];
    const _b_0 = _action_0["to"];
    const _tag_0 = _action_0["promotion"];
    const _x_0 = run_loop($$$$$$$core$Model$pos_side$(_p_0));
    const _x_1 = run_loop($$$$$$$core$Model$piece_type$(run_loop($$$$$$$core$v2$RuleContracts$at$(_p_0, _a_0))));
    const _x_2 = run_loop($$$$$$$core$Model$piece_type$(run_loop($$$$$$$core$v2$RuleContracts$at$(_p_0, _a_0))));
    const _x_3 = run_loop($$$$$$$core$Model$piece_type$(run_loop($$$$$$$core$v2$RuleContracts$at$(_p_0, _b_0))));
    const _x_4 = run_loop($Bool$and$((_a_0 === _home_0), (_x_2 === 4)));
    const _x_5 = run_loop($Bool$and$((_b_0 === _home_0), (_x_3 === 4)));
    const _x_6 = run_loop($Bool$and$(run_loop($Bool$not$((_x_0 !== _side_0))), (_x_1 === 6)));
    const _x_7 = (_x_4 || _x_5);
    return run_jump($Bool$not$, [(_x_6 || _x_7)]);
  } else {
    const _a_1 = _action_0["from"];
    const _b_1 = _action_0["to"];
    const _tag_1 = _action_0["promotion"];
    const _x_8 = run_loop($$$$$$$core$Model$macro_of$(_home_0));
    const _x_9 = run_loop($$$$$$$core$Model$piece_type$(run_loop($$$$$$$core$v2$RuleContracts$at$(_p_0, _home_0))));
    return run_jump($Bool$not$, [run_loop($Bool$and$((_a_1 === _x_8), (_x_9 === 4)))]);
  }
}

function $$$$$$$core$v2$RuleContracts$at$(_p_0, _s_0) {
  return run_jump($$$$$$$core$Model$board_get$, [run_loop($$$$$$$core$Model$pos_board$(_p_0)), _s_0]);
}

function $$$$$$$core$Geometry$abs_diff$(_a_0, _b_0) {
  return run_jump($Bool$pick$, [(_a_0 >= _b_0), ((_a_0 - _b_0) >>> 0), ((_b_0 - _a_0) >>> 0)]);
}

function $$$$$$$core$Model$sq$(_file_0, _rank_0) {
  const _x_0 = (Math.imul(_rank_0, 8) >>> 0);
  return ((_x_0 + _file_0) >>> 0);
}

function $$$$$$$core$v2$RuleContracts$ep$(_p_0, _a_0, _b_0) {
  const _x_0 = run_loop($$$$$$$core$Model$pos_ep$(_p_0));
  const _x_1 = run_loop($$$$$$$core$Model$pos_ep_pawn$(_p_0));
  const _x_2 = run_loop($$$$$$$core$Model$file_of$(_a_0));
  const _x_3 = run_loop($$$$$$$core$Model$file_of$(_b_0));
  return run_jump($Bool$and$, [run_loop($$$$$$$core$Model$is_pawn$(run_loop($$$$$$$core$v2$RuleContracts$at$(_p_0, _a_0)))), run_loop($Bool$and$((_b_0 === _x_0), run_loop($Bool$and$((_x_1 < 64), (_x_2 !== _x_3)))))]);
}

function $$$$$$$core$Model$pos_quiet$(_p_0) {
  const _board_0 = _p_0["board"];
  const _holes_0 = _p_0["holes"];
  const _side_0 = _p_0["side"];
  const _rights_0 = _p_0["rights"];
  const _ep_0 = _p_0["ep"];
  const _epPawn_0 = _p_0["epPawn"];
  const _quiet_0 = _p_0["quiet"];
  const _full_0 = _p_0["full"];
  return _quiet_0;
}

function $$$$$$$core$Model$pos_full$(_p_0) {
  const _board_0 = _p_0["board"];
  const _holes_0 = _p_0["holes"];
  const _side_0 = _p_0["side"];
  const _rights_0 = _p_0["rights"];
  const _ep_0 = _p_0["ep"];
  const _epPawn_0 = _p_0["epPawn"];
  const _quiet_0 = _p_0["quiet"];
  const _full_0 = _p_0["full"];
  return _full_0;
}

function $$$$$$$core$Model$present$in_range$(_holes_0, _square_0, _in_range_0) {
  if (!_in_range_0) {
    return false;
  } else {
    const _x_0 = run_loop($$$$$$$core$Model$macro_mask$(run_loop($$$$$$$core$Model$macro_of$(_square_0))));
    const _x_1 = ((_holes_0 & _x_0) >>> 0);
    return (_x_1 === 0);
  }
}

function $$$$$$$core$Geometry$pawn_square_ok$(_p_0, _square_0, _by_side_0) {
  return run_jump($Bool$and$, [(_square_0 < 64), run_loop($Bool$and$(run_loop($$$$$$$core$Model$present$(run_loop($$$$$$$core$Model$pos_holes$(_p_0)), _square_0)), run_loop($Bool$and$(run_loop($$$$$$$core$Model$same_side$(run_loop($$$$$$$core$Geometry$board_get$(run_loop($$$$$$$core$Model$pos_board$(_p_0)), _square_0)), _by_side_0)), run_loop($$$$$$$core$Model$is_pawn$(run_loop($$$$$$$core$Geometry$board_get$(run_loop($$$$$$$core$Model$pos_board$(_p_0)), _square_0))))))))]);
}

function $$$$$$$core$Geometry$scan_knight$go$(_fuel_0, _p_0, _target_0, _by_side_0, _dir_0, _any_0) {
  if (_fuel_0 === 0n) {
    return _any_0;
  } else {
    const _rest_0 = (_fuel_0 - 1n);
    const _x_0 = run_loop($$$$$$$core$Geometry$square_piece_ok$(_p_0, run_loop($$$$$$$core$Geometry$knight_source$(_target_0, _dir_0)), _by_side_0, 2));
    return run_jump($$$$$$$core$Geometry$scan_knight$go$, [_rest_0, _p_0, _target_0, _by_side_0, ((_dir_0 + 1) >>> 0), (_any_0 || _x_0)]);
  }
}

function $$$$$$$core$Geometry$scan_king$go$(_fuel_0, _p_0, _target_0, _by_side_0, _dir_0, _any_0) {
  if (_fuel_0 === 0n) {
    return _any_0;
  } else {
    const _rest_0 = (_fuel_0 - 1n);
    const _x_0 = run_loop($$$$$$$core$Geometry$square_piece_ok$(_p_0, run_loop($$$$$$$core$Geometry$neighbor$(_target_0, _dir_0)), _by_side_0, 6));
    return run_jump($$$$$$$core$Geometry$scan_king$go$, [_rest_0, _p_0, _target_0, _by_side_0, ((_dir_0 + 1) >>> 0), (_any_0 || _x_0)]);
  }
}

function $$$$$$$core$Geometry$rays$go$(_fuel_0, _p_0, _target_0, _by_side_0, _diagonal_0, _dir_0, _any_0) {
  if (_fuel_0 === 0n) {
    return _any_0;
  } else {
    const _rest_0 = (_fuel_0 - 1n);
    const _x_0 = run_loop($$$$$$$core$Geometry$ray$(_p_0, _target_0, _by_side_0, _dir_0, _diagonal_0));
    return run_jump($$$$$$$core$Geometry$rays$go$, [_rest_0, _p_0, _target_0, _by_side_0, _diagonal_0, ((_dir_0 + 1) >>> 0), (_any_0 || _x_0)]);
  }
}

function $$$$$$$core$Model$board_get$go$(_board_0, _index_0, _zero_0) {
  if (_board_0.$ === "Nil") {
    return 0;
  } else {
    const _h_0 = _board_0["head"];
    const _t_0 = _board_0["tail"];
    if (_zero_0) {
      return _h_0;
    } else {
      const _next_0 = ((_index_0 - 1) >>> 0);
      return run_jump($$$$$$$core$Model$board_get$go$, [_t_0, _next_0, (_next_0 === 0)]);
    }
  }
}

function $$$$$$$core$v2$RuleContracts$transported$(_p_0, _code_0, _to_0, _tag_0) {
  const _kind_0 = run_loop($Bool$pick$((_tag_0 === 1), 5, run_loop($Bool$pick$((_tag_0 === 2), 4, run_loop($Bool$pick$((_tag_0 === 3), 3, 2))))));
  return run_jump($Bool$pick$, [run_loop($$$$$$$core$Model$is_pawn$(_code_0)), run_loop($$$$$$$core$Model$encode_piece$(run_loop($$$$$$$core$Model$pos_side$(_p_0)), run_loop($Bool$pick$(run_loop($$$$$$$core$v2$RuleContracts$last$(_p_0, _to_0)), _kind_0, 1)))), _code_0]);
}

function $$$$$$$core$v2$RuleContracts$castle_shape$(_p_0, _a_0, _b_0) {
  const _x_0 = run_loop($$$$$$$core$Model$piece_type$(run_loop($$$$$$$core$v2$RuleContracts$at$(_p_0, _a_0))));
  const _x_1 = run_loop($$$$$$$core$Geometry$abs_diff$(run_loop($$$$$$$core$Model$file_of$(_a_0)), run_loop($$$$$$$core$Model$file_of$(_b_0))));
  return run_jump($Bool$and$, [(_x_0 === 6), (_x_1 === 2)]);
}

function $$$$$$$core$v2$RuleContracts$rook_destination$(_p_0, _b_0) {
  const _x_0 = run_loop($$$$$$$core$Model$file_of$(_b_0));
  return run_jump($$$$$$$core$Model$sq$, [run_loop($Bool$pick$((_x_0 === 6), 5, 3)), run_loop($Bool$pick$(run_loop($$$$$$$core$Model$pos_side$(_p_0)), 0, 7))]);
}

function $$$$$$$core$v2$RuleContracts$rook_source$(_p_0, _b_0) {
  const _x_0 = run_loop($$$$$$$core$Model$file_of$(_b_0));
  return run_jump($$$$$$$core$Model$sq$, [run_loop($Bool$pick$((_x_0 === 6), 7, 0)), run_loop($Bool$pick$(run_loop($$$$$$$core$Model$pos_side$(_p_0)), 0, 7))]);
}

function $$$$$$$core$Model$pos_ep_pawn$(_p_0) {
  const _board_0 = _p_0["board"];
  const _holes_0 = _p_0["holes"];
  const _side_0 = _p_0["side"];
  const _rights_0 = _p_0["rights"];
  const _ep_0 = _p_0["ep"];
  const _epPawn_0 = _p_0["epPawn"];
  const _quiet_0 = _p_0["quiet"];
  const _full_0 = _p_0["full"];
  return _epPawn_0;
}

function $$$$$$$core$Model$macro_of$(_square_0) {
  const _x_0 = run_loop($$$$$$$core$Model$rank_of$(_square_0));
  const _x_1 = (2 === 0 ? 0 : (_x_0 / 2) >>> 0);
  const _x_2 = run_loop($$$$$$$core$Model$file_of$(_square_0));
  const _x_3 = (Math.imul(_x_1, 4) >>> 0);
  const _x_4 = (2 === 0 ? 0 : (_x_2 / 2) >>> 0);
  return ((_x_3 + _x_4) >>> 0);
}

function $$$$$$$core$Model$square_in_macro$(_macro_0, _offset_0) {
  const _x_0 = run_loop($$$$$$$core$Model$macro_file$(_macro_0));
  const _x_1 = (Math.imul(_x_0, 2) >>> 0);
  const _x_2 = (2 === 0 ? _offset_0 : _offset_0 % 2);
  const _file_0 = ((_x_1 + _x_2) >>> 0);
  const _x_3 = run_loop($$$$$$$core$Model$macro_rank$(_macro_0));
  const _x_4 = (Math.imul(_x_3, 2) >>> 0);
  const _x_5 = (2 === 0 ? 0 : (_offset_0 / 2) >>> 0);
  const _rank_0 = ((_x_4 + _x_5) >>> 0);
  return run_jump($$$$$$$core$Model$sq$, [_file_0, _rank_0]);
}

function $$$$$$$core$Model$pos_ep$(_p_0) {
  const _board_0 = _p_0["board"];
  const _holes_0 = _p_0["holes"];
  const _side_0 = _p_0["side"];
  const _rights_0 = _p_0["rights"];
  const _ep_0 = _p_0["ep"];
  const _epPawn_0 = _p_0["epPawn"];
  const _quiet_0 = _p_0["quiet"];
  const _full_0 = _p_0["full"];
  return _ep_0;
}

function $$$$$$$core$Geometry$board_get$(_board_0, _index_0) {
  return run_jump($$$$$$$core$Model$board_get$, [_board_0, _index_0]);
}

function $$$$$$$core$Geometry$square_piece_ok$(_p_0, _square_0, _by_side_0, _predicate_0) {
  const _x_0 = run_loop($$$$$$$core$Model$piece_type$(run_loop($$$$$$$core$Geometry$board_get$(run_loop($$$$$$$core$Model$pos_board$(_p_0)), _square_0))));
  return run_jump($Bool$and$, [(_square_0 < 64), run_loop($Bool$and$(run_loop($$$$$$$core$Model$present$(run_loop($$$$$$$core$Model$pos_holes$(_p_0)), _square_0)), run_loop($Bool$and$(run_loop($$$$$$$core$Model$same_side$(run_loop($$$$$$$core$Geometry$board_get$(run_loop($$$$$$$core$Model$pos_board$(_p_0)), _square_0)), _by_side_0)), (_x_0 === _predicate_0)))))]);
}

function $$$$$$$core$Geometry$knight_source$(_target_0, _d0_0) {
  return run_jump($$$$$$$core$Geometry$knight_case$, [_d0_0, run_loop($$$$$$$core$Model$file_of$(_target_0)), run_loop($$$$$$$core$Model$rank_of$(_target_0))]);
}

function $$$$$$$core$Geometry$neighbor$(_square_0, _d0_0) {
  return run_jump($$$$$$$core$Geometry$neighbor_case$, [_d0_0, run_loop($$$$$$$core$Model$file_of$(_square_0)), run_loop($$$$$$$core$Model$rank_of$(_square_0))]);
}

function $$$$$$$core$Geometry$ray$(_p_0, _target_0, _by_side_0, _dir_0, _diagonal_0) {
  return run_jump($$$$$$$core$Geometry$ray$go$, [8n, _p_0, _target_0, _by_side_0, _dir_0, _diagonal_0, run_loop($$$$$$$core$Geometry$neighbor$(_target_0, _dir_0))]);
}

function $$$$$$$core$Model$encode_piece$(_side_0, _kind_0) {
  return run_jump($Bool$pick$, [_side_0, _kind_0, ((_kind_0 + 8) >>> 0)]);
}

function $$$$$$$core$v2$RuleContracts$last$(_p_0, _s_0) {
  const _x_0 = run_loop($$$$$$$core$Model$rank_of$(_s_0));
  const _x_1 = run_loop($Bool$pick$(run_loop($$$$$$$core$Model$pos_side$(_p_0)), 7, 0));
  return (_x_0 === _x_1);
}

function $$$$$$$core$Model$macro_file$(_macro_0) {
  return (4 === 0 ? _macro_0 : _macro_0 % 4);
}

function $$$$$$$core$Model$macro_rank$(_macro_0) {
  return (4 === 0 ? 0 : (_macro_0 / 4) >>> 0);
}

function $$$$$$$core$Geometry$knight_case$(_d0_0, _file_0, _rank_0) {
  if (_d0_0 == 0) {
    return run_jump($Bool$pick$, [run_loop($Bool$and$((_file_0 < 7), (_rank_0 < 6))), run_loop($$$$$$$core$Model$sq$(((_file_0 + 1) >>> 0), ((_rank_0 + 2) >>> 0))), 64]);
  } else if ((_d0_0 & 7) == 0) {
    const _24_0 = u32_to_word(_d0_0)["tail"]["tail"]["tail"]["head"];
    const _25_0 = u32_to_word(_d0_0)["tail"]["tail"]["tail"]["tail"];
    return run_jump($Bool$pick$, [run_loop($Bool$and$((_file_0 > 1), (_rank_0 > 0))), run_loop($$$$$$$core$Model$sq$(((_file_0 - 2) >>> 0), ((_rank_0 - 1) >>> 0))), 64]);
  } else if (_d0_0 == 4) {
    return run_jump($Bool$pick$, [run_loop($Bool$and$((_file_0 < 6), (_rank_0 < 7))), run_loop($$$$$$$core$Model$sq$(((_file_0 + 2) >>> 0), ((_rank_0 + 1) >>> 0))), 64]);
  } else if ((_d0_0 & 7) == 4) {
    const _82_0 = u32_to_word(_d0_0)["tail"]["tail"]["tail"]["head"];
    const _83_0 = u32_to_word(_d0_0)["tail"]["tail"]["tail"]["tail"];
    return run_jump($Bool$pick$, [run_loop($Bool$and$((_file_0 > 1), (_rank_0 > 0))), run_loop($$$$$$$core$Model$sq$(((_file_0 - 2) >>> 0), ((_rank_0 - 1) >>> 0))), 64]);
  } else if (_d0_0 == 2) {
    return run_jump($Bool$pick$, [run_loop($Bool$and$((_file_0 > 0), (_rank_0 < 6))), run_loop($$$$$$$core$Model$sq$(((_file_0 - 1) >>> 0), ((_rank_0 + 2) >>> 0))), 64]);
  } else if ((_d0_0 & 7) == 2) {
    const _142_0 = u32_to_word(_d0_0)["tail"]["tail"]["tail"]["head"];
    const _143_0 = u32_to_word(_d0_0)["tail"]["tail"]["tail"]["tail"];
    return run_jump($Bool$pick$, [run_loop($Bool$and$((_file_0 > 1), (_rank_0 > 0))), run_loop($$$$$$$core$Model$sq$(((_file_0 - 2) >>> 0), ((_rank_0 - 1) >>> 0))), 64]);
  } else if (_d0_0 == 6) {
    return run_jump($Bool$pick$, [run_loop($Bool$and$((_file_0 > 1), (_rank_0 < 7))), run_loop($$$$$$$core$Model$sq$(((_file_0 - 2) >>> 0), ((_rank_0 + 1) >>> 0))), 64]);
  } else if ((_d0_0 & 7) == 6) {
    const _200_0 = u32_to_word(_d0_0)["tail"]["tail"]["tail"]["head"];
    const _201_0 = u32_to_word(_d0_0)["tail"]["tail"]["tail"]["tail"];
    return run_jump($Bool$pick$, [run_loop($Bool$and$((_file_0 > 1), (_rank_0 > 0))), run_loop($$$$$$$core$Model$sq$(((_file_0 - 2) >>> 0), ((_rank_0 - 1) >>> 0))), 64]);
  } else if (_d0_0 == 1) {
    return run_jump($Bool$pick$, [run_loop($Bool$and$((_file_0 < 7), (_rank_0 > 1))), run_loop($$$$$$$core$Model$sq$(((_file_0 + 1) >>> 0), ((_rank_0 - 2) >>> 0))), 64]);
  } else if ((_d0_0 & 7) == 1) {
    const _262_0 = u32_to_word(_d0_0)["tail"]["tail"]["tail"]["head"];
    const _263_0 = u32_to_word(_d0_0)["tail"]["tail"]["tail"]["tail"];
    return run_jump($Bool$pick$, [run_loop($Bool$and$((_file_0 > 1), (_rank_0 > 0))), run_loop($$$$$$$core$Model$sq$(((_file_0 - 2) >>> 0), ((_rank_0 - 1) >>> 0))), 64]);
  } else if (_d0_0 == 5) {
    return run_jump($Bool$pick$, [run_loop($Bool$and$((_file_0 < 6), (_rank_0 > 0))), run_loop($$$$$$$core$Model$sq$(((_file_0 + 2) >>> 0), ((_rank_0 - 1) >>> 0))), 64]);
  } else if ((_d0_0 & 7) == 5) {
    const _320_0 = u32_to_word(_d0_0)["tail"]["tail"]["tail"]["head"];
    const _321_0 = u32_to_word(_d0_0)["tail"]["tail"]["tail"]["tail"];
    return run_jump($Bool$pick$, [run_loop($Bool$and$((_file_0 > 1), (_rank_0 > 0))), run_loop($$$$$$$core$Model$sq$(((_file_0 - 2) >>> 0), ((_rank_0 - 1) >>> 0))), 64]);
  } else if (_d0_0 == 3) {
    return run_jump($Bool$pick$, [run_loop($Bool$and$((_file_0 > 0), (_rank_0 > 1))), run_loop($$$$$$$core$Model$sq$(((_file_0 - 1) >>> 0), ((_rank_0 - 2) >>> 0))), 64]);
  } else {
    const _378_0 = u32_to_word(_d0_0)["tail"]["tail"]["head"];
    const _379_0 = u32_to_word(_d0_0)["tail"]["tail"]["tail"];
    return run_jump($Bool$pick$, [run_loop($Bool$and$((_file_0 > 1), (_rank_0 > 0))), run_loop($$$$$$$core$Model$sq$(((_file_0 - 2) >>> 0), ((_rank_0 - 1) >>> 0))), 64]);
  }
}

function $$$$$$$core$Geometry$neighbor_case$(_d0_0, _file_0, _rank_0) {
  if (_d0_0 == 0) {
    return run_jump($Bool$pick$, [run_loop($Bool$and$((_file_0 < 7), (_rank_0 < 7))), run_loop($$$$$$$core$Model$sq$(((_file_0 + 1) >>> 0), ((_rank_0 + 1) >>> 0))), 64]);
  } else if ((_d0_0 & 7) == 0) {
    const _24_0 = u32_to_word(_d0_0)["tail"]["tail"]["tail"]["head"];
    const _25_0 = u32_to_word(_d0_0)["tail"]["tail"]["tail"]["tail"];
    return run_jump($Bool$pick$, [(_file_0 > 0), run_loop($$$$$$$core$Model$sq$(((_file_0 - 1) >>> 0), _rank_0)), 64]);
  } else if (_d0_0 == 4) {
    return run_jump($Bool$pick$, [(_rank_0 < 7), run_loop($$$$$$$core$Model$sq$(_file_0, ((_rank_0 + 1) >>> 0))), 64]);
  } else if ((_d0_0 & 7) == 4) {
    const _82_0 = u32_to_word(_d0_0)["tail"]["tail"]["tail"]["head"];
    const _83_0 = u32_to_word(_d0_0)["tail"]["tail"]["tail"]["tail"];
    return run_jump($Bool$pick$, [(_file_0 > 0), run_loop($$$$$$$core$Model$sq$(((_file_0 - 1) >>> 0), _rank_0)), 64]);
  } else if (_d0_0 == 2) {
    return run_jump($Bool$pick$, [run_loop($Bool$and$((_file_0 > 0), (_rank_0 < 7))), run_loop($$$$$$$core$Model$sq$(((_file_0 - 1) >>> 0), ((_rank_0 + 1) >>> 0))), 64]);
  } else if ((_d0_0 & 7) == 2) {
    const _142_0 = u32_to_word(_d0_0)["tail"]["tail"]["tail"]["head"];
    const _143_0 = u32_to_word(_d0_0)["tail"]["tail"]["tail"]["tail"];
    return run_jump($Bool$pick$, [(_file_0 > 0), run_loop($$$$$$$core$Model$sq$(((_file_0 - 1) >>> 0), _rank_0)), 64]);
  } else if (_d0_0 == 6) {
    return run_jump($Bool$pick$, [(_file_0 < 7), run_loop($$$$$$$core$Model$sq$(((_file_0 + 1) >>> 0), _rank_0)), 64]);
  } else if ((_d0_0 & 7) == 6) {
    const _200_0 = u32_to_word(_d0_0)["tail"]["tail"]["tail"]["head"];
    const _201_0 = u32_to_word(_d0_0)["tail"]["tail"]["tail"]["tail"];
    return run_jump($Bool$pick$, [(_file_0 > 0), run_loop($$$$$$$core$Model$sq$(((_file_0 - 1) >>> 0), _rank_0)), 64]);
  } else if (_d0_0 == 1) {
    return run_jump($Bool$pick$, [run_loop($Bool$and$((_file_0 < 7), (_rank_0 > 0))), run_loop($$$$$$$core$Model$sq$(((_file_0 + 1) >>> 0), ((_rank_0 - 1) >>> 0))), 64]);
  } else if ((_d0_0 & 7) == 1) {
    const _262_0 = u32_to_word(_d0_0)["tail"]["tail"]["tail"]["head"];
    const _263_0 = u32_to_word(_d0_0)["tail"]["tail"]["tail"]["tail"];
    return run_jump($Bool$pick$, [(_file_0 > 0), run_loop($$$$$$$core$Model$sq$(((_file_0 - 1) >>> 0), _rank_0)), 64]);
  } else if (_d0_0 == 5) {
    return run_jump($Bool$pick$, [(_rank_0 > 0), run_loop($$$$$$$core$Model$sq$(_file_0, ((_rank_0 - 1) >>> 0))), 64]);
  } else if ((_d0_0 & 7) == 5) {
    const _320_0 = u32_to_word(_d0_0)["tail"]["tail"]["tail"]["head"];
    const _321_0 = u32_to_word(_d0_0)["tail"]["tail"]["tail"]["tail"];
    return run_jump($Bool$pick$, [(_file_0 > 0), run_loop($$$$$$$core$Model$sq$(((_file_0 - 1) >>> 0), _rank_0)), 64]);
  } else if (_d0_0 == 3) {
    return run_jump($Bool$pick$, [run_loop($Bool$and$((_file_0 > 0), (_rank_0 > 0))), run_loop($$$$$$$core$Model$sq$(((_file_0 - 1) >>> 0), ((_rank_0 - 1) >>> 0))), 64]);
  } else {
    const _378_0 = u32_to_word(_d0_0)["tail"]["tail"]["head"];
    const _379_0 = u32_to_word(_d0_0)["tail"]["tail"]["tail"];
    return run_jump($Bool$pick$, [(_file_0 > 0), run_loop($$$$$$$core$Model$sq$(((_file_0 - 1) >>> 0), _rank_0)), 64]);
  }
}

function $$$$$$$core$Geometry$ray$go$(_fuel_0, _p_0, _target_0, _by_side_0, _dir_0, _diagonal_0, _next_0) {
  if (_fuel_0 === 0n) {
    return false;
  } else {
    const _rest_0 = (_fuel_0 - 1n);
    if (_next_0 == 64) {
      return false;
    } else {
      const _35_0 = u32_to_word(_next_0)["head"];
      const _36_0 = u32_to_word(_next_0)["tail"];
      const _present_0 = run_loop($$$$$$$core$Model$present$(run_loop($$$$$$$core$Model$pos_holes$(_p_0)), word_to_u32({$: "WCon", ["head"]: _35_0, ["tail"]: _36_0})));
      const _code_0 = run_loop($$$$$$$core$Geometry$board_get$(run_loop($$$$$$$core$Model$pos_board$(_p_0)), word_to_u32({$: "WCon", ["head"]: _35_0, ["tail"]: _36_0})));
      const _empty_0 = (_code_0 === 0);
      const _kind_0 = run_loop($$$$$$$core$Model$piece_type$(_code_0));
      const _x_0 = (_kind_0 === 3);
      const _x_1 = (_kind_0 === 5);
      const _diag_piece_0 = (_x_0 || _x_1);
      const _x_2 = (_kind_0 === 4);
      const _x_3 = (_kind_0 === 5);
      const _orth_piece_0 = (_x_2 || _x_3);
      return run_jump($Bool$and$, [_present_0, run_loop($Bool$pick$(_empty_0, run_loop($$$$$$$core$Geometry$ray$go$(_rest_0, _p_0, word_to_u32({$: "WCon", ["head"]: _35_0, ["tail"]: _36_0}), _by_side_0, _dir_0, _diagonal_0, run_loop($$$$$$$core$Geometry$neighbor$(word_to_u32({$: "WCon", ["head"]: _35_0, ["tail"]: _36_0}), _dir_0)))), run_loop($Bool$and$(run_loop($$$$$$$core$Model$same_side$(_code_0, _by_side_0)), run_loop($Bool$pick$(_diagonal_0, _diag_piece_0, _orth_piece_0))))))]);
    }
  }
}

const TAB_0 = [0, 100, 320, 335, 510, 930, 0, 100, 0];
function* $web0(_p_0, _ids_0) {
  return web_tail(1, [_p_0, _ids_0], false, {"web":"require","site":"choose:8:../../core/AI.choose"});
}

function* $web1(_p_0, _ids_0) {
  return web_tail(2, [(yield web_call(3, [2n, _ids_0, _p_0], false, {"site":"../../core/AI.choose:107:../../core/AI.parallel"}))], false, {"site":"../../core/AI.choose:107:../../core/AI.choice_id"});
}

function* $web3(_depth_0, _ids_0, _p_0) {
  if (_depth_0 === 0n) {
    return web_tail(4, [_ids_0, _p_0, {$: "Choice", ["score"]: 0, ["id"]: 21760}], false, {"site":"../../core/AI.parallel:96:../../core/AI.sequential"});
  } else {
    const _rest_0 = (_depth_0 - 1n);
    const _parts_0 = (yield web_call(5, [_ids_0], false, {"site":"../../core/AI.parallel:98:../../core/AI.split"}));
    const _web_fork_0 = (yield web_fork(0, [{id: 3, args: [_rest_0, (yield web_call(6, [_parts_0], false, {"site":"../../core/AI.parallel:99:../../core/AI.left"})), _p_0], ...{"marked":false,"site":"../../core/AI.parallel:99:../../core/AI.parallel"}}, {id: 3, args: [_rest_0, (yield web_call(7, [_parts_0], false, {"site":"../../core/AI.parallel:99:../../core/AI.right"})), _p_0], ...{"marked":false,"site":"../../core/AI.parallel:99:../../core/AI.parallel"}}]));
    return web_tail(8, [_web_fork_0[0], _web_fork_0[1]], false, {"site":"../../core/AI.parallel:100:../../core/AI.better"});
  }
}


export const manifest = freezeProgramData({"protocol":1,"program":"77d80270fe5ce1c4e629cb179921a71ae81a2530df0f388205587bab60414259","backend":"bend-web-workers-2","mode":"required-only","policy":"strict","schemas":[{"kind":"adt","name":"../../core/Model.Position","arms":[{"tag":"Pos","fields":[{"name":"board","schema":1},{"name":"holes","schema":2},{"name":"side","schema":3},{"name":"rights","schema":2},{"name":"ep","schema":2},{"name":"epPawn","schema":2},{"name":"quiet","schema":4},{"name":"full","schema":4}]}]},{"kind":"adt","name":"List","arms":[{"tag":"Nil","fields":[]},{"tag":"Con","fields":[{"name":"head","schema":2},{"name":"tail","schema":1}]}]},{"kind":"u32"},{"kind":"bool"},{"kind":"nat"},{"kind":"adt","name":"../../core/AI.Choice","arms":[{"tag":"Choice","fields":[{"name":"score","schema":2},{"name":"id","schema":2}]}]},{"kind":"adt","name":"../../core/AI.Split","arms":[{"tag":"Split","fields":[{"name":"left","schema":1},{"name":"right","schema":1}]}]},{"kind":"adt","name":"Maybe","arms":[{"tag":"None","fields":[]},{"tag":"Some","fields":[{"name":"value","schema":8}]}]},{"kind":"adt","name":"../../core/Model.Action","arms":[{"tag":"MoveAction","fields":[{"name":"from","schema":2},{"name":"to","schema":2},{"name":"promotion","schema":2}]},{"tag":"ShiftAction","fields":[{"name":"from","schema":2},{"name":"to","schema":2},{"name":"promotion","schema":2}]}]},{"kind":"adt","name":"Maybe","arms":[{"tag":"None","fields":[]},{"tag":"Some","fields":[{"name":"value","schema":2}]}]}],"functions":[{"id":0,"name":"choose","arity":2,"inputs":[0,1],"output":2,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":true,"reachesRequire":true,"maySuspend":true,"hasFork":true},{"id":1,"name":"../../core/AI.choose","arity":2,"inputs":[0,1],"output":2,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":true,"hasFork":true},{"id":2,"name":"../../core/AI.choice_id","arity":1,"inputs":[5],"output":2,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":3,"name":"../../core/AI.parallel","arity":3,"inputs":[4,1,0],"output":5,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":true,"hasFork":true},{"id":4,"name":"../../core/AI.sequential","arity":3,"inputs":[1,0,5],"output":5,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":5,"name":"../../core/AI.split","arity":1,"inputs":[1],"output":6,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":6,"name":"../../core/AI.left","arity":1,"inputs":[6],"output":1,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":7,"name":"../../core/AI.right","arity":1,"inputs":[6],"output":1,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":8,"name":"../../core/AI.better","arity":2,"inputs":[5,5],"output":5,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":9,"name":"../../core/AI.score","arity":2,"inputs":[0,2],"output":2,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":10,"name":"../../core/AI.split_join","arity":2,"inputs":[2,6],"output":6,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":11,"name":"Bool.pick","arity":3,"inputs":null,"output":null,"reasons":["open_wire_type"],"eligible":false,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":12,"name":"Bool.and","arity":2,"inputs":[3,3],"output":3,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":13,"name":"../../core/v2/RuleContracts.expected","arity":2,"inputs":[0,2],"output":0,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":14,"name":"../../core/AI.board_score","arity":4,"inputs":[1,3,2,2],"output":2,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":15,"name":"../../core/Model.pos_board","arity":1,"inputs":[0],"output":1,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":16,"name":"../../core/Model.pos_side","arity":1,"inputs":[0],"output":3,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":17,"name":"../../core/Geometry.in_check","arity":2,"inputs":[0,3],"output":3,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":18,"name":"../../core/AI.hanging_decoded","arity":2,"inputs":[0,7],"output":2,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":19,"name":"../../core/Model.decode","arity":1,"inputs":[2],"output":7,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":20,"name":"../../core/v2/RuleContracts.expected_decoded","arity":2,"inputs":[0,7],"output":0,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":21,"name":"../../core/Model.occupied","arity":1,"inputs":[2],"output":3,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":22,"name":"../../core/AI.piece_score","arity":2,"inputs":[2,2],"output":2,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":23,"name":"../../core/Model.same_side","arity":2,"inputs":[2,3],"output":3,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":24,"name":"../../core/Geometry.in_check.got","arity":3,"inputs":[0,3,9],"output":3,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":25,"name":"../../core/Geometry.find_king","arity":2,"inputs":[0,3],"output":9,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":26,"name":"../../core/AI.hanging_action","arity":2,"inputs":[0,8],"output":2,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":27,"name":"../../core/Model.decode.in_range","arity":2,"inputs":[2,3],"output":7,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":28,"name":"../../core/v2/RuleContracts.expected_action","arity":2,"inputs":[0,8],"output":0,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":29,"name":"../../core/Model.piece_type","arity":1,"inputs":[2],"output":2,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":30,"name":"../../core/AI.center","arity":1,"inputs":[2],"output":2,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":31,"name":"../../core/Model.file_of","arity":1,"inputs":[2],"output":2,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":32,"name":"../../core/Model.rank_of","arity":1,"inputs":[2],"output":2,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":33,"name":"../../core/Model.is_white","arity":1,"inputs":[2],"output":3,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":34,"name":"../../core/AI.weight","arity":1,"inputs":[2],"output":2,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":35,"name":"../../core/Model.is_pawn","arity":1,"inputs":[2],"output":3,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":36,"name":"../../core/Model.is_black","arity":1,"inputs":[2],"output":3,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":37,"name":"../../core/Geometry.attacked","arity":3,"inputs":[0,2,3],"output":3,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":38,"name":"../../core/Geometry.opposite","arity":1,"inputs":[3],"output":3,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":39,"name":"../../core/Geometry.find_king.scan","arity":3,"inputs":[1,2,3],"output":9,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":40,"name":"../../core/AI.hanging_at","arity":3,"inputs":[0,2,3],"output":2,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":41,"name":"../../core/Model.decode_move","arity":1,"inputs":[2],"output":8,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":42,"name":"../../core/Model.decode_shift","arity":1,"inputs":[2],"output":8,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":43,"name":"../../core/v2/RuleContracts.expected_board","arity":4,"inputs":[4,0,8,2],"output":1,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":44,"name":"../../core/v2/RuleContracts.holes","arity":2,"inputs":[0,8],"output":2,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":45,"name":"Bool.not","arity":1,"inputs":[3],"output":3,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":46,"name":"../../core/v2/RuleContracts.rights","arity":2,"inputs":[0,8],"output":2,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":47,"name":"../../core/v2/RuleContracts.ep_target","arity":2,"inputs":[0,8],"output":2,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":48,"name":"../../core/v2/RuleContracts.ep_victim","arity":2,"inputs":[0,8],"output":2,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":49,"name":"../../core/v2/RuleContracts.quiet","arity":2,"inputs":[0,8],"output":4,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":50,"name":"../../core/v2/RuleContracts.full","arity":1,"inputs":[0],"output":4,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":51,"name":"../../core/Model.present","arity":2,"inputs":[2,2],"output":3,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":52,"name":"../../core/Model.pos_holes","arity":1,"inputs":[0],"output":2,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":53,"name":"../../core/Geometry.attacked_pawn","arity":3,"inputs":[0,2,3],"output":3,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":54,"name":"../../core/Geometry.scan_knight","arity":3,"inputs":[0,2,3],"output":3,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":55,"name":"../../core/Geometry.scan_king","arity":3,"inputs":[0,2,3],"output":3,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":56,"name":"../../core/Geometry.rays","arity":4,"inputs":[0,2,3,3],"output":3,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":57,"name":"../../core/Model.board_get","arity":2,"inputs":[1,2],"output":2,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":58,"name":"../../core/Model.decode_promotion","arity":1,"inputs":[2],"output":2,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":59,"name":"../../core/v2/RuleContracts.cell","arity":3,"inputs":[0,8,2],"output":2,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":60,"name":"../../core/Model.macro_mask","arity":1,"inputs":[2],"output":2,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":61,"name":"../../core/Model.pos_rights","arity":1,"inputs":[0],"output":2,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":62,"name":"Bool.to_u32","arity":1,"inputs":[3],"output":2,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":63,"name":"../../core/v2/RuleContracts.right_survives","arity":4,"inputs":[0,8,2,3],"output":3,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":64,"name":"../../core/v2/RuleContracts.at","arity":2,"inputs":[0,2],"output":2,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":65,"name":"../../core/Geometry.abs_diff","arity":2,"inputs":[2,2],"output":2,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":66,"name":"../../core/Model.sq","arity":2,"inputs":[2,2],"output":2,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":67,"name":"../../core/v2/RuleContracts.ep","arity":3,"inputs":[0,2,2],"output":3,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":68,"name":"../../core/Model.pos_quiet","arity":1,"inputs":[0],"output":4,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":69,"name":"../../core/Model.pos_full","arity":1,"inputs":[0],"output":4,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":70,"name":"../../core/Model.present.in_range","arity":3,"inputs":[2,2,3],"output":3,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":71,"name":"../../core/Geometry.pawn_square_ok","arity":3,"inputs":[0,2,3],"output":3,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":72,"name":"../../core/Geometry.scan_knight.go","arity":6,"inputs":[4,0,2,3,2,3],"output":3,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":73,"name":"../../core/Geometry.scan_king.go","arity":6,"inputs":[4,0,2,3,2,3],"output":3,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":74,"name":"../../core/Geometry.rays.go","arity":7,"inputs":[4,0,2,3,3,2,3],"output":3,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":75,"name":"../../core/Model.board_get.go","arity":3,"inputs":[1,2,3],"output":2,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":76,"name":"../../core/v2/RuleContracts.transported","arity":4,"inputs":[0,2,2,2],"output":2,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":77,"name":"../../core/v2/RuleContracts.castle_shape","arity":3,"inputs":[0,2,2],"output":3,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":78,"name":"../../core/v2/RuleContracts.rook_destination","arity":2,"inputs":[0,2],"output":2,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":79,"name":"../../core/v2/RuleContracts.rook_source","arity":2,"inputs":[0,2],"output":2,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":80,"name":"../../core/Model.pos_ep_pawn","arity":1,"inputs":[0],"output":2,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":81,"name":"../../core/Model.macro_of","arity":1,"inputs":[2],"output":2,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":82,"name":"../../core/Model.square_in_macro","arity":2,"inputs":[2,2],"output":2,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":83,"name":"../../core/Model.pos_ep","arity":1,"inputs":[0],"output":2,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":84,"name":"../../core/Geometry.board_get","arity":2,"inputs":[1,2],"output":2,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":85,"name":"../../core/Geometry.square_piece_ok","arity":4,"inputs":[0,2,3,2],"output":3,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":86,"name":"../../core/Geometry.knight_source","arity":2,"inputs":[2,2],"output":2,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":87,"name":"../../core/Geometry.neighbor","arity":2,"inputs":[2,2],"output":2,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":88,"name":"../../core/Geometry.ray","arity":5,"inputs":[0,2,3,2,3],"output":3,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":89,"name":"../../core/Model.encode_piece","arity":2,"inputs":[3,2],"output":2,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":90,"name":"../../core/v2/RuleContracts.last","arity":2,"inputs":[0,2],"output":3,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":91,"name":"../../core/Model.macro_file","arity":1,"inputs":[2],"output":2,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":92,"name":"../../core/Model.macro_rank","arity":1,"inputs":[2],"output":2,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":93,"name":"../../core/Geometry.knight_case","arity":3,"inputs":[2,2,2],"output":2,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":94,"name":"../../core/Geometry.neighbor_case","arity":3,"inputs":[2,2,2],"output":2,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false},{"id":95,"name":"../../core/Geometry.ray.go","arity":7,"inputs":[4,0,2,3,2,3,2],"output":3,"reasons":[],"eligible":true,"reachesMark":false,"reachesPolicy":false,"reachesRequire":false,"maySuspend":false,"hasFork":false}],"sites":[{"id":0,"function":"../../core/AI.parallel","line":99,"children":[3,3]}],"exports":{"choose":0},"artifacts":{"entry":"index.mjs","program":"bend-77d80270fe5ce1c4.program.mjs","worker":"bend-77d80270fe5ce1c4.worker.mjs","runtime":"bend-77d80270fe5ce1c4.runtime.mjs","manifest":"manifest.json"}});
export const serial = Object.freeze([
  (...args) => run_loop($choose$(...args)),
  (...args) => run_loop($$$$$$$core$AI$choose$(...args)),
  (...args) => run_loop($$$$$$$core$AI$choice_id$(...args)),
  (...args) => run_loop($$$$$$$core$AI$parallel$(...args)),
  (...args) => run_loop($$$$$$$core$AI$sequential$(...args)),
  (...args) => run_loop($$$$$$$core$AI$split$(...args)),
  (...args) => run_loop($$$$$$$core$AI$left$(...args)),
  (...args) => run_loop($$$$$$$core$AI$right$(...args)),
  (...args) => run_loop($$$$$$$core$AI$better$(...args)),
  (...args) => run_loop($$$$$$$core$AI$score$(...args)),
  (...args) => run_loop($$$$$$$core$AI$split_join$(...args)),
  (...args) => run_loop($Bool$pick$(...args)),
  (...args) => run_loop($Bool$and$(...args)),
  (...args) => run_loop($$$$$$$core$v2$RuleContracts$expected$(...args)),
  (...args) => run_loop($$$$$$$core$AI$board_score$(...args)),
  (...args) => run_loop($$$$$$$core$Model$pos_board$(...args)),
  (...args) => run_loop($$$$$$$core$Model$pos_side$(...args)),
  (...args) => run_loop($$$$$$$core$Geometry$in_check$(...args)),
  (...args) => run_loop($$$$$$$core$AI$hanging_decoded$(...args)),
  (...args) => run_loop($$$$$$$core$Model$decode$(...args)),
  (...args) => run_loop($$$$$$$core$v2$RuleContracts$expected_decoded$(...args)),
  (...args) => run_loop($$$$$$$core$Model$occupied$(...args)),
  (...args) => run_loop($$$$$$$core$AI$piece_score$(...args)),
  (...args) => run_loop($$$$$$$core$Model$same_side$(...args)),
  (...args) => run_loop($$$$$$$core$Geometry$in_check$got$(...args)),
  (...args) => run_loop($$$$$$$core$Geometry$find_king$(...args)),
  (...args) => run_loop($$$$$$$core$AI$hanging_action$(...args)),
  (...args) => run_loop($$$$$$$core$Model$decode$in_range$(...args)),
  (...args) => run_loop($$$$$$$core$v2$RuleContracts$expected_action$(...args)),
  (...args) => run_loop($$$$$$$core$Model$piece_type$(...args)),
  (...args) => run_loop($$$$$$$core$AI$center$(...args)),
  (...args) => run_loop($$$$$$$core$Model$file_of$(...args)),
  (...args) => run_loop($$$$$$$core$Model$rank_of$(...args)),
  (...args) => run_loop($$$$$$$core$Model$is_white$(...args)),
  (...args) => run_loop($$$$$$$core$AI$weight$(...args)),
  (...args) => run_loop($$$$$$$core$Model$is_pawn$(...args)),
  (...args) => run_loop($$$$$$$core$Model$is_black$(...args)),
  (...args) => run_loop($$$$$$$core$Geometry$attacked$(...args)),
  (...args) => run_loop($$$$$$$core$Geometry$opposite$(...args)),
  (...args) => run_loop($$$$$$$core$Geometry$find_king$scan$(...args)),
  (...args) => run_loop($$$$$$$core$AI$hanging_at$(...args)),
  (...args) => run_loop($$$$$$$core$Model$decode_move$(...args)),
  (...args) => run_loop($$$$$$$core$Model$decode_shift$(...args)),
  (...args) => run_loop($$$$$$$core$v2$RuleContracts$expected_board$(...args)),
  (...args) => run_loop($$$$$$$core$v2$RuleContracts$holes$(...args)),
  (...args) => run_loop($Bool$not$(...args)),
  (...args) => run_loop($$$$$$$core$v2$RuleContracts$rights$(...args)),
  (...args) => run_loop($$$$$$$core$v2$RuleContracts$ep_target$(...args)),
  (...args) => run_loop($$$$$$$core$v2$RuleContracts$ep_victim$(...args)),
  (...args) => run_loop($$$$$$$core$v2$RuleContracts$quiet$(...args)),
  (...args) => run_loop($$$$$$$core$v2$RuleContracts$full$(...args)),
  (...args) => run_loop($$$$$$$core$Model$present$(...args)),
  (...args) => run_loop($$$$$$$core$Model$pos_holes$(...args)),
  (...args) => run_loop($$$$$$$core$Geometry$attacked_pawn$(...args)),
  (...args) => run_loop($$$$$$$core$Geometry$scan_knight$(...args)),
  (...args) => run_loop($$$$$$$core$Geometry$scan_king$(...args)),
  (...args) => run_loop($$$$$$$core$Geometry$rays$(...args)),
  (...args) => run_loop($$$$$$$core$Model$board_get$(...args)),
  (...args) => run_loop($$$$$$$core$Model$decode_promotion$(...args)),
  (...args) => run_loop($$$$$$$core$v2$RuleContracts$cell$(...args)),
  (...args) => run_loop($$$$$$$core$Model$macro_mask$(...args)),
  (...args) => run_loop($$$$$$$core$Model$pos_rights$(...args)),
  (...args) => run_loop($Bool$to_u32$(...args)),
  (...args) => run_loop($$$$$$$core$v2$RuleContracts$right_survives$(...args)),
  (...args) => run_loop($$$$$$$core$v2$RuleContracts$at$(...args)),
  (...args) => run_loop($$$$$$$core$Geometry$abs_diff$(...args)),
  (...args) => run_loop($$$$$$$core$Model$sq$(...args)),
  (...args) => run_loop($$$$$$$core$v2$RuleContracts$ep$(...args)),
  (...args) => run_loop($$$$$$$core$Model$pos_quiet$(...args)),
  (...args) => run_loop($$$$$$$core$Model$pos_full$(...args)),
  (...args) => run_loop($$$$$$$core$Model$present$in_range$(...args)),
  (...args) => run_loop($$$$$$$core$Geometry$pawn_square_ok$(...args)),
  (...args) => run_loop($$$$$$$core$Geometry$scan_knight$go$(...args)),
  (...args) => run_loop($$$$$$$core$Geometry$scan_king$go$(...args)),
  (...args) => run_loop($$$$$$$core$Geometry$rays$go$(...args)),
  (...args) => run_loop($$$$$$$core$Model$board_get$go$(...args)),
  (...args) => run_loop($$$$$$$core$v2$RuleContracts$transported$(...args)),
  (...args) => run_loop($$$$$$$core$v2$RuleContracts$castle_shape$(...args)),
  (...args) => run_loop($$$$$$$core$v2$RuleContracts$rook_destination$(...args)),
  (...args) => run_loop($$$$$$$core$v2$RuleContracts$rook_source$(...args)),
  (...args) => run_loop($$$$$$$core$Model$pos_ep_pawn$(...args)),
  (...args) => run_loop($$$$$$$core$Model$macro_of$(...args)),
  (...args) => run_loop($$$$$$$core$Model$square_in_macro$(...args)),
  (...args) => run_loop($$$$$$$core$Model$pos_ep$(...args)),
  (...args) => run_loop($$$$$$$core$Geometry$board_get$(...args)),
  (...args) => run_loop($$$$$$$core$Geometry$square_piece_ok$(...args)),
  (...args) => run_loop($$$$$$$core$Geometry$knight_source$(...args)),
  (...args) => run_loop($$$$$$$core$Geometry$neighbor$(...args)),
  (...args) => run_loop($$$$$$$core$Geometry$ray$(...args)),
  (...args) => run_loop($$$$$$$core$Model$encode_piece$(...args)),
  (...args) => run_loop($$$$$$$core$v2$RuleContracts$last$(...args)),
  (...args) => run_loop($$$$$$$core$Model$macro_file$(...args)),
  (...args) => run_loop($$$$$$$core$Model$macro_rank$(...args)),
  (...args) => run_loop($$$$$$$core$Geometry$knight_case$(...args)),
  (...args) => run_loop($$$$$$$core$Geometry$neighbor_case$(...args)),
  (...args) => run_loop($$$$$$$core$Geometry$ray$go$(...args)),
]);
export const coordinators = Object.freeze([$web0, $web1, null, $web3, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null]);
