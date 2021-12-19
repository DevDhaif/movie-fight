const debounce = (func,delay=1000) => {
    let timeout;
    return (...arg) => {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => {
        func.apply(null, arg);
      }, delay);
    };
  };
