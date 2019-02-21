const ProxifiedImmutable = require('.');

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

let selectedState = initState.workflows.schemas.workflow_id.id;

let newStateBySetIn = initState.setIn(['workflows', 'schemas', 's2'], Immutable.fromJS({id: 3, name: 's3'}));

console.log('ok');
