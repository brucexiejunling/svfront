import { supportsPassive } from './event';
import { findDOMNode } from 'react-dom';
import { nextUid } from './string';

const throttle = 80
const components = {}
let defaultCfg = {offsetTop: 50, offsetBottom: 50}
let timeout = null
let isLock = false

function addStack(obj) {
    const id = nextUid()
    components[id] = obj
    return id
}

export function addLazyload (obj, cfg) {
    const rect = findDOMNode(obj).getBoundingClientRect()
    let config = cfg || {};
    if(config.offsetBottom) {
       config.offsetTop = Math.min(config.offsetBottom, defaultCfg.offsetBottom)
    } else {
      config.offsetBottom = defaultCfg.offsetBottom
    }
    if(!config.offsetTop) {
      config.offsetTop = defaultCfg.offsetTop
    }
    obj._config = config;

  if(rect.bottom + config.offsetTop >= 0 && rect.top <= viewportHeight + config.offsetBottom) {
    if(obj.simpleMode) {
      obj.onContentVisible && obj.onContentVisible('init');
    } else {
      if(!obj._visible || document.body.scrollHeight - document.body.scrollTop <= viewportHeight + config.offsetBottom) {
        obj._visible = true;
        obj.onContentVisible && obj.onContentVisible('toTop')
      }
      return addStack(obj);
    }
  } else {
    return addStack(obj)
  }
  if(document.readyState === 'complete') {
    dispatch()
  }
}

export function removeLazyload (id) {
  if (!id) return
  delete components[id]
}

const viewportHeight = window.innerHeight || document.documentElement.clientHeight

export function dispatch () {
  if (isLock) return
  isLock = true

  Object.keys(components).forEach(k => {
    const comp = components[k]
    const config = comp._config;
    const rect = findDOMNode(comp).getBoundingClientRect()

    let direction;
    if(comp._lastTop === undefined || comp._lastTop > rect.top) {
      direction = 'toTop';
    } else {
      direction = 'toBottom';
    }
    comp._lastTop = rect.top;

    if(rect.bottom + config.offsetTop >= 0 && rect.top <= viewportHeight + config.offsetBottom) {
      if(!comp._visible || document.body.scrollHeight - document.body.scrollTop <= viewportHeight + config.offsetBottom) {
        if(document.body.scrollHeight - document.body.scrollTop <= viewportHeight + config.offsetBottom) {
            direction = 'toTop';
        }
        comp._visible = true;
        comp.onContentVisible && comp.onContentVisible(direction)
      }
    } else {
      if(comp._visible) {
        comp.onContentHidden && comp.onContentHidden(direction)
        comp._visible = false;
      }
    }
  });

  isLock = false
}


function scrollHandler() {
  if (timeout) clearTimeout(timeout)
  timeout = setTimeout(() => {
    dispatch()
    timeout = null
  }, throttle)
}

window.addEventListener('load', dispatch)

document.addEventListener('scroll', scrollHandler, supportsPassive ? { passive: true } : false)
