/**
 * TestOpen
 * Tests for Open access APIs
 * The general aim of these is to run the un-authenticated
 */

import V3Store from "/vee3/vee_store.js";
import V3Instance from "/vee3/vee_instance.js";

import Tests from "./tests.js";

class Model {
    constructor(api) {
        // name App name
        this.name = ko.observable("testopen");
        // webid The webid (set only if logged in)
        this.webid = ko.observable("");

        this.btn_run_tests = async() => {
            mocha.run();
        }

        this.tests = new Tests();
    }
}

export default class Main {
    constructor(config) {
        try {
            // Set instanceid in the V3Store
            V3Store.instanceId(config.app.instancedid);
            V3Instance.instanceId(config.app.instancedid);
            // Create model
            this.model = new Model(this.api);
            // Set the webid to show auth status
            this.model.webid(config.app.webid);
            // Apply bindings
            ko.applyBindings(this.model);
        } catch (ex) {
            console.log(ex.message)
        }
    }

    async init(config) {}
}