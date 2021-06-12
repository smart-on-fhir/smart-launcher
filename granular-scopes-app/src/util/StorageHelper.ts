
export class StorageHelper {

  /** 
   * Check if local storage is available.
   * Based off detection function example at: 
   * https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
   */
  static checkLocalStorageAvailable() {
    var storage: Storage|null = null;
    try {
        storage = window.localStorage;
        var x:string = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            ((storage) && storage.length !== 0);
    }
  }

  // **** check once ****
  
  static isLocalStorageAvailable:boolean = (StorageHelper.checkLocalStorageAvailable() === true);
}