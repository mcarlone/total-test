import Async from 'crocks/Async'

import getPropOr from 'crocks/helpers/getPropOr'

import { compose, maybeToAsync, chain, safe, isObject } from 'crocks';

const API_BASE = "https://api-v3.mbta.com";
const API_KEY = "4de50aaa48a84beb81cde31a2bb86282"; // https://api-v3.mbta.com/portal


function FetchExeption(value) {
    this.value = value;
    this.message = "the FetchExeption message";
    this.toString = function() {
        return this.message + ': ' + JSON.stringify(this.value[0].detail);
    };
}

const _fetchPromise = async (url) => {
    // check out https://github.com/whatwg/fetch/issues/18#issuecomment-605629519 to improve
    
    return await fetch(url)
        .then(res => res.ok ? res : res.text().then(JSON.parse).then(e => {throw _error(e)}))
        .then(res => res.json())
        .catch(error => {
            throw error;
        });
};

const _error = value => new FetchExeption(value);

const _urlParams = params => {
    return new URLSearchParams(params);
};

const Mbta = () => {

    // const _linesPromise = (options) => {
    //     const params = _urlParams(options);
    //     const url = `${API_BASE}/lines?api_key=${API_KEY}&${params}`;
    //     return _fetchPromise(url);    
    // };

    // _linesPromise:: Object -> Promise
    const _linesPromise = compose(
        _fetchPromise,
        params => `${API_BASE}/lines?api_key=${API_KEY}&${params}`,
        _urlParams
    );

    const lines = compose(
        chain(Async.fromPromise(_linesPromise)),
        maybeToAsync('getLines expects an options object'),
        safe(isObject)
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