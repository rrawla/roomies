import express                          from 'express';
import React                            from 'react';
import { Router }                       from 'react-router';
import Location                         from 'react-router/lib/Location';
import routes                           from 'routes';
import { applyMiddleware }              from 'redux';
import promiseMiddleware                from 'lib/promiseMiddleware'
import { createStore, combineReducers } from 'redux';
import { Provider }                     from 'react-redux';
import * as reducers                    from 'reducers';

const app = express();

app.use('/api', (req, res) => {
  res.send("hit api server");
});

app.use((req, res) => {
  const location = new Location(req.path, req.query);
  const reducer = combineReducers(reducers);
  const store = createStore(reducer);

  Router.run(routes, location, (err, routeState) => {
    if (err) return console.error(err);
    if (!routeState) return res.status(404).end('404');
    
    const InitialComponent = (
      <Provider store={store}>
        {() =>
          <Router {...routeState} />
        }
      </Provider>
    );
    const componentHTML = React.renderToString(InitialComponent);
    const initialState = store.getState();
    
    const HTML = `
    <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Chore Split App</title>
          <link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css"/>
          <script type="application/javascript">
            window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};  
            window.__TEST__ = "TEST";        
            </script>
        </head>
        <body>
          <div id="react-view">${componentHTML}</div>
          <script type="application/javascript" src="/bundle.js"></script>
        </body>
      </html>    
    `
    res.end(HTML);
  });
});

export default app;