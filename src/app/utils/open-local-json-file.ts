/**
 * Opens a file picker dialog and reads the selected JSON file.
 * Returns a Promise that resolves with the parsed JSON object.
 */
export function openAndParseJsonFile(): Promise<any> {
  return new Promise((resolve, reject) => {
    // Create a hidden input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.style.display = 'none';

    // Trigger file input when appended to body
    input.onchange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (!target.files || target.files.length === 0) {
        reject(new Error('No file selected.'));
        return;
      }

      const file = target.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        try {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const json = JSON.parse(reader.result as string);
          resolve(json);
        } catch (e) {
          console.error(e);
          reject(new Error('Invalid JSON file.'));
        }
      };

      reader.onerror = () => {
        reject(new Error('File reading failed.'));
      };

      reader.readAsText(file);
    };

    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  });
}
