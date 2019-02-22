# Proxified Immutable

A wrapper for immutable.js using Javascript Proxy.

For the purpose of getting / selecting, iterating, key-checking state by a native Javascript object way.

Reducing the state is still by immutable.js APIs.

Example:

```js
const ProxifiedImmutable = require('proxified_immutable');

const Immutable = require('immutable');

let initState = ProxifiedImmutable(Immutable.fromJS({
    workflows: {
        schemas: {
            workflow_id: {id: 1, name: 's1'},
            s2: {id: 2, name: 's2'}
        },
        instances: {},
        settings: {}
    }
}));

// get / select the state by a native Javascript object way
let selectedState = initState.workflows.schemas.workflow_id.id;  
// result: 1

// reduce the state by immutable.js API
let newStateBySetIn = initState.setIn(['workflows', 'schemas', 's3'], Immutable.fromJS({id: 3, name: 's3'}));
// result: a new proxy proxying the new immutable state

// iterate the selected state
selectedState = initState.workflows.schemas;
for (let key in selectedState) {
    console.log(key);
}
// result:
// workflow_id
// s2
// s3

// key-checking the selected state
if ('s3' in selectedState) {
    console.log('yes');
}

console.log('ok');

```
