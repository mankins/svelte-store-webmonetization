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
  // try to bail early if we don't have support
  if (!document.monetization) {
    update((store) => {
      store.status = "missing-webmon";
      store.monetized = false;
      return store;
    });
    return; // no listeners setup
  }

  try {
    // check the current state right away
    const { state } = document.monetization;
    update((store) => {
      store.status = "supports-webmon";
      store.state = state;
      return store;
    });

    // setup our start event listener
    document.monetization.addEventListener("monetizationstart", (ev) => {
      update((store) => {
        store.monetized = true;
        store.state = state;
        return store;
      });
    });
    document.monetization.addEventListener("monetizationstarted", (ev) => {
      update((store) => {
        store.monetized = true;
        store.state = state;
        return store;
      });
    });

    // setup our progress event listener
    document.monetization.addEventListener("monetizationprogress", (ev) => {
      // debounce?
      update((store) => {
        store.progress = { ev, ts: Date.now() };
        store.state = state;
        if (state === "started") {
          store.monetized = true;
        } else {
          store.monetized = false;
        }
        return store;
      });
    });

    // check the initial state
    if (state === "stopped") {
      update((store) => {
        store.monetized = false;
        store.state = state;
        return store;
      });
    }
  } catch (e) {
    console.error("webmon error", e);
  }
}

export const webmon = webmonStore();
