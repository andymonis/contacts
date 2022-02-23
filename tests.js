'use strict';

import V3Store from "/vee3/vee_store.js";
import V3Group from "/vee3/vee_group.js";

class Tests {
    constructor() {
        describe('unauthenticated api', function() {
            it('/ping', async() => {
                let data = await V3Store.$get('/ping');
                assert(data !== undefined, "/ping ran ok");
                assert(data.status === 'ok', "/ping status is ok");
                console.log(JSON.stringify(data))
            });

            it('/register/interest', async() => {
                let data = await V3Store.$post('/register/interest', { email: 'test@example.com', reason: 'I am testing your api' });
                assert(data !== undefined, "/register/interest ran ok");
                assert(data.msg === 'invalid instanceId', "/register/interest is 'invalid instanceId'");
            });

            /**
             * V3Store
             * Local Set
             * Stores locally on the User device
             */
            it('V3Store.$local_remove', async() => {
                let status1 = await V3Store.$local_remove('test_data');
                let status2 = await V3Store.$local_remove('test_name');
                assert(status1 === true, "V3Store.$local_remove ran ok");
                assert(status2 === true, "V3Store.$local_remove ran ok");
            });

            it('V3Store.$local_set', async() => {
                let status_obj = await V3Store.$local_set('test_data', { email: 'test@example.com', reason: 'I am testing your api' });
                assert(status_obj === true, "V3Store.$local_set ran ok");
                let status_json = await V3Store.$local_set('test_name', JSON.stringify({ name: 'Dave Lister' }));
                assert(status_json === true, "V3Store.$local_set ran ok");
            });

            it('V3Store.$local_get', async() => {
                let data1 = await V3Store.$local_get('test_data');
                assert(data1 !== undefined, "V3Store.$local_get ran ok");
                assert(data1.email === 'test@example.com', "V3Store.$local_get email read ok");
                let data2 = await V3Store.$local_get('test_name');
                assert(data2 !== undefined, "V3Store.$local_get ran ok");
                assert(data2.name === 'Dave Lister', "V3Store.$local_get name read ok");
            });

            /**
             * V3Store
             * Private Set
             * Stores remotely on Vee3 for the user. 
             * This is better for user ownership of data and should be used in preference for 
             * any personal data.
             */
            it('V3Store.$private_set', async() => {
                let data1 = await V3Store.$private_set({ "forename": "andy", "surname": "monis" }, 'user.profile');
                assert(data1 !== undefined, "V3Store.$private_set ran ok");
                assert(data1.msg === 'ok', "V3Store.$private_set ok");
            });

            it('V3Store.$private_get', async() => {
                // Test for object that DOES exist
                let data1 = await V3Store.$private_get('user.profile');
                assert(data1 !== undefined, "V3Store.$private_get ran ok");
                assert(data1.obj.forename === 'andy', "V3Store.$private_get forename = andy");
                // Test for object that DOESN'T exist
                let data2 = await V3Store.$private_get('user.address');
                assert(data2 !== undefined, "V3Store.$private_get ran ok");
                assert(data2.obj === undefined, "V3Store.$private_get obj 'user.address' doesn't exist");
            });

            /**
             * V3Store
             * Shared Set
             * Stores remotely on Vee3 for the App 
             * This allows information to be shared between users on the same app
             */
            it('V3Store.$shared_set', async() => {
                let data1 = await V3Store.$shared_set({ "type": "800m", "competitors": 8 }, 'race.type');
                assert(data1 !== undefined, "V3Store.$shared_set ran ok");
                assert(data1.obj.key === 'race.type', "V3Store.$shared_set write ok");
            });

            it('V3Store.$shared_get', async() => {
                let data1 = await V3Store.$shared_get('race.type');
                assert(data1 !== undefined, "V3Store.$shared_set ran ok");
                assert(data1.obj.type === '800m', "V3Store.$shared_get read 800m ok");
                let data2 = await V3Store.$shared_get('races');
                assert(data2 !== undefined, "V3Store.$shared_set ran ok");
                assert(data2.obj === undefined, "V3Store.$shared_get not record found");
            });

            /**
             * V3Groups
             * Group createion and management
             */
            it('V3Groups.$shared_set', async() => {
                let data1 = await V3Store.$shared_set({ "type": "800m", "competitors": 8 }, 'race.type');
                assert(data1 !== undefined, "V3Store.$shared_set ran ok");
                assert(data1.obj.key === 'race.type', "V3Store.$shared_set write ok");
            });

        });

        describe('V3Groups', function() {
            /**
             * V3Groups
             * Group creation and management
             */
            it('V3Groups.$lookup', async() => {
                let data1 = await V3Group.$lookup("mo");
                assert(data1 !== undefined, "V3Group.$lookup ran ok");
                assert(data1.status !== 'error', "V3Group.$lookup didn't error");
                assert(data1.body.group.length === 1, "V3Group.$lookup returned 1 group for andymonis");
            });

            it('V3Groups.$create', async() => {
                let data1 = await V3Group.$create("test_group");
                assert(data1 !== undefined, "V3Group.$create ran ok");
                assert(data1.status !== 'error', "V3Group.$create didn't error");
                assert(data1.body.group.name === "test_group", "V3Group.$create returned 1 group for andymonis");
            });

            it('V3Groups.$add_member & $remove_member', async() => {
                let data = await V3Group.$lookup("test_group");
                // Add a member
                let data1 = await V3Group.$add_member(data.body.group[0].id, 'lisamonis');
                assert(data1 !== undefined, "V3Group.$add_member ran ok");
                assert(data1.status !== 'error', "V3Group.$add_member didn't error");
                assert(data1.body.member = "lisamonis", "V3Group.$add_member returned 1 group with lisamonis added");
                // Check member added
                data = await V3Group.$lookup("test_group");
                assert(data.body.group[0].members.length === 2, "V3Group has 2 members");
                // Remove a member
                let data2 = await V3Group.$remove_member(data.body.group[0].id, 'lisamonis');
                assert(data2.body.member = "lisamonis", "V3Group.$remove_member returned 1 group with lisamonis added");
                // Check member removed
                data = await V3Group.$lookup("test_group");
                assert(data.body.group[0].members.length === 1, "V3Group has 1 member");
            });

        });
    }
}

export default Tests