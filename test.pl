
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
        % Next position has a rock
        (X1 is X - 1, rock(X1, Y, S)); 
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
        (X1 is X + 1, rock(X1, Y, S)); 
        (XA is X - 1, \+(r2d2(XA, Y, S))); 
        X is M - 1;
        rock(X1, Y, S)
        )
      ),
     (
       \+(A = west); 
       (
        (Y1 is Y - 1, obstacle(X, Y1)); 
        (Y1 is Y - 1, rock(X, Y1, S)); 
        (YA is Y + 1, \+(r2d2(X, YA, S)));
        Y = 0;
        rock(X, Y1, S)
        )
      ),
     (
       \+(A = east); 
       (
        (Y1 is Y + 1, obstacle(X, Y1)); 
        (Y1 is Y + 1, rock(X, Y1, S)); 
        (YA is Y - 1, \+(r2d2(X, YA, S))); 
        Y is N - 1;
        rock(X, Y1, S)
        )
      )
   ).

  
