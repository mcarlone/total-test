import Result from "crocks/Result";
import Async from 'crocks/Async'

import getPropOr from 'crocks/helpers/getPropOr'

const { Err, Ok } = Result;
const { fromPromise } = Async


const API_BASE = "https://api-v3.mbta.com";
const API_KEY = "4de50aaa48a84beb81cde31a2bb86282"; // https://api-v3.mbta.com/portal


function FetchExeption(value) {
    this.value = value;
    this.message = "the FetchExeption message";
    this.toString = function() {
        return this.message + ': ' + JSON.stringify(this.value[0].detail);
    };
}

const Mbta = () => {
    const routes = () => {
        return fetch(`${API_BASE}/routes?api_key=${API_KEY}`).then(res => res.json());
    };

    const linesResult = () => {
        
        return fetch(`${API_BASE}/lines?api_key=${API_KEY}`)
            // .then(res => Ok(res.json()))
            .then(res => {
                const json = res.json();
                return Ok(json);
            })
            .catch(error => Err(error));
    };

    const _error = value => new FetchExeption(value);

    const _fetchPromise = async (url) => {
        // check out https://github.com/whatwg/fetch/issues/18#issuecomment-605629519 to improve
        
        return await fetch(url)
            .then(res => res.ok ? res : res.text().then(JSON.parse).then(e => {throw _error(e)}))
            .then(res => res.json())
            .catch(error => {
                throw error;
            });
    };

    const _linesPromise = (options) => {
        // handle defaults, query params
        return _fetchPromise(`${API_BASE}/lines?api_key=${API_KEY}&sort=${options.sortBy}`);    
    };

    const lines = (options) => {
        const getError = err => getPropOr(err, 'value', err);
        const getData = res => res.data;
        return fromPromise(_linesPromise)(options).bimap(getError, getData);
    };

    const routePatterns = () => {
        return fetch(`${API_BASE}/route_patterns?api_key=${API_KEY}`).then(res => res.json());
    }

    return {
        routes,
        lines,
        linesResult,
        routePatterns
    };
}

const log = label => item => {
    console.log(label, item);
    return item;
};




const lines1 = Mbta().lines({sortBy:'-long_name'});
const lines2 = Mbta().lines({sortBy:'-long_name'});

log('FUCK IT')(Async.all([lines1, lines2])).fork(log('rej! all'), log('res! all'));
export default Mbta;