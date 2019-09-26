/* eslint-disable */
/**
 *
 * @param  {Number} hh header height
 * @param  {Number} fh  footer height
 * @return {string}
 */

export function set_main_height(hh, fh) {
  let height = window.innerHeight - hh - fh;
  return height + 'px';
}
