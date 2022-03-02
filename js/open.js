var $ = function(selector) {
  if(selector instanceof HTMLElement) return selector;
  return document.querySelectorAll(selector);
}
