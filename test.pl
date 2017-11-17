grid(4, 4).
obstacle(1, 1, s0).
rock(2, 1, s0).
r2d2(1, 2, s0).
teleportal(1, 3, s0).
pad(2, 3, s0).

% is_empty(X, Y, s):-
%   not(r2d2(X, Y, s)),
%   not(obstacle(X, Y, s)),
%   not(rock(X, Y, s)),
%   not(teleportal(X, Y, s)).

can_r2d2_move(north, S):-
  r2d2(X, Y, S),
  Y1 is Y - 1,
  not(obstacle(X, Y1, S)),
  Y1 >= 0.

can_r2d2_move(south, S):-
  grid(_, N),
  r2d2(X, Y, S),
  Y1 is Y + 1,
  not(obstacle(X, Y1, S)),
  Y1 < N.

can_r2d2_move(east, S):-
  grid(M, _),
  r2d2(X, Y, S),
  X1 is X + 1,
  not(obstacle(X1, Y, S)),
  X1 < M.

can_r2d2_move(west, S):-
  r2d2(X, Y, S),
  X1 is X - 1,
  not(obstacle(X1, Y, S)),
  X1 >= 0.

r2d2S(X, Y, do(A, S)):-
  r2d2(X1, Y1, S),
  r2d2S(X1, Y1, S),
  (
    (A = north, can_r2d2_move(north, S), X1 is X, Y1 is Y - 1);
    (A = south, can_r2d2_move(south, S), X1 is X, Y1 is Y + 1);
    (A = east, can_r2d2_move(east, S), X1 is X + 1, Y1 is Y);
    (A = west, can_r2d2_move(west, S), X1 is X - 1, Y1 is Y)
  );
  r2d2(X, Y, S),
  r2d2S(X, Y, S),
  (
    not(A = north);
    not(A = south);
    not(A = east);
    not(A = west) 
  ).
