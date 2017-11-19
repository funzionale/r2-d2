% Some useful notes
% 1) Don't use `not()`!!
% `not()` caused me a problem that was solved by using `\+`
% 2) Prolog uses DFS by default, which causes `out of local stack` error.
% The solution to this problem is to run your queries inside `call_with_depth_limit` which uses 
% iterative deepining instead of DFS
% 3) The definition of obstacle, pad and teleportal have only 2 arguments since these
% are static items that don't depend on any situation
% 4) `teleportal`'s definition is redunant here and was put only for clarity
% 5) `nonvar(X), nonvar(Y)` is a hacky solution for X and Y being unbound 
% at the last iteration of the rock axiom, try to remove them, see the error and fix it :D
% 6) Ana keda edetko l 3elm l tentef3o beeh abtedy Unity ana ba2a :D


grid(3, 3).
obstacle(2, 1).
rock(1, 1, s0).
pad(1, 2).
r2d2(2, 0, s0).
teleportal(0, 2).
% call_with_depth_limit((r2d2(0,2,S), rock(1,2,S)), 6, R).

% grid(3, 3).
% obstacle(1, 2).
% rock(2, 1, s0).
% pad(2, 2).
% r2d2(2, 0, s0).
% teleportal(0, 2).
% call_with_depth_limit((r2d2(0,2,S), rock(2,2,S)), 6, R).

% This doesn't halt :/ 
% grid(3,3).
% teleportal(0,0).
% obstacle(0,2).
% rock(1,1,s0).
% rock(2,1,s0).
% pad(1,2).
% pad(2,2).
% r2d2(2,0,s0).
% call_with_depth_limit((r2d2(0,0,S), rock(1,2,S), rock(2,2,S)), 10, R).


r2d2(X, Y, do(A, S)):-
  grid(M, N),
  (
    (A = north, 
      X1 is X + 1,
      % Make sure obstacles are not present in X,Y
      \+(obstacle(X, Y)), 
      % Make sure you are not exceeding the grid boundaries
      X >= 0,
      % Make sure the agent is not stepping into a rock at the edge of the grid
      (\+rock(X,Y, S) ; \+(X = 0)),
      r2d2(X1, Y, S)
    );
    (
      A = south, 
      X1 is X - 1,
      \+(obstacle(X, Y)), 
      X < M, 
      (\+rock(X,Y, S) ; \+(X is M - 1)),
      r2d2(X1, Y, S)
    );
    (
      A = west, 
      Y1 is Y + 1,
      \+(obstacle(X, Y)), 
      Y >= 0, 
      (\+rock(X,Y, S) ; \+(Y = 0)),
      r2d2(X, Y1, S)
    );
    (
      A = east,
      Y1 is Y - 1,
      \+(obstacle(X, Y)), 
      Y < N, 
      (\+rock(X,Y, S) ; \+(Y is N - 1)),
      r2d2(X, Y1, S)
    )
  );
  grid(M, N),
  r2d2(X, Y, S),
  (
    (
      \+(A = north);
      ((X1 is X - 1, obstacle(X1, Y)); X = 0)
    ),
    (
      \+(A = south); 
      ((X1 is X + 1, obstacle(X1, Y)); X is M - 1)
    ),
    (
      \+(A = west); 
      ((Y1 is Y - 1, obstacle(X, Y1));Y = 0)
    ),
    (
      \+(A = east); 
      ((Y1 is Y + 1, obstacle(X, Y1));Y is N - 1)
    )
  ).

 rock(X, Y, do(A, S)):-
  grid(M, N), 
  % This is the hacky solution that Nourhan added, 
  % try to get rid of it and see if you can fix the error
  nonvar(X),
  nonvar(Y),
   (
     (
      A = north,
      % Check for the agent's position
      XA is X + 2, 
      r2d2(XA, Y, S),
      XR is X + 1, 
      rock(XR, Y, S),
      % Make sure you are not exceeding the grid boundaries
      X >= 0, 
      % Make sure rock's next position doesn't 
      % contain rock or obstacle
      \+(rock(X,Y,S)), 
      \+(obstacle(X,Y))
      );
     (
      A = south,
      XA is X - 2, 
      r2d2(XA, Y, S),
      XR is X - 1, 
      rock(XR, Y, S), 
      X < M, 
      \+(rock(X,Y,S)), 
      \+(obstacle(X,Y))
      );
     (
      A = west,
      YA is Y + 2, 
      r2d2(X, YA, S),
      YR is Y + 1, 
      rock(X, YR, S), 
      Y>=0, 
      \+(rock(X,Y,S)), 
      \+(obstacle(X,Y))
      );
     (
      A = east,
      YA is Y - 2, 
      r2d2(X, YA, S),
      YR is Y - 1, 
      rock(X, YR, S), 
      Y < N, 
      \+(rock(X,Y,S)), 
      \+(obstacle(X,Y))
      )
   );
   grid(M, N),
   rock(X, Y, S),
   (
     (
       \+(A = north); 
       (
        % Next position has an obstacle
        (X1 is X - 1, obstacle(X1, Y)); 
        % The agent was not in the cell underneath the rock
        (XA is X + 1, \+(r2d2(XA, Y, S))); 
        % The rock was already at the edge of the grid
        X = 0;
        rock(X1, Y, S)
        )
      ),
     (
       \+(A = south); 
       (
        (X1 is X + 1, obstacle(X1, Y)); 
        (XA is X - 1, \+(r2d2(XA, Y, S))); 
        X is M - 1;
        rock(X1, Y, S)
        )
      ),
     (
       \+(A = west); 
       (
        (Y1 is Y - 1, obstacle(X, Y1)); 
        (YA is Y + 1, \+(r2d2(X, YA, S)));
        Y = 0;
        rock(X, Y1, S)
        )
      ),
     (
       \+(A = east); 
       (
        (Y1 is Y + 1, obstacle(X, Y1)); 
        (YA is Y - 1, \+(r2d2(X, YA, S))); 
        Y is N - 1;
        rock(X, Y1, S)
        )
      )
   ).

  
