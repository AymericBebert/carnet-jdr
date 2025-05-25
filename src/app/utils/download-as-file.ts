export function downloadJson(data: object, fileName: string): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data));
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = dataStr;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
