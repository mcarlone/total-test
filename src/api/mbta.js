import Async from 'crocks/Async'

import getPropOr from 'crocks/helpers/getPropOr'

import { compose, maybeToAsync, chain, safe, isObject } from 'crocks';
// window.hasProp = hasProp

const API_BASE = "https://api-v3.mbta.com";
const API_KEY = "4de50aaa48a84beb81cde31a2bb86282"; // https://api-v3.mbta.com/portal


function FetchExeption(value) {
    this.value = value;
    this.message = "the FetchExeption message";
    this.toString = function() {
        return this.message + ': ' + JSON.stringify(this.value[0].detail);
    };
}

// _fetchPromise :: String -> Promise
const _fetchPromise = async (url) => {
    // check out https://github.com/whatwg/fetch/issues/18#issuecomment-605629519 to improve
    const isOk = response => response.ok ? response.json() : response.text().then(JSON.parse).then(e => Promise.reject(e));
    return await fetch(url).then(isOk)
};

// _formatLinesURL :: URLSearchParams -> string
const _formatLinesURL = params => `${API_BASE}/lines?api_key=${API_KEY}&${params}`;

// _formatUrlParams  :: Object -> URLSearchParams
const _formatUrlParams = params => new URLSearchParams(params);

const _error = value => new FetchExeption(value);

const Mbta = () => {

    // _linesPromise:: Object -> Promise
    const _linesPromise = compose(
        _fetchPromise, // String -> Promise
        _formatLinesURL, // URLSearchParams -> String
        _formatUrlParams // Object -> URLSearchParams
    );

    const lines = compose(
        chain(Async.fromPromise(_linesPromise)), // Async object -> Promise lines req
        maybeToAsync('getLines expects an options object'), // Maybe object -> Async object
        safe(isObject) // object -> Maybe object
    ); 

    return {
        lines
    };
}

const trace = label => item => {
    console.trace(label, item);
    return item;
};

const getError = err => getPropOr(err, 'value', err);
const getData = res => res.data;

const lines1 = Mbta().lines({sort:'-long_name'}).bimap(getError, getData);;
const lines2 = Mbta().lines({sort:'-long_name'}).bimap(getError, getData);;

Async.all([lines1, lines2]).fork(trace('rej! all'), trace('res! all'));
export default Mbta;