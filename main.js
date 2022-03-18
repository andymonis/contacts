/**
 * TestOpen
 * Tests for Open access APIs
 * The general aim of these is to run the un-authenticated
 */

import V3Store from "/vee3/vee_store.js";
import V3Instance from "/vee3/vee_instance.js";
import V3Contact from "/vee3/vee_contact.js";

import Tests from "./tests.js";

class Model {
    constructor(api) {
        this.webid = ko.observable("");
        this.contacts = ko.observableArray([]);
        this.txt_userid = ko.observable("");

        this.refresh = async () => {
            let list1 = await V3Contact.$list();
            if(list1.status === "ok"){
                this.contacts(list1.body.contacts);
            }
        }

        this.on_add = async (data,evt) => {
            // Add the contact
            await this.add(this.txt_userid());
            // reset the input
            this.txt_userid("");
        }

        this.add = async (contact_id) => {
            let contact1 = new V3Contact.$Contact({name:contact_id, contact_id:contact_id});
            let create1 = await V3Contact.$create(contact1);
            // Check results
            if(create1.status === "ok"){
                console.log(`OK: ${create1.msg}`);
            } else {
                console.log(`ERROR: ${create1.msg}`);
            }
            // Refresh the contacts
            this.refresh();
        }

        this.on_remove = async (data,evt) => {
            this.remove(data.contact_id);
        }

        this.remove = async (contact_id) => {
            // Delete the contact by ID
            let delete1 = await V3Contact.$delete(contact_id);
            if(delete1.ok === true){
                console.log(`OK: ${delete1.msg}`);
            } else {
                console.log(`ERROR: ${delete1.msg}`);
            }
            // Refresh the contacts
            this.refresh();
        }
    }
}

export default class Main {
    constructor(config) {
        try {
            // Set instanceid in the V3Store
            // V3Store.instanceId(config.app.instancedid);
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

    async init(config) {
        this.model.refresh();
    }
}