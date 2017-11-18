grid(3, 3).
obstacle(2, 1).
rock(1, 1, s0).
pad(1, 2).
r2d2(2, 0, s0).
teleportal(0, 2).

% is_empty(X, Y, s):-
%   \+(r2d2(X, Y, s)),
%   \+(obstacle(X, Y, s)),
%   \+(rock(X, Y, s)),
%   \+(teleportal(X, Y, s)).

r2d2(X, Y, do(A, S)):-
  (
    (A = north, X1 is X + 1,\+(obstacle(X, Y)), X >= 0,r2d2(X1, Y, S), (\+rock(X,Y, S) ; \+(X = 0)));
    (A = south, X1 is X - 1,\+(obstacle(X, Y)), X < 3, r2d2(X1, Y, S), (\+rock(X,Y, S) ; \+(X = 2)));
    (A = west, Y1 is Y + 1,\+(obstacle(X, Y)), Y >= 0, r2d2(X, Y1, S), (\+rock(X,Y, S) ; \+(Y = 0)));
    (A = east,Y1 is Y - 1,\+(obstacle(X, Y)), Y < 3, r2d2(X, Y1, S), (\+rock(X,Y, S) ; \+(Y = 2)))
  ).
  
  
  % ;
  % r2d2(X, Y, S),
  % (
  %   (\+(A = north); ( (X1 is X - 1, obstacle(X1, Y)); X = 0)),
  %   (\+(A = south); ( (X1 is X + 1, obstacle(X1, Y)); X = 2)),
  %   (\+(A = west); ((Y1 is Y - 1, obstacle(X, Y1));Y = 0)),
  %   (\+(A = east); ((Y1 is Y + 1, obstacle(X, Y1));Y = 2))
  % ).

 rock(X, Y, do(A, S)):-
  \+var(X),
  \+var(Y),
   (
     (A = north,XA is X + 2, r2d2(XA, Y, S),XR is X + 1, rock(XR, Y, S), X >= 0, \+(rock(X,Y,S)), \+(obstacle(X,Y)));
     (A = south,XA is X - 2, r2d2(XA, Y, S),XR is X - 1, rock(XR, Y, S), X < 3, \+(rock(X,Y,S)), \+(obstacle(X,Y)));
     (A = west,YA is Y + 2, r2d2(X, YA, S),YR is Y + 1, rock(X, YR, S), Y>=0, \+(rock(X,Y,S)), \+(obstacle(X,Y)));
     (A = east,YA is Y - 2, r2d2(X, YA, S),YR is Y - 1, rock(X, YR, S), Y < 3, \+(rock(X,Y,S)), \+(obstacle(X,Y)))
   );
   rock(X, Y, S),
   (
     (\+(A = north); ((X1 is X - 1, obstacle(X1, Y)); rock(X1, Y, S); (XA is X + 1, \+(r2d2(XA, Y, S))); X = 0)),
     (\+(A = south); ((X1 is X + 1, obstacle(X1, Y)); rock(X1, Y, S); (XA is X - 1, \+(r2d2(XA, Y, S))); X = 2)),
     (\+(A = west); ((Y1 is Y - 1, obstacle(X, Y1)); rock(X, Y1, S); (YA is Y + 1, \+(r2d2(X, YA, S))); Y = 0)),
     (\+(A = east); ((Y1 is Y + 1, obstacle(X, Y1)); rock(X, Y1, S); (YA is Y - 1, \+(r2d2(X, YA, S))); Y = 2))
   ).

  
