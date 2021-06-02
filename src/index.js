import { writable } from "svelte/store";

let webmonStoreInitState = {
  status: "init",
  state: "",
  monetized: false,
  progress: {},
};

const { subscribe, update } = writable(webmonStoreInitState);

const webmonStore = () => {
  if (typeof window !== "undefined") {
    init();
  }

  return {
    subscribe,
    // todo get events, subscribe to more fn
  };
};

function init() {
  const wm = document.monetization;
  // try to bail early if we don't have support
  if (!wm) {
    update((store) => {
      store.status = "missing-webmon";
      store.monetized = false;
      return store;
    });
    return; // no listeners setup
  }

  try {
    // check the current state right away
    update((store) => {
      store.status = "supports-webmon";
      store.state = wm.state;
      return store;
    });

    // setup our start event listener
    wm.addEventListener("monetizationstart", (ev) => {
      update((store) => {
        store.monetized = true;
        store.state = wm.state;
        return store;
      });
    });
    // @ts-ignore
    wm.addEventListener("monetizationstarted", (ev) => {
      update((store) => {
        store.monetized = true;
        store.state = wm.state;
        return store;
      });
    });

    // setup our progress event listener
    wm.addEventListener("monetizationprogress", (ev) => {
      // debounce?
      update((store) => {
        store.progress = { ev, ts: Date.now() };
        store.state = wm.state;
        if (wm.state === "started") {
          store.monetized = true;
        } else {
          store.monetized = false;
        }
        return store;
      });
    });

    // check the initial state
    if (wm.state === "stopped") {
      update((store) => {
        store.monetized = false;
        store.state = wm.state;
        return store;
      });
    }
  } catch (e) {
    console.error("webmon error", e);
  }
}

export const webmon = webmonStore();
