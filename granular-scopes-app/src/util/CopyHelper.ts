
export class CopyHelper {
   
  /** Function to perform copying generic text to the clipboard */
  static copyToClipboard(message: string) {

    // **** create a textarea so we can select our text ****

    var textArea = document.createElement("textarea");

    // **** set in top-left corner of screen regardless of scroll position ****

    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';

    // **** small as poosible - 1px / 1em gives a negative w/h on some browsers ****

    textArea.style.width = '2em';
    textArea.style.height = '2em';

    // **** don't want padding or borders, reduce size in case it flash renders ****

    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';

    // **** avoid flash of white box if rendered for any reason ****

    textArea.style.background = 'transparent';

    // **** set our text to our data ****

    textArea.value = message;

    // **** add to the DOM ****

    document.body.appendChild(textArea);

    // **** select our element and text ****

    textArea.focus();
    textArea.select();

    // **** copy, ignore errors ****

    try {
      document.execCommand('copy');
    } catch (err) {
      // **** remove our textarea ****

      document.body.removeChild(textArea);

      // **** failed ****

      return false;
    }
    
    // **** remove our textarea ****

    document.body.removeChild(textArea);

    // **** success ****
    
    return true;
  }
}