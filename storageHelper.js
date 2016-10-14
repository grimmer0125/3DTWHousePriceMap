import Storage from 'react-native-storage';
import { AsyncStorage } from 'react-native';

console.log("load storage helper");

export var storage = (function () {

    var storage = new Storage({
        // maximum capacity, default 1000
        size: 1000,

        // Use AsyncStorage for RN, or window.localStorage for web.
        // If not set, data would be lost after reload.
        storageBackend: AsyncStorage,

        // expire time, default 1 day(1000 * 3600 * 24 milliseconds).
        // can be null, which means never expire.
        defaultExpires: 1000 * 3600 * 24,

        // cache data in the memory. default is true.
        enableCache: true,

        // if data was not found in storage or expired,
        // the corresponding sync method will be invoked and return
        // the latest data.
        sync : {
            // we'll talk about the details later.
        }
    })

    return {
        save: function(houseData){

            console.log("start save");

            // Save something with key only.
            // Something more unique, and constantly being used.
            // They are permanently stored unless you remove.
            storage.save({
                key: 'houseData',   // Note: Do not use underscore("_") in key!
                rawData: houseData,

                // if not specified, the defaultExpires will be applied instead.
                // if set to null, then it will never expire.
                // expires: 1000 * 60 * 1
                expires: 1000 * 3600 * 24 * 15
            });
        },
        load: function(){
            console.log("start load");

            // load
            return storage.load({
                key: 'houseData',

                // autoSync(default true) means if data not found or expired,
                // then invoke the corresponding sync method
                autoSync: true,

                // syncInBackground(default true) means if data expired,
                // return the outdated data first while invoke the sync method.
                // It can be set to false to always return data provided by sync method when expired.(Of course it's slower)
                syncInBackground: true
            });
        }
    }
})();

console.log("end loading storage helper");
