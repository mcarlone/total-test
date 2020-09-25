import Async from 'crocks/Async'

import { compose, maybeToAsync, chain, safe, isObject, ifElse } from 'crocks';

const API_BASE = "https://api-v3.mbta.com";
const API_KEY = "4de50aaa48a84beb81cde31a2bb86282"; // https://api-v3.mbta.com/portal

// isPropEqual :: String -> Any -> Object -> Boolean
const isPropEqual = prop => value => obj => {
    return obj[prop] === value;
};

// getError :: Response -> Promise.Reject
const getError = response => 
    response.text().then(JSON.parse).then(e => Promise.reject(e));

// getJSON :: Response -> Object
const getJSON = response => 
    response.json();
   
// responseBranch :: Response -> Object | Promise.Reject
const responseBranch = ifElse(isPropEqual('ok')(true), getJSON, getError)

// formatLinesURL :: String -> String
const formatLinesURL = params => 
    `${API_BASE}/lines?api_key=${API_KEY}&${params}`;

// toString :: a -> String
const toString = x => 
    x.toString()

// formatUrlParams  :: Object -> String
const queryString = compose(toString, params => new URLSearchParams(params));

// fetchPromise :: String -> Promise
const fetchPromise = async url => 
    await fetch(url).then(responseBranch);

// linesPromise:: Object -> Promise
const linesPromise = compose(
    fetchPromise,
    formatLinesURL,
    queryString
);

export const getLines = compose(
    chain(Async.fromPromise(linesPromise)),
    maybeToAsync('getLines expects an options object'),
    safe(isObject)
); 

/* NOTES
const getError = err => getPropOr(err, 'value', err);
const getData = res => res.data;

const lines1 = Mbta().lines({sort:'-long_name'}).bimap(getError, getData);;
const lines2 = Mbta().lines({sort:'-long_name'}).bimap(getError, getData);;

Async.all([lines1, lines2]).fork(trace('rej! all'), trace('res! all'));
*/