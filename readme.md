------------- [libraries, constant, assets] ---------------------

App.js <- Reducer <- Actions <-> data_source [db, localsotage] 
  ↓                     ↓
navigator   ->   screens_connect -> screen <- [components, hoc]

---------------------- [tests] ---------------------------------



app.js
library/
constant/
assets/
src/
  -- actions
  -- reducers
  -- data_source
  -- screens_connect
  -- screens
    -- navigator
    -- hoc
    -- componrnts
    -- screens
tests